import { Response } from "express";
import moment from "moment";
import mongoose from "mongoose";
import { categoryService, shiprocketService } from ".";
import { categoryModel, orderModel, productModel, subscriberModel, userFeedbackModel, userModel } from "../models";
import { CONSTANT, emailHandler, helper } from "../utils";
import { IRequest, OrderStatus } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * get app users handler
 */
const getUsers = async (queryParams: any) => {
  try {
    let condition: any = {};
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams.textSearch?.length) {
      condition["$or"] = [
        { name: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } },
        { email: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } },
        { mobileNumber: { $regex: helper.regxEscape(queryParams.textSearch), $options: "i" } },
      ];
    }

    if ("createdAt" in queryParams) condition.date = queryParams.createdAt;
    const count = await userModel.countDocuments(condition);
    let mongoQuery = userModel.find(condition).sort({ createdAt: -1 }).lean();
    let docs: any[] = [];

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await userModel.find(condition).sort({ createdAt: -1 });

    let items: any[] = [];

    for await (let user of docs) items.push({ ...user, orderCount: await orderModel.countDocuments({ user: user._id }) });

    return helper.makePaginatedData(items, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get dashboard module count
 */
const adminDashboradInfo = async (req: IRequest) => {
  try {
    let userToJson: any = req.user.toJSON();
    let orderConditions: any = { currentOrderStatus: { $ne: OrderStatus.PENDING } };
    let productConditions: any = {};

    // if (userToJson.role == UserRole.VENDOR) {
    //   productConditions.vendor = userToJson._id;
    //   orderConditions.vendor = req.user._id;
    // } else {
    // }

    // let balance = await transactionService.getBalance(userToJson._id, userToJson.role);
    let balance = 0;
    let productsCount = await productModel.countDocuments(productConditions);

    let totalOrderCount = await shiprocketService.getOrders(null);
    // let cancelOrderCount = await orderModel.countDocuments({
    //   ...orderConditions,
    //   currentOrderStatus: OrderStatus.CANCELLED,
    // });
    // let returnOrderCount = await orderModel.countDocuments({
    //   ...orderConditions,
    //   currentOrderStatus: OrderStatus.RETURNED,
    // });

    // if (userToJson.role == UserRole.VENDOR) return { ordersCount, productsCount, ...balance };

    let usersCount = await userModel.countDocuments({ deleted: false });
    let categoriesCount = await categoryModel.countDocuments({ deleted: false });
    // let collectionsCount = await collectionModel.countDocuments({ deleted: false });
    // let couponsCount = await couponModel.countDocuments({ deleted: false });
    // let vendorsCount = await vendorModel.countDocuments({ deleted: false });
    // let adminsCount = await adminModel.countDocuments({ deleted: false, role: UserRole.ADMIN });

    return {
      usersCount,
      categoriesCount,
      // collectionsCount,
      // couponsCount,
      totalOrderCount: totalOrderCount.meta.pagination.total,
      // cancelOrderCount,
      // returnOrderCount,
      productsCount,
      // vendorsCount,
      // adminsCount,
      // balance,
    };
  } catch (error) {
    throw error;
  }
};

const vendorDashboradInfo = async (req: IRequest) => {
  try {
    let chartYear = req.query?.chartYear ? +req.query?.chartYear : moment().year();
    let currentDate = moment();
    let currentYear = moment().year();
    let userToJson: any = req.user.toJSON();
    let orderCondition: any = {};

    orderCondition.vendor = mongoose.Types.ObjectId(userToJson._id);

    let isCurrentYear = chartYear == currentYear;
    // let balance = await transactionService.getBalance(userToJson._id, userToJson.role);
    let productsCount = await productModel.countDocuments({ vendor: userToJson._id });

    let deleveredOrderValue = await orderModel.aggregate([
      { $match: { ...orderCondition, currentOrderStatus: OrderStatus.DELIVERED } },
      { $group: { _id: "$_id", totalAmount: { $sum: "$total" } } },
    ]);

    let cancelOrderValue = await orderModel.aggregate([
      { $match: { ...orderCondition, currentOrderStatus: OrderStatus.CANCELLED } },
      { $group: { _id: "$_id", totalAmount: { $sum: "$total" } } },
    ]);

    let returnOrderValue = await orderModel.aggregate([
      { $match: { ...orderCondition, currentOrderStatus: OrderStatus.RETURNED } },
      { $group: { _id: "$_id", totalAmount: { $sum: "$total" } } },
    ]);

    let chartConditions: any = {};
    let chartList: any[] = [];

    if (isCurrentYear) {
      chartConditions = { $or: [] };
      let subDate = moment(currentDate.clone().subtract(11, "months").format(CONSTANT.DATE));
      for (let d = subDate; d <= currentDate; d = d.add(1, "months")) {
        chartList.push({ month: d.month() + 1, year: d.year(), name: d.format("MMM") });
        chartConditions["$or"].push({ $and: [{ year: d.year() }, { month: d.month() + 1 }] });
      }
    } else {
      let subDate = moment(new Date(chartYear, 1, 0));
      let lastDate = moment(new Date(chartYear, 12, 0));
      for (let d = subDate; d < lastDate; d = d.add(1, "months")) {
        chartList.push({ month: d.month() + 1, year: d.year(), name: d.format("MMM") });
      }
      chartConditions = { year: chartYear };
    }

    let chartData = await orderModel.aggregate([
      { $addFields: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } } },
      {
        $addFields: {
          stryear: { $toString: { $year: "$createdAt" } },
          strmonth: { $toString: { $month: "$createdAt" } },
        },
      },
      { $addFields: { dd: { $concat: ["$stryear", "-", "$strmonth"] } } },
      {
        $match: {
          ...orderCondition,
          currentOrderStatus: { $in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.RETURNED] },
        },
      },
      { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
      { $unwind: { path: "$product" } },
      { $match: chartConditions },
      { $sort: { year: 1, month: 1 } },
      { $group: { _id: "$dd", month: { $first: "$month" }, year: { $first: "$year" }, orders: { $push: "$$ROOT" } } },
    ]);

    chartData = chartList.map((d: any, i) => {
      let data = (chartData || []).find((m: any) => m.month == d.month);
      let cancelledOrders = data?.orders?.filter((d: any) => d.currentOrderStatus == OrderStatus.CANCELLED) || [];
      let returnedOrders = data?.orders?.filter((d: any) => d.currentOrderStatus == OrderStatus.RETURNED) || [];
      let delevereddOrders = data?.orders?.filter((d: any) => d.currentOrderStatus == OrderStatus.DELIVERED) || [];

      return {
        name: chartList[i]?.name,
        month: chartList[i]?.month,
        year: chartList[i]?.year,
        cancelledOrders: cancelledOrders.reduce((t: any, c: any) => t + c.total, 0),
        returnedOrders: returnedOrders.reduce((t: any, c: any) => t + c.total, 0),
        delevereddOrders: delevereddOrders.reduce((t: any, c: any) => t + c.total, 0),
      };
    });

    return {
      chartData,
      productsCount,
      deleveredOrderValue: deleveredOrderValue[0]?.totalAmount || 0,
      cancelOrderValue: cancelOrderValue[0]?.totalAmount || 0,
      returnOrderValue: returnOrderValue[0]?.totalAmount || 0,
    };
  } catch (error) {
    throw error;
  }
};

const subscribe = async (email: string, res: Response) => {
  try {
    let user = await subscriberModel.findOne({ email });
    if (user) throw helper.buildError("This email already exists", 400);
    await subscriberModel.create({ email });
    helper.buildResponse(res, "Subscribe successfully");
    await emailHandler.sentSubscribeMail(email);
  } catch (error) {
    throw error;
  }
};

const updateStatus = async (userId: string, status: boolean) => {
  try {
    let user = await userModel.findOne({ _id: userId });
    if (!user) throw helper.buildError("no user found with this id", 404);
    await user.set({ isActive: status }).save();
  } catch (error) {
    throw error;
  }
};

const deleteMe = async (req: IRequest) => {
  try {
    return await req.user.delete();
  } catch (error) {
    throw error;
  }
};

const getAppHomePage = async (queryParams: any) => {
  try {
    let { docs: topCategories } = await categoryService.getMainCategories({ page: 1, pageSize: 10, status: true });

    let items: any[] = [];

    for await (let cat of topCategories) {
      items.push({ category: cat, products: await productModel.find({ category: cat._id }).sort({ updatedAt: -1 }).limit(4) });
    }

    return items;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (req: IRequest, data: any) => {
  try {
    await req.user.set(data).save();
  } catch (error) {
    throw error;
  }
};

const saveUserFeedback = async (data: any) => {
  try {
    await userFeedbackModel.create(data);
  } catch (error) {
    throw error;
  }
};

const getFeedBacks = async (queryParams: any) => {
  try {
    let pageInfo = helper.checkPagination(queryParams);
    let docs = [];
    let count = await userFeedbackModel.countDocuments();
    let mongoQuery = userFeedbackModel.find().sort({ createdAt: -1 });

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;
    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

export default {
  getUsers,
  adminDashboradInfo,
  vendorDashboradInfo,
  subscribe,
  updateStatus,
  getAppHomePage,
  updateProfile,
  saveUserFeedback,
  getFeedBacks,
  deleteMe,
};
