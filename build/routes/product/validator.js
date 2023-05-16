"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = __importDefault(require("csv-parser"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const validator_1 = __importDefault(require("validator"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const constants_1 = __importDefault(require("../../utils/constants"));
const postAddProduct = [
    (0, express_validator_1.body)("name", "Please enter valid name")
        .exists()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 250 })
        .withMessage("name length must be greator then 0 and less then 250 charactors."),
    (0, express_validator_1.body)("parentId", "Please enter valid parentId").optional({ nullable: true }).isMongoId(),
    (0, express_validator_1.body)("shortDesc", "Please enter valid shortDesc").exists().trim().notEmpty(),
    (0, express_validator_1.body)("fullDesc", "Please enter valid fullDesc").exists().trim().notEmpty(),
    (0, express_validator_1.body)("images", "Please enter valid images").exists().isArray(),
    (0, express_validator_1.body)("images.*", "Please enter valid images").optional().isURL(),
    (0, express_validator_1.body)("status", "Please enter valid status"),
    (0, express_validator_1.body)("brand", "Please enter valid brand"),
    (0, express_validator_1.body)("category", "Please enter valid category"),
    (0, express_validator_1.body)("subCategory", "Please enter valid subCategory"),
    (0, express_validator_1.body)("sizes", "Please enter valid sizes"),
    (0, express_validator_1.body)("color", "Please enter valid color"),
];
const postAddProductByAdmin = [...postAddProduct];
const getProduct = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid product Id/slug")
        .exists()
        .trim()
        .notEmpty()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let conditions = {};
        validator_1.default.isMongoId(val) ? (conditions._id = val) : (conditions.slug = val);
        const product = yield models_1.productModel.findOne(conditions);
        if (!product)
            throw utils_1.helper.buildError("no product found with this id/slug", 404);
    })),
];
const putUpdateProduct = [...getProduct, ...postAddProduct];
const putUpdateProductByAdmin = [...getProduct, ...postAddProductByAdmin];
const getProducts = [
    (0, express_validator_1.query)("filterBy", `Please enter valid filterBy like ${utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
    (0, express_validator_1.query)("isApproved", `Please enter valid isApproved like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.query)("type", `Please enter valid type like ${utils_1.CONSTANT.PRODUCT_TYPE.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PRODUCT_TYPE),
    (0, express_validator_1.query)("vendor", "Please enter valid vendor").optional().isMongoId(),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("category", "Please enter valid category").optional().isMongoId(),
];
const searchProducts = [
    (0, express_validator_1.body)("filterBy", `Please enter valid filterBy like ${utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
    (0, express_validator_1.body)("isApproved", `Please enter valid isApproved like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.body)("type", `Please enter valid type like ${utils_1.CONSTANT.PRODUCT_TYPE.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PRODUCT_TYPE),
    (0, express_validator_1.body)("vendor", "Please enter valid vendor").optional().isMongoId(),
    (0, express_validator_1.body)("createdAt", "Please enter valid createdAt").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.body)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.body)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.body)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const getProductsByCollection = [
    (0, express_validator_1.param)("collectionIdOrSlug", "Please enter valid collectionIdOrSlug").exists(),
    (0, express_validator_1.query)("filterBy", `Please enter valid filterBy like ${utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key).join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.FILTER_DROPDOWN.map((v) => v.key)),
    (0, express_validator_1.query)("isApproved", `Please enter valid isApproved like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
    (0, express_validator_1.query)("type", `Please enter valid type like ${utils_1.CONSTANT.PRODUCT_TYPE.join(",")}`)
        .optional()
        .isIn(utils_1.CONSTANT.PRODUCT_TYPE),
    (0, express_validator_1.query)("vendor", "Please enter valid vendor").optional().isMongoId(),
    (0, express_validator_1.query)("createdAt", "Please enter valid createdAt").optional().isDate({ format: utils_1.CONSTANT.DATE }),
    (0, express_validator_1.query)("status", "Please enter valid status").optional().isIn(["true", "false"]).toBoolean(),
    (0, express_validator_1.query)("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
    (0, express_validator_1.query)("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];
const patchUpdateProductStatus = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
    (0, express_validator_1.body)("status", "Please enter valid status like true, false").exists().isBoolean(),
];
const patchUpdateProductFeatureStatus = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
    (0, express_validator_1.body)("isFeatured", "Please enter valid isFeatured like true, false").exists().isBoolean(),
];
const deleteProductImage = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
    (0, express_validator_1.body)("urls", "Please enter valid urls").exists().isArray({ min: 1 }),
    (0, express_validator_1.body)("urls.*", "Please enter valid urls").exists().isURL(),
];
const patchUpdateVendorProductApprovalStatus = [
    (0, express_validator_1.param)("productIdOrSlug", "Please enter valid productIdOrSlug").exists().notEmpty(),
    (0, express_validator_1.body)("status", `Please enter valid status like ${utils_1.CONSTANT.APPROVAL_STATUS.join(",")}`)
        .exists()
        .isIn(utils_1.CONSTANT.APPROVAL_STATUS),
];
const parseDataFromXls = (ireq, filePath, userToJson) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // parse data from xls file
    let data = node_xlsx_1.default.parse(filePath);
    // check uplaoded file contains rows
    if (!data.length) {
        throw utils_1.helper.buildError("invalid file content.");
    }
    // check xls file name and data from parsed file data
    if (((_b = (_a = data.at(0)) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toString()) !== "PRODUCTS" || !((_c = data.at(0)) === null || _c === void 0 ? void 0 : _c.data.length)) {
        throw utils_1.helper.buildError("invalid file Data", 400);
    }
    const tableHeaderRow = (_d = data.at(0)) === null || _d === void 0 ? void 0 : _d.data.shift();
    // store table data rows and remove empty rows
    const tableDataRows = (_e = data.at(0)) === null || _e === void 0 ? void 0 : _e.data.filter((v) => v.length);
    return (tableDataRows || []).map((row) => {
        return {
            name: row[0],
            shortDesc: row[1],
            fullDesc: row[2],
            images: (row[3] || "").split(","),
            sizes: (row[4] || "").split(","),
            color: row[5],
            rating: +row[6],
            mrp: +row[7],
            quantity: +row[8],
            sellingPrice: +row[9],
            parent: row[10] || null,
            category: row[11] || null,
            subCategory: row[12] || null,
            brand: row[13] || null,
        };
    });
});
const parseDataFromCsv = (ireq, filePath, userToJson) => __awaiter(void 0, void 0, void 0, function* () {
    let csvToJson = yield new Promise((res, rej) => {
        let items = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", (data) => items.push(data))
            .on("end", () => {
            res(items);
        });
    });
    return csvToJson.map((row) => {
        let values = [];
        for (let k in row)
            values.push(row[k]);
        return {
            name: values[0],
            shortDesc: values[1],
            fullDesc: values[2],
            images: (values[3] || "").split(","),
            sizes: (values[4] || "").split(","),
            color: values[5],
            rating: +values[6],
            mrp: +values[7],
            quantity: +values[8],
            sellingPrice: +values[9],
            parent: values[10] || null,
            category: values[11] || null,
            subCategory: values[12] || null,
            brand: values[13] || null,
        };
    });
});
const validateParseProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j, _k, _l, _m;
    const ireq = req;
    const filePath = (_f = req === null || req === void 0 ? void 0 : req.file) === null || _f === void 0 ? void 0 : _f.path;
    const fileName = (_g = req.file) === null || _g === void 0 ? void 0 : _g.originalname;
    let userToJson = ireq.user.toJSON();
    try {
        utils_1.helper.checkPayloadFiles(req);
        if (!filePath)
            return;
        if (((_h = req === null || req === void 0 ? void 0 : req.file) === null || _h === void 0 ? void 0 : _h.mimetype) == "text/csv" || (fileName === null || fileName === void 0 ? void 0 : fileName.includes(".csv"))) {
            req.body.productOBJS = yield parseDataFromCsv(ireq, filePath, userToJson);
        }
        else if (((_j = req === null || req === void 0 ? void 0 : req.file) === null || _j === void 0 ? void 0 : _j.mimetype) == "application/vnd.ms-excel" || (fileName === null || fileName === void 0 ? void 0 : fileName.includes(".xls"))) {
            req.body.productOBJS = yield parseDataFromXls(ireq, filePath, userToJson);
        }
        else
            throw utils_1.helper.buildError("please enter valid file like xls,csv", 400);
        next();
    }
    catch (error) {
        next(error);
    }
    finally {
        if ((_l = (_k = req === null || req === void 0 ? void 0 : req.file) === null || _k === void 0 ? void 0 : _k.path) === null || _l === void 0 ? void 0 : _l.length) {
            yield utils_1.fileHandler.deleteFile((_m = req === null || req === void 0 ? void 0 : req.file) === null || _m === void 0 ? void 0 : _m.path);
        }
    }
});
const postBulkUpload = [
    (0, express_validator_1.body)("productOBJS.*.name").isString().trim().notEmpty(),
    (0, express_validator_1.body)("productOBJS.*.shortDesc").isString().trim().notEmpty(),
    (0, express_validator_1.body)("productOBJS.*.fullDesc").isString().trim().notEmpty(),
    (0, express_validator_1.body)("productOBJS.*.images").isArray({ min: 1 }),
    (0, express_validator_1.body)("productOBJS.*.sizes").isArray({ min: 1 }),
    (0, express_validator_1.body)("productOBJS.*.images.*").isString().trim().notEmpty().isURL(),
    (0, express_validator_1.body)("productOBJS.*.sizes.*")
        .isString()
        .trim()
        .notEmpty()
        .isIn(constants_1.default.PRODUCT_SIZES)
        .withMessage(`size must be like ${constants_1.default.PRODUCT_SIZES.join(",")}`),
    (0, express_validator_1.body)("productOBJS.*.color").isString().trim().notEmpty(),
    (0, express_validator_1.body)("productOBJS.*.rating").toFloat().isFloat({ gt: -1, lt: 5.1 }),
    (0, express_validator_1.body)("productOBJS.*.mrp").toFloat().isFloat({ gt: -1, lt: 100000 }),
    (0, express_validator_1.body)("productOBJS.*.quantity").toInt().isInt({ gt: -1, lt: 1000000 }),
    (0, express_validator_1.body)("productOBJS.*.sellingPrice").toFloat().isFloat({ gt: -1, lt: 100000 }),
    (0, express_validator_1.body)("productOBJS.*.parent")
        .optional({ checkFalsy: true })
        .isString()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield models_1.productModel.findOne({ name: val });
        if (!data)
            throw utils_1.helper.buildError(`parent not found ${val}`, 400);
    })),
    (0, express_validator_1.body)("productOBJS.*.category")
        .optional({ checkFalsy: true })
        .isString()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log({ val });
        let data = yield models_1.categoryModel.findOne({ name: val });
        if (!data)
            throw utils_1.helper.buildError(`category not found ${val}`, 400);
    })),
    (0, express_validator_1.body)("productOBJS.*.subCategory")
        .optional({ checkFalsy: true })
        .isString()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield models_1.categoryModel.findOne({ name: val });
        if (!data)
            throw utils_1.helper.buildError(`sub category not found ${val}`, 400);
    })),
    (0, express_validator_1.body)("productOBJS.*.brand")
        .optional({ checkFalsy: true })
        .isString()
        .custom((val, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield models_1.brandModel.findOne({ name: val });
        if (!data)
            throw utils_1.helper.buildError(`brand not found ${val}`, 400);
    })),
];
const getHomePageProducts = [
    (0, express_validator_1.param)("type", `Please enter valid type like ${utils_1.CONSTANT.HOME_PAGE_PRODUCTS.join(",")}`)
        .exists()
        .isIn(utils_1.CONSTANT.HOME_PAGE_PRODUCTS),
];
const fetchCompareProduct = [
    (0, express_validator_1.query)("from", "Please enter valid from").exists().isMongoId(),
    (0, express_validator_1.query)("to", "Please enter valid to").exists().isMongoId(),
];
const downloadProductFileSample = [
    (0, express_validator_1.param)("type", "Please enter valid type like CSV, XLS").exists().isIn(["CSV", "XLS"]),
];
exports.default = {
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
