import { Parser } from "json2csv";
import _ from "lodash";
import validator from "validator";
import { collectionService } from ".";
import {
  brandModel,
  categoryModel,
  collectionModel,
  orderModel,
  productModel,
  vendorModel,
} from "../models";
import { CONSTANT, fileHandler, helper } from "../utils";
import { ApprovalStatus, HomeProduct, IRequest, PageInfo, UserRole } from "../utils/interfaces";

helper.loadEnvFile();

/**
 * find Product
 */
const findProduct = async (productIdOrSlug: string) => {
  try {
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProduct(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    return product;
  } catch (error) {
    throw error;
  }
};

const checkProductIdOrSlug = (conditions: any, productIdOrSlug: string) => {
  if (validator.isMongoId(productIdOrSlug?.toString())) conditions._id = productIdOrSlug;
  else conditions.slug = productIdOrSlug;
  return conditions;
};

/**
 * find Best Selling Products
 */
const getBestSellingProducts = async (pageInfo: PageInfo | null, conditions: any) => {
  try {
    let docs = pageInfo
      ? [{ $sort: { sumOfQuantity: -1 } }, { $skip: pageInfo.skip }, { $limit: pageInfo.pageSize }]
      : [];

    let stages: any[] = [
      { $unwind: { path: "$orders" } },
      { $unwind: { path: "$orders.products" } },
      { $group: { _id: "$orders.products.item", sumOfQuantity: { $sum: 1 } } },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "item" } },
      { $unwind: { path: "$item" } },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: [{ sumOfQuantity: "$sumOfQuantity" }, "$item"] },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$vendor" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            { $project: { name: 1, vendorInfo: 1 } },
          ],
          as: "vendor",
        },
      },
      { $unwind: { path: "$vendor" } },
      {
        $lookup: {
          from: "vendors",
          let: { id: "$vendor.vendorInfo" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            { $project: { businessName: 1 } },
          ],
          as: "vendor.vendorInfo",
        },
      },
      { $unwind: { path: "$vendor.vendorInfo" } },
      { $match: conditions },
      { $facet: { meta: [{ $count: "count" }], docs: docs } },
      { $unwind: { path: "$meta" } },
      { $project: { count: "$meta.count", docs: "$docs" } },
    ];

    // find ordered products and sort by quantity in desc order
    let orderedProducts: any[] = await orderModel.aggregate(stages);
    let data = orderedProducts[0] ? orderedProducts[0] : [];

    return helper.makePaginatedData(data?.docs ?? [], data?.count || 0, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by collection slug/id handler
 */
const _getProductByCollection = async (collection: any, queryParams: any) => {
  try {
    let conditions: any = { status: true };
    let colToJson: any = collection.toJSON();
    let collConditions: any[] = [];

    if (queryParams?._id) conditions._id = queryParams?._id;

    for (let cond of colToJson.conditions || []) {
      let query = helper.getProductQuery(cond.field, cond.condition, cond.value);
      if (query) collConditions.push(query);
    }

    if (collConditions?.length) {
      if (colToJson.mustMatchAll) conditions["$and"] = collConditions;
      else conditions["$or"] = collConditions;
    }

    if (queryParams.textSearch?.length)
      conditions.metaDescription = {
        $regex: helper.regxEscape(queryParams.textSearch),
        $options: "i",
      };
    return await _populateProduct(productModel.findOne(conditions), queryParams);
  } catch (error) {
    throw error;
  }
};

/**
 * build conditions
 */
const _setConditions = (queryParams: any, conditions: any, userObj: any, role: UserRole) => {
  if (queryParams.textSearch && validator.trim(queryParams.textSearch)?.length) {
    // conditions["name"] = { $search: queryParams.textSearch };
    conditions["name"] = { $regex: queryParams.textSearch, $options: "i" };
  }

  if ("status" in queryParams) conditions.status = queryParams.status;
  if ("createdAt" in queryParams) conditions.date = queryParams.createdAt;
  return conditions;
};

const _populateProductByAdmin = (query: any, queryParams: any, isSingle: boolean = false) => {
  const sortBy = queryParams?.sortBy?.length ? queryParams?.sortBy : "createdAt";
  const orderBy = queryParams?.orderBy ?? "DESC";
  query
    .populate({ path: "brand", select: "brandName image isApproved deleted" })
    .populate({ path: "category", select: "name image status deleted" })
    .populate({ path: "subCategory", select: "name image status deleted" })
    .populate({
      path: "variants",
      withDeleted: false,
      populate: [
        { path: "category", withDelete: false },
        { path: "subCategory", withDelete: false },
        { path: "brand", withDelete: false },
      ],
    });

  if (!isSingle) query.sort({ [sortBy]: orderBy });
  return query;
};

/**
 * populate product data
 */
const _populateProduct = (query: any, queryParams: any, isSingle: boolean = false) => {
  const sortBy = queryParams?.sortBy?.length ? queryParams?.sortBy : "createdAt";
  const orderBy = queryParams?.orderBy ?? "DESC";
  query
    .populate({ path: "brand", withDeleted: false, select: "brandName image isApproved deleted" })
    .populate({ path: "category", withDeleted: false, select: "name image status deleted" })
    .populate({ path: "subCategory", withDeleted: false, select: "name image status deleted" })
    .populate({
      path: "variants",
      withDeleted: false,
      populate: [
        { path: "category", withDelete: false },
        { path: "subCategory", withDelete: false },
        { path: "brand", withDelete: false },
      ],
    });

  if (!isSingle) query.sort({ [sortBy]: orderBy });
  return query;
};

/**
 * sort products variants by price in asc
 */
const _sortVariantsByProducts = (products: any[], role = UserRole.USER, collection?: any) => {
  return products.map((item) => {
    if (collection) item = { ...item._doc, collectionName: collection.title };
    item.variants = _.sortBy(item.variants, ["variant.price"]);
    if (role == UserRole.USER) item.variants = item.variants.filter((v: any) => !v?.deleted);
    item.isFav = false;
    item.isInCart = false;
    return item;
  });
};

/**
 * create product handler
 */
const addProduct = async (req: IRequest, body: any) => {
  try {
    let { variants } = body;

    variants = variants.map((v: any) => ({ ...v, totalQty: v.quantity }));

    let vendorObj: any = req.user.toJSON();

    // if (!vendorObj?.isProfileComplete) throw helper.buildError("Can't add product because your profile is incomplete", 400);
    // if (vendorObj.isApproved != ApprovalStatus.APPROVED) {
    //   throw helper.buildError("Can't add product because your profile status is " + vendorObj.isApproved, 400);
    // }
    // if (!vendorObj.isActive)
    //   throw helper.buildError("Can't add product because your profile is unactivated by admin", 400);
    // let location = await shiprocketService.getPickupAddress(vendorObj.pickupLocation);
    // if (!location?.phone_verified) throw helper.buildError("Your address verification in pending, please try again later", 400);

    return await productModel.create({
      ...body,
      vendor: vendorObj._id,
      variants: _.sortBy(variants, ["variant.mrp"]),
      isApproved: ApprovalStatus.APPROVED,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * update product handler
 */
const updateProduct = async (req: IRequest, productIdOrSlug: string, body: any) => {
  try {
    let { vendor, name, description, images, variants, status, metaDescription } = body;
    let vendorObj: any = req.user.toJSON();

    if (vendor) vendorObj = await vendorModel.findOne({ _id: vendor }).lean();
    const product = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));

    if (!product) throw helper.buildError("No product found with this id", 404);
    const productObj: any = product.toJSON();

    if (productObj.vendor.toString() != vendorObj._id.toString()) {
      throw helper.buildError("You can't update this product", 400);
    }

    if (productObj.variants.length != variants.filter((v: any) => v._id).length) {
      throw helper.buildError("old variant mismatch with new data", 400);
    }

    variants = variants.map((v: any) => {
      if (!v._id) delete v._id;
      return { ...v, totalQty: v.quantity };
    });

    images = images?.length ? images : productObj.images;
    variants = _.sortBy(variants, ["variant.mrp"]);
    const isApproved = ApprovalStatus.APPROVED;
    return await product
      .set({ ...body, isApproved, variants, images, vendor: vendorObj._id })
      .save();
  } catch (error) {
    throw error;
  }
};

/**
 * create product handler
 */
const addProductByAdmin = async (req: IRequest, body: any) => {
  let { parentId } = body;
  let savedProduct = await productModel.create({ ...body, isApproved: ApprovalStatus.APPROVED });
  if (parentId)
    await productModel.updateOne({ _id: parentId }, { $addToSet: { variants: savedProduct._id } });
  return savedProduct;
};

/**
 * update product handler
 */
const updateProductByAdmin = async (req: IRequest, productIdOrSlug: string, body: any) => {
  try {
    let { images } = body;
    const product = await productModel.findOne({ _id: productIdOrSlug });
    if (!product) throw helper.buildError("No product found with this id", 404);
    const productObj: any = product.toJSON();
    const isApproved = ApprovalStatus.APPROVED;
    images = images?.length ? images : productObj.images;
    return await product.set({ ...body, isApproved, images }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * delete product handler
 */
const deleteProduct = async (req: IRequest, productIdOrSlug: string) => {
  try {
    let conditions: any = {};
    const productDoc = await productModel.findOne(
      checkProductIdOrSlug(conditions, productIdOrSlug)
    );
    if (!productDoc) throw helper.buildError("No product found with this id/slug", 404);

    const product: any = productDoc.toJSON();

    if (!product.parentId && product.variants.length) {
      await productModel.updateMany(
        { _id: { $in: product.variants } },
        { $set: { parentId: null } }
      );
    }

    if (product.parentId) await productDoc.set({ parentId: null }).save();

    await productDoc.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * delete product handler
 */
const deleteProductImage = async (productIdOrSlug: string, locations: string[]) => {
  try {
    const product = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);

    const productToJson: any = product.toJSON();
    await product
      .set({ images: productToJson.images.filter((url: any) => locations?.find((e) => url != e)) })
      .save();

    for await (let location of locations) await fileHandler.deleteFromS3(location);
  } catch (error) {
    throw error;
  }
};

/**
 * get single product handler
 */
const getProduct = async (productIdOrSlug: string, queryParams: any) => {
  try {
    let variants: any[] = [];
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProduct(productModel.findOne(conditions), {}, true).lean();

    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    if (product.parentId)
      product = await _populateProduct(productModel.findById(product.parentId), {}, true).lean();

    variants = [...product.variants];
    delete product.variants;
    variants.unshift(product);
    return variants;
  } catch (error) {
    throw error;
  }
};

/**
 * get single product by admin handler
 */
const getProductByAdmin = async (productIdOrSlug: string) => {
  try {
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProductByAdmin(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    return product;
  } catch (error) {
    throw error;
  }
};

/**
 * get single product by vendor handler
 */
const getProductByVendor = async (productIdOrSlug: string) => {
  try {
    let conditions: any = checkProductIdOrSlug({}, productIdOrSlug);
    let product = await _populateProduct(productModel.findOne(conditions), {}, true);
    if (!product) throw helper.buildError("No product found with this id/slug", 404);
    return product;
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by admin handler
 */
const getProductsByAdmin = async (req: IRequest, queryParams: any) => {
  try {
    let conditions: any = {};
    let vendorObj: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, vendorObj, req.role);

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy)
        return await getBestSellingProducts(pageInfo, conditions);
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo)
      docs = await _populateProduct(
        mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize),
        queryParams
      );
    else docs = await _populateProduct(mongoQuery, queryParams);

    return helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by vendor handler
 */
const getProductsByVendor = async (req: IRequest, queryParams: any) => {
  try {
    let conditions: any = {};
    let userToJson: any = req.user.toJSON();
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, userToJson, req.role);

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy)
        return await getBestSellingProducts(pageInfo, conditions);
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo)
      docs = await _populateProduct(
        mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize),
        queryParams
      );
    else docs = await _populateProduct(mongoQuery, queryParams);

    return helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list handler
 */
const getProducts = async (queryParams: any) => {
  try {
    let conditions: any = { status: true };
    const pageInfo = helper.checkPagination(queryParams);
    conditions = _setConditions(queryParams, conditions, null, UserRole.USER);

    if ("category" in queryParams) {
      conditions.category = queryParams.category;
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) {
      docs = await _populateProduct(
        mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(),
        queryParams
      );
    } else docs = await _populateProduct(mongoQuery.lean(), queryParams);

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

const searchProducts = async (queryParams: any) => {
  try {
    const pageInfo = helper.checkPagination(queryParams);

    let conditions: any = { $and: [{ deleted: false }] };

    if (queryParams?.search?.length) conditions["$text"] = { $search: queryParams.search };

    if (queryParams.price) {
      conditions.$and.push({
        $and: [
          { sellingPrice: { $gte: queryParams.price.from } },
          { sellingPrice: { $lte: queryParams.price.to } },
        ],
      });
    }

    if (queryParams?.brands?.length)
      conditions.$and.push({ $or: queryParams.brands.map((id: any) => ({ brand: id })) });
    if (queryParams?.categories?.length)
      conditions.$and.push({ $or: queryParams.categories.map((id: any) => ({ category: id })) });
    if (queryParams?.rating?.length)
      conditions.$and.push({ $or: queryParams.rating.map((n: any) => ({ rating: n })) });

    // let minMaxPrice = await (productModel as any).aggregateWithDeleted([
    //   { $match: conditions },
    //   { $group: { _id: "", minPrice: { $min: "$sellingPrice" }, maxPrice: { $max: "$sellingPrice" } } },
    //   { $project: { min: { $min: "$minPrice" }, max: { $max: "$maxPrice" } } },
    // ]);

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo) {
      docs = await _populateProduct(
        mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(),
        queryParams
      );
    } else docs = await _populateProduct(mongoQuery.lean(), queryParams);

    // let min = minMaxPrice[0]?.min || 0;
    // let max = minMaxPrice[0]?.max || 0;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * get product list by collection slug/id handler
 */
const getProductsByCollection = async (collectionIdOrSlug: string, queryParams: any) => {
  try {
    let collection = await collectionService.fetchCollection(collectionIdOrSlug);
    let conditions: any = { status: true, isApproved: ApprovalStatus.APPROVED };
    let collectionObj: any = collection.toJSON();
    let collConditions: any[] = [];
    const pageInfo = helper.checkPagination(queryParams);

    if (queryParams?._id) conditions._id = queryParams?._id;

    for (let cond of collectionObj.conditions || []) {
      let query = helper.getProductQuery(cond.field, cond.condition, cond.value);
      if (query) collConditions.push(query);
    }

    if (collectionObj.mustMatchAll) conditions["$and"] = collConditions;
    else conditions["$or"] = collConditions;

    if (queryParams.textSearch?.length) conditions["$text"] = { $search: queryParams.textSearch };

    // set filter by
    if ("filterBy" in queryParams) {
      let filterBy = CONSTANT.FILTER_DROPDOWN.find((v: any) => v.key == queryParams.filterBy);
      if (filterBy) {
        queryParams.sortBy = filterBy?.sortBy;
        queryParams.orderBy = filterBy?.orderBy;
      }

      if (filterBy?.key && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
        conditions.variants = { $ne: [] };
        conditions["variants.variant.mrp"] = { $ne: null };
      }

      if ("FEATURED" == queryParams.filterBy) conditions.isFeatured = true;
      if ("BEST_SELLING" == queryParams.filterBy)
        return await getBestSellingProducts(pageInfo, conditions);
    }

    const count = await productModel.countDocuments(conditions);
    const mongoQuery = productModel.find(conditions).collation({ locale: "en" });
    let docs: any[] = [];

    if (pageInfo)
      docs = await _populateProduct(
        mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize),
        queryParams
      );
    else docs = await _populateProduct(mongoQuery, queryParams);

    return helper.makePaginatedData(
      _sortVariantsByProducts(docs, UserRole.USER, collectionObj),
      count,
      pageInfo
    );
  } catch (error) {
    throw error;
  }
};

/**
 * update product status handler
 */
const updateProductStatus = async (req: IRequest, productIdOrSlug: string, status: boolean) => {
  try {
    let product: any = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);

    const productObj: any = product.toJSON();
    const userObj: any = req.user.toJSON();
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userObj?.role)) {
      if (productObj.vendor.toString() != userObj._id.toString())
        throw helper.buildError("You can't change status of this product", 400);
      await product.set({ status }).save();
    } else {
      await product.set({ status }).save();
    }
  } catch (error) {
    throw error;
  }
};

/**
 * approve vendor's product by admin handler
 */
const updateVendorProductApprovalStatus = async (
  req: IRequest,
  productIdOrSlug: string,
  status: boolean
) => {
  try {
    let product: any = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);
    await product.set({ isApproved: status }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * update product featured status by admin handler
 */
const updateProductFeatureStatus = async (
  req: IRequest,
  productIdOrSlug: string,
  status: boolean
) => {
  try {
    let product: any = await productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
    if (!product) throw helper.buildError("No product found with this id", 404);
    await product.set({ isFeatured: status }).save();
  } catch (error) {
    throw error;
  }
};

/**
 * get collections by products
 */
const getCollectionsByProductId = async (productIdOrSlug: any) => {
  try {
    let collections = await collectionModel.find({ status: true });
    let selectedCollections: any[] = [];

    for await (let col of collections) {
      let item = await _getProductByCollection(col, { _id: productIdOrSlug.toString() });
      if (item) selectedCollections.push(col);
    }

    return selectedCollections;
  } catch (error) {
    throw error;
  }
};

/**
 * add bluk products through xls file
 */
const uploadBulkProducts = async (req: IRequest, products: any[]) => {
  let uploaded: any = [];
  try {
    // not using insert many because mongoose slug updater not supported

    const extractData = async (p: any) => {
      let parentId = null;
      let category = null;
      let subCategory = null;
      let brand = null;
      let variants: any[] = [];

      if (p.parent) {
        parentId = await productModel.findOne({ name: p.parent });
      }

      if (p.category) {
        category = await categoryModel.findOne({ name: p.category });
      }

      if (p.subCategory) {
        subCategory = await categoryModel.findOne({ name: p.subCategory });
      }

      if (p.brand) {
        brand = await brandModel.findOne({ name: p.brand });
      }

      return {
        ...p,
        parentId: parentId?._id || null,
        category: category?._id || null,
        subCategory: subCategory?._id || null,
        brand: brand?._id || null,
        variants,
      };
    };

    // first create parent product in db
    for (let p of products) {
      if (p.parentId != null) continue;
      const prod = await extractData(p);
      uploaded.push(await productModel.create(prod));
      products.splice(0, 1);
    }

    // save all pending child products
    for (let p of products) {
      const prod = await extractData(p);
      const child = await productModel.create(prod);
      uploaded.push(child);
      // update new variant info in parent product
      await productModel.updateOne(p.parent, { $addToSet: { variants: child._id } });
    }

    return uploaded;
  } catch (error) {
    for (let p of uploaded) await p.remove();
    throw error;
  }
};

/**
 * find High Rated Products
 */
const fetchHighRatedProducts = async (queryParams: any) => {
  try {
    let condition = { status: true, rating: { $gt: 0 } };
    let query = productModel.find(condition).sort({ rating: -1 });
    let count = await productModel.countDocuments(condition);
    let pageInfo = helper.checkPagination(queryParams);
    let docs: any[] = [];

    if (pageInfo) docs = await query.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await query;

    return helper.makePaginatedData(_sortVariantsByProducts(docs, UserRole.USER), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * find High views Products
 */
const fetchHighViewsProducts = async (queryParams: any) => {
  try {
    let condition = { status: true, viewCount: { $gt: 0 } };
    let query = productModel.find(condition).sort({ viewCount: -1 });
    let count = await productModel.countDocuments(condition);
    let pageInfo = helper.checkPagination(queryParams);
    let docs: any[] = [];

    if (pageInfo) docs = await query.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await query;

    return helper.makePaginatedData(_sortVariantsByProducts(docs, UserRole.USER), count, pageInfo);
  } catch (error) {
    throw error;
  }
};

/**
 * find Home Page Products
 */
const fetchHomePageProducts = async (pType: string, queryParams: any) => {
  try {
    if (pType == HomeProduct.HIGH_RATED) return await fetchHighRatedProducts(queryParams);
    if (pType == HomeProduct.HIGH_VIEWS) return await fetchHighViewsProducts(queryParams);
  } catch (error) {
    throw error;
  }
};

/**
 * fetch products for compare
 */
const fetchCompareProduct = async (fromProduct: any, toProduct: any) => {
  try {
    let datafromProduct = await getProduct(fromProduct, {});
    let datatoProduct = await getProduct(toProduct, {});
    return [datafromProduct, datatoProduct];
  } catch (error) {
    throw error;
  }
};

/**
 * fetch top selling product
 */
const fetchTopSellingProduct = async () => {
  try {
    let orders = await orderModel.aggregate([
      // { $match: { currentOrderStatus: OrderStatus.DELIVERED } },
      { $limit: 5 },
    ]);

    let pIds: any[] = [];

    for (let order of orders) {
      for (let p of order.items) {
        if (!pIds.includes(p.product.toString())) pIds.push(p.product.toString());
      }
    }

    let conditions: any = {};
    if (pIds.length) conditions._id = { $in: pIds };

    return await productModel.find(conditions).sort({ updatedAt: -1 }).limit(5);
  } catch (error) {
    throw error;
  }
};

const updateProductRating = async (productId: string, adminRating: number) => {
  try {
    let product = await productModel.findOne({ _id: productId });
    if (!product) throw helper.buildError("no product found with this id", 404);
    await product.set({ adminRating }).save();
  } catch (error) {
    throw error;
  }
};

const downloadProductFileSample = async (type: string, cb: any) => {
  let path;
  if (type == "CSV") path = helper.buildPath("public", "examples", "products.csv");
  else path = helper.buildPath("public", "examples", "products.xls");
  cb(path);
};

const downloadAllProducts = async () => {
  let products: any[] = await productModel.find({}).lean();

  const csvFields = [
    "Product Name",
    "Product Description",
    "Images",
    "Meta Description",
    "Tags",
    "Variant Selling Price",
    "Variant MRP",
    "Badal Dalo Price",
    "Variant Quantity",
    "Variant SKU",
    "Color",
    "Size",
  ];

  // { csvFields }
  const csvParser = new Parser({ fields: csvFields });
  let jsonProducts: any[] = [];

  for (let p of products) {
    let obj: any = {
      "Product Name": p.name,
      "Product Description": p.description,
      Images: (p?.images || []).join(","),
      "Meta Description": p.metaDescription,
      Tags: (p?.tags || []).join(","),
      "Variant Selling Price": 0,
      "Variant MRP": 0,
      "Badal Dalo Price": 0,
      "Variant Quantity": 0,
      "Variant SKU": "",
    };
    for (let vr of p.variants) {
      let v = vr.variant;
      obj["Variant Selling Price"] = v?.sellingPrice || 0;
      obj["Variant MRP"] = v?.mrp || 0;
      obj["Badal Dalo Price"] = v?.badalDaloPrice || 0;
      obj["Variant Quantity"] = v?.quantity || 0;
      obj["Variant SKU"] = v?.SKU;

      for (let vInfo in v) {
        if (
          !["quantity", "sellingPrice", "mrp", "badalDaloPrice", "SKU", "deleted"].includes(vInfo)
        ) {
          obj[vInfo] = v[vInfo];
        }
      }

      jsonProducts.push({ ...obj });
    }
  }

  let csvData = csvParser.parse(jsonProducts);

  return csvData;
};

export default {
  findProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  addProductByAdmin,
  updateProductByAdmin,
  getProductByAdmin,
  getProductByVendor,
  getProducts,
  getProductsByAdmin,
  getProductsByVendor,
  getProductsByCollection,
  updateProductStatus,
  deleteProductImage,
  updateVendorProductApprovalStatus,
  uploadBulkProducts,
  getCollectionsByProductId,
  updateProductFeatureStatus,
  fetchHighRatedProducts,
  fetchHighViewsProducts,
  fetchHomePageProducts,
  fetchCompareProduct,
  updateProductRating,
  downloadProductFileSample,
  fetchTopSellingProduct,
  searchProducts,
  downloadAllProducts,
};
