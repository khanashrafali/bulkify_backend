import csv from "csv-parser";
import { NextFunction, Request, Response } from "express";
import { body, CustomValidator, param, query } from "express-validator";
import fs from "fs";
import xls from "node-xlsx";
import validator from "validator";
import { brandModel, categoryModel, productModel, variantModel, vendorModel } from "../../models";
import { CONSTANT, fileHandler, helper } from "../../utils";
import { ApprovalStatus, IRequest, UserRole } from "../../utils/interfaces";
import constants from "../../utils/constants";

const postAddProduct: any[] = [
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 250 })
    .withMessage("name length must be greator then 0 and less then 250 charactors."),
  body("parentId", "Please enter valid parentId").optional({ nullable: true }).isMongoId(),
  body("shortDesc", "Please enter valid shortDesc").exists().trim().notEmpty(),
  body("fullDesc", "Please enter valid fullDesc").exists().trim().notEmpty(),
  body("images", "Please enter valid images").exists().isArray(),
  body("images.*", "Please enter valid images").optional().isURL(),
  body("status", "Please enter valid status"),
  body("brand", "Please enter valid brand"),
  body("category", "Please enter valid category"),
  body("subCategory", "Please enter valid subCategory"),
  body("sizes", "Please enter valid sizes"),
  body("color", "Please enter valid color"),
];

const postAddProductByAdmin: any[] = [...postAddProduct];

const getProduct = [
  param("productIdOrSlug", "Please enter valid product Id/slug")
    .exists()
    .trim()
    .notEmpty()
    .custom(async (val, { req }) => {
      let conditions: any = {};
      validator.isMongoId(val) ? (conditions._id = val) : (conditions.slug = val);
      const product = await productModel.findOne(conditions);
      if (!product) throw helper.buildError("no product found with this id/slug", 404);
    }),
];

const putUpdateProduct: any[] = [...getProduct, ...postAddProduct];

const putUpdateProductByAdmin = [...getProduct, ...postAddProductByAdmin];

const getProducts = [
  query(
    "filterBy",
    `Please enter valid filterBy like ${CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`
  )
    .optional()
    .isIn(CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
  query("isApproved", `Please enter valid isApproved like ${CONSTANT.APPROVAL_STATUS.join(",")}`)
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  query("type", `Please enter valid type like ${CONSTANT.PRODUCT_TYPE.join(",")}`)
    .optional()
    .isIn(CONSTANT.PRODUCT_TYPE),
  query("vendor", "Please enter valid vendor").optional().isMongoId(),
  query("createdAt", "Please enter valid createdAt").optional().isDate({ format: CONSTANT.DATE }),
  query("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
  query("category", "Please enter valid category").optional().isMongoId(),
];

const searchProducts = [
  body(
    "filterBy",
    `Please enter valid filterBy like ${CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`
  )
    .optional()
    .isIn(CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
  body("isApproved", `Please enter valid isApproved like ${CONSTANT.APPROVAL_STATUS.join(",")}`)
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  body("type", `Please enter valid type like ${CONSTANT.PRODUCT_TYPE.join(",")}`)
    .optional()
    .isIn(CONSTANT.PRODUCT_TYPE),
  body("vendor", "Please enter valid vendor").optional().isMongoId(),
  body("createdAt", "Please enter valid createdAt").optional().isDate({ format: CONSTANT.DATE }),
  body("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  body("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  body("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const getProductsByCollection = [
  param("collectionIdOrSlug", "Please enter valid collectionIdOrSlug").exists(),
  query(
    "filterBy",
    `Please enter valid filterBy like ${CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`
  )
    .optional()
    .isIn(CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
  query("isApproved", `Please enter valid isApproved like ${CONSTANT.APPROVAL_STATUS.join(",")}`)
    .optional()
    .isIn(CONSTANT.APPROVAL_STATUS),
  query("type", `Please enter valid type like ${CONSTANT.PRODUCT_TYPE.join(",")}`)
    .optional()
    .isIn(CONSTANT.PRODUCT_TYPE),
  query("vendor", "Please enter valid vendor").optional().isMongoId(),
  query("createdAt", "Please enter valid createdAt").optional().isDate({ format: CONSTANT.DATE }),
  query("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

const patchUpdateProductStatus = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
  body("status", "Please enter valid status like true, false").exists().isBoolean(),
];

const patchUpdateProductFeatureStatus = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
  body("isFeatured", "Please enter valid isFeatured like true, false").exists().isBoolean(),
];

const deleteProductImage = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
  body("urls", "Please enter valid urls").exists().isArray({ min: 1 }),
  body("urls.*", "Please enter valid urls").exists().isURL(),
];

const patchUpdateVendorProductApprovalStatus = [
  param("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
  body("status", `Please enter valid status like ${CONSTANT.APPROVAL_STATUS.join(",")}`)
    .exists()
    .isIn(CONSTANT.APPROVAL_STATUS),
];

const parseDataFromXls = async (ireq: IRequest, filePath: string, userToJson: any) => {
  // parse data from xls file
  let data = xls.parse(filePath);

  // check uplaoded file contains rows
  if (!data.length) {
    throw helper.buildError("invalid file content.");
  }

  // check xls file name and data from parsed file data
  if (data.at(0)?.name?.toString() !== "PRODUCTS" || !data.at(0)?.data.length) {
    throw helper.buildError("invalid file Data", 400);
  }

  const tableHeaderRow = data.at(0)?.data.shift();

  // store table data rows and remove empty rows
  const tableDataRows = data.at(0)?.data.filter((v) => v.length);

  return (tableDataRows || []).map((row) => {
    return {
      name: row[0],
      shortDesc: row[1],
      fullDesc: row[2],
      images: ((row[3] || "") as string).split(","),
      sizes: ((row[4] || "") as string).split(","),
      color: row[5],
      rating: +(row[6] as string),
      mrp: +(row[7] as string),
      quantity: +(row[8] as string),
      sellingPrice: +(row[9] as string),
      parent: row[10] || null,
      category: row[11] || null,
      subCategory: row[12] || null,
      brand: row[13] || null,
    };
  });
};

const parseDataFromCsv = async (ireq: IRequest, filePath: string, userToJson: any) => {
  let csvToJson: any[] = await new Promise((res, rej) => {
    let items: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => items.push(data))
      .on("end", () => {
        res(items);
      });
  });

  return csvToJson.map((row) => {
    let values: any[] = [];

    for (let k in row) values.push(row[k]);

    return {
      name: values[0],
      shortDesc: values[1],
      fullDesc: values[2],
      images: ((values[3] || "") as string).split(","),
      sizes: ((values[4] || "") as string).split(","),
      color: values[5],
      rating: +(values[6] as string),
      mrp: +(values[7] as string),
      quantity: +(values[8] as string),
      sellingPrice: +(values[9] as string),
      parent: values[10] || null,
      category: values[11] || null,
      subCategory: values[12] || null,
      brand: values[13] || null,
    };
  });
};

const validateParseProducts = async (req: Request, res: Response, next: NextFunction) => {
  const ireq = req as IRequest;
  const filePath = req?.file?.path;
  const fileName = req.file?.originalname;
  let userToJson: any = ireq.user.toJSON();

  try {
    helper.checkPayloadFiles(req);

    if (!filePath) return;

    if (req?.file?.mimetype == "text/csv" || fileName?.includes(".csv")) {
      req.body.productOBJS = await parseDataFromCsv(ireq, filePath, userToJson);
    } else if (req?.file?.mimetype == "application/vnd.ms-excel" || fileName?.includes(".xls")) {
      req.body.productOBJS = await parseDataFromXls(ireq, filePath, userToJson);
    } else throw helper.buildError("please enter valid file like xls,csv", 400);

    next();
  } catch (error) {
    next(error);
  } finally {
    if (req?.file?.path?.length) {
      await fileHandler.deleteFile(req?.file?.path);
    }
  }
};

const postBulkUpload: any[] = [
  body("productOBJS.*.name").isString().trim().notEmpty(),
  body("productOBJS.*.shortDesc").isString().trim().notEmpty(),
  body("productOBJS.*.fullDesc").isString().trim().notEmpty(),
  body("productOBJS.*.images").isArray({ min: 1 }),
  body("productOBJS.*.sizes").isArray({ min: 1 }),
  body("productOBJS.*.images.*").isString().trim().notEmpty().isURL(),
  body("productOBJS.*.sizes.*")
    .isString()
    .trim()
    .notEmpty()
    .isIn(constants.PRODUCT_SIZES)
    .withMessage(`size must be like ${constants.PRODUCT_SIZES.join(",")}`),
  body("productOBJS.*.color").isString().trim().notEmpty(),
  body("productOBJS.*.rating").toFloat().isFloat({ gt: -1, lt: 5.1 }),
  body("productOBJS.*.mrp").toFloat().isFloat({ gt: -1, lt: 100000 }),
  body("productOBJS.*.quantity").toInt().isInt({ gt: -1, lt: 1000000 }),
  body("productOBJS.*.sellingPrice").toFloat().isFloat({ gt: -1, lt: 100000 }),
  body("productOBJS.*.parent")
    .optional({ checkFalsy: true })
    .isString()
    .custom(async (val, { req }) => {
      let data = await productModel.findOne({ name: val });
      if (!data) throw helper.buildError(`parent not found ${val}`, 400);
    }),
  body("productOBJS.*.category")
    .optional({ checkFalsy: true })
    .isString()
    .custom(async (val, { req }) => {
      console.log({ val });
      let data = await categoryModel.findOne({ name: val });
      if (!data) throw helper.buildError(`category not found ${val}`, 400);
    }),
  body("productOBJS.*.subCategory")
    .optional({ checkFalsy: true })
    .isString()
    .custom(async (val, { req }) => {
      let data = await categoryModel.findOne({ name: val });
      if (!data) throw helper.buildError(`sub category not found ${val}`, 400);
    }),
  body("productOBJS.*.brand")
    .optional({ checkFalsy: true })
    .isString()
    .custom(async (val, { req }) => {
      let data = await brandModel.findOne({ name: val });
      if (!data) throw helper.buildError(`brand not found ${val}`, 400);
    }),
];

const getHomePageProducts: any[] = [
  param("type", `Please enter valid type like ${CONSTANT.HOME_PAGE_PRODUCTS.join(",")}`)
    .exists()
    .isIn(CONSTANT.HOME_PAGE_PRODUCTS),
];

const fetchCompareProduct = [
  query("from", "Please enter valid from").exists().isMongoId(),
  query("to", "Please enter valid to").exists().isMongoId(),
];

const downloadProductFileSample = [
  param("type", "Please enter valid type like CSV, XLS").exists().isIn(["CSV", "XLS"]),
];

export default {
  postAddProduct,
  putUpdateProduct,
  getProduct,
  getProductsByCollection,
  patchUpdateProductStatus,
  deleteProductImage,
  patchUpdateVendorProductApprovalStatus,
  getProducts,
  validateParseProducts,
  postBulkUpload,
  patchUpdateProductFeatureStatus,
  getHomePageProducts,
  postAddProductByAdmin,
  putUpdateProductByAdmin,
  fetchCompareProduct,
  downloadProductFileSample,
  searchProducts,
};
