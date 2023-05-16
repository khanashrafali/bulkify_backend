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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2csv_1 = require("json2csv");
const lodash_1 = __importDefault(require("lodash"));
const validator_1 = __importDefault(require("validator"));
const _1 = require(".");
const models_1 = require("../models");
const utils_1 = require("../utils");
const interfaces_1 = require("../utils/interfaces");
utils_1.helper.loadEnvFile();
/**
 * find Product
 */
const findProduct = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProduct(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        return product;
    }
    catch (error) {
        throw error;
    }
});
const checkProductIdOrSlug = (conditions, productIdOrSlug) => {
    if (validator_1.default.isMongoId(productIdOrSlug === null || productIdOrSlug === void 0 ? void 0 : productIdOrSlug.toString()))
        conditions._id = productIdOrSlug;
    else
        conditions.slug = productIdOrSlug;
    return conditions;
};
/**
 * find Best Selling Products
 */
const getBestSellingProducts = (pageInfo, conditions) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let docs = pageInfo
            ? [{ $sort: { sumOfQuantity: -1 } }, { $skip: pageInfo.skip }, { $limit: pageInfo.pageSize }]
            : [];
        let stages = [
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
        let orderedProducts = yield models_1.orderModel.aggregate(stages);
        let data = orderedProducts[0] ? orderedProducts[0] : [];
        return utils_1.helper.makePaginatedData((_a = data === null || data === void 0 ? void 0 : data.docs) !== null && _a !== void 0 ? _a : [], (data === null || data === void 0 ? void 0 : data.count) || 0, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by collection slug/id handler
 */
const _getProductByCollection = (collection, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let conditions = { status: true };
        let colToJson = collection.toJSON();
        let collConditions = [];
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams._id)
            conditions._id = queryParams === null || queryParams === void 0 ? void 0 : queryParams._id;
        for (let cond of colToJson.conditions || []) {
            let query = utils_1.helper.getProductQuery(cond.field, cond.condition, cond.value);
            if (query)
                collConditions.push(query);
        }
        if (collConditions === null || collConditions === void 0 ? void 0 : collConditions.length) {
            if (colToJson.mustMatchAll)
                conditions["$and"] = collConditions;
            else
                conditions["$or"] = collConditions;
        }
        if ((_b = queryParams.textSearch) === null || _b === void 0 ? void 0 : _b.length)
            conditions.metaDescription = {
                $regex: utils_1.helper.regxEscape(queryParams.textSearch),
                $options: "i",
            };
        return yield _populateProduct(models_1.productModel.findOne(conditions), queryParams);
    }
    catch (error) {
        throw error;
    }
});
/**
 * build conditions
 */
const _setConditions = (queryParams, conditions, userObj, role) => {
    var _a;
    if (queryParams.textSearch && ((_a = validator_1.default.trim(queryParams.textSearch)) === null || _a === void 0 ? void 0 : _a.length)) {
        // conditions["name"] = { $search: queryParams.textSearch };
        conditions["name"] = { $regex: queryParams.textSearch, $options: "i" };
    }
    if ("status" in queryParams)
        conditions.status = queryParams.status;
    if ("createdAt" in queryParams)
        conditions.date = queryParams.createdAt;
    return conditions;
};
const _populateProductByAdmin = (query, queryParams, isSingle = false) => {
    var _a, _b;
    const sortBy = ((_a = queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy) === null || _a === void 0 ? void 0 : _a.length) ? queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy : "createdAt";
    const orderBy = (_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.orderBy) !== null && _b !== void 0 ? _b : "DESC";
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
    if (!isSingle)
        query.sort({ [sortBy]: orderBy });
    return query;
};
/**
 * populate product data
 */
const _populateProduct = (query, queryParams, isSingle = false) => {
    var _a, _b;
    const sortBy = ((_a = queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy) === null || _a === void 0 ? void 0 : _a.length) ? queryParams === null || queryParams === void 0 ? void 0 : queryParams.sortBy : "createdAt";
    const orderBy = (_b = queryParams === null || queryParams === void 0 ? void 0 : queryParams.orderBy) !== null && _b !== void 0 ? _b : "DESC";
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
    if (!isSingle)
        query.sort({ [sortBy]: orderBy });
    return query;
};
/**
 * sort products variants by price in asc
 */
const _sortVariantsByProducts = (products, role = interfaces_1.UserRole.USER, collection) => {
    return products.map((item) => {
        if (collection)
            item = Object.assign(Object.assign({}, item._doc), { collectionName: collection.title });
        item.variants = lodash_1.default.sortBy(item.variants, ["variant.price"]);
        if (role == interfaces_1.UserRole.USER)
            item.variants = item.variants.filter((v) => !(v === null || v === void 0 ? void 0 : v.deleted));
        item.isFav = false;
        item.isInCart = false;
        return item;
    });
};
/**
 * create product handler
 */
const addProduct = (req, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { variants } = body;
        variants = variants.map((v) => (Object.assign(Object.assign({}, v), { totalQty: v.quantity })));
        let vendorObj = req.user.toJSON();
        // if (!vendorObj?.isProfileComplete) throw helper.buildError("Can't add product because your profile is incomplete", 400);
        // if (vendorObj.isApproved != ApprovalStatus.APPROVED) {
        //   throw helper.buildError("Can't add product because your profile status is " + vendorObj.isApproved, 400);
        // }
        // if (!vendorObj.isActive)
        //   throw helper.buildError("Can't add product because your profile is unactivated by admin", 400);
        // let location = await shiprocketService.getPickupAddress(vendorObj.pickupLocation);
        // if (!location?.phone_verified) throw helper.buildError("Your address verification in pending, please try again later", 400);
        return yield models_1.productModel.create(Object.assign(Object.assign({}, body), { vendor: vendorObj._id, variants: lodash_1.default.sortBy(variants, ["variant.mrp"]), isApproved: interfaces_1.ApprovalStatus.APPROVED }));
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product handler
 */
const updateProduct = (req, productIdOrSlug, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { vendor, name, description, images, variants, status, metaDescription } = body;
        let vendorObj = req.user.toJSON();
        if (vendor)
            vendorObj = yield models_1.vendorModel.findOne({ _id: vendor }).lean();
        const product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productObj = product.toJSON();
        if (productObj.vendor.toString() != vendorObj._id.toString()) {
            throw utils_1.helper.buildError("You can't update this product", 400);
        }
        if (productObj.variants.length != variants.filter((v) => v._id).length) {
            throw utils_1.helper.buildError("old variant mismatch with new data", 400);
        }
        variants = variants.map((v) => {
            if (!v._id)
                delete v._id;
            return Object.assign(Object.assign({}, v), { totalQty: v.quantity });
        });
        images = (images === null || images === void 0 ? void 0 : images.length) ? images : productObj.images;
        variants = lodash_1.default.sortBy(variants, ["variant.mrp"]);
        const isApproved = interfaces_1.ApprovalStatus.APPROVED;
        return yield product
            .set(Object.assign(Object.assign({}, body), { isApproved, variants, images, vendor: vendorObj._id }))
            .save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * create product handler
 */
const addProductByAdmin = (req, body) => __awaiter(void 0, void 0, void 0, function* () {
    let { parentId } = body;
    let savedProduct = yield models_1.productModel.create(Object.assign(Object.assign({}, body), { isApproved: interfaces_1.ApprovalStatus.APPROVED }));
    if (parentId)
        yield models_1.productModel.updateOne({ _id: parentId }, { $addToSet: { variants: savedProduct._id } });
    return savedProduct;
});
/**
 * update product handler
 */
const updateProductByAdmin = (req, productIdOrSlug, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { images } = body;
        const product = yield models_1.productModel.findOne({ _id: productIdOrSlug });
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productObj = product.toJSON();
        const isApproved = interfaces_1.ApprovalStatus.APPROVED;
        images = (images === null || images === void 0 ? void 0 : images.length) ? images : productObj.images;
        return yield product.set(Object.assign(Object.assign({}, body), { isApproved, images })).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete product handler
 */
const deleteProduct = (req, productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        const productDoc = yield models_1.productModel.findOne(checkProductIdOrSlug(conditions, productIdOrSlug));
        if (!productDoc)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        const product = productDoc.toJSON();
        if (!product.parentId && product.variants.length) {
            yield models_1.productModel.updateMany({ _id: { $in: product.variants } }, { $set: { parentId: null } });
        }
        if (product.parentId)
            yield productDoc.set({ parentId: null }).save();
        yield productDoc.delete();
    }
    catch (error) {
        throw error;
    }
});
/**
 * delete product handler
 */
const deleteProductImage = (productIdOrSlug, locations) => { var _a, locations_1, locations_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    try {
        const product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productToJson = product.toJSON();
        yield product
            .set({ images: productToJson.images.filter((url) => locations === null || locations === void 0 ? void 0 : locations.find((e) => url != e)) })
            .save();
        try {
            for (_a = true, locations_1 = __asyncValues(locations); locations_1_1 = yield locations_1.next(), _b = locations_1_1.done, !_b;) {
                _d = locations_1_1.value;
                _a = false;
                try {
                    let location = _d;
                    yield utils_1.fileHandler.deleteFromS3(location);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = locations_1.return)) yield _c.call(locations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        throw error;
    }
}); };
/**
 * get single product handler
 */
const getProduct = (productIdOrSlug, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let variants = [];
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProduct(models_1.productModel.findOne(conditions), {}, true).lean();
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        if (product.parentId)
            product = yield _populateProduct(models_1.productModel.findById(product.parentId), {}, true).lean();
        variants = [...product.variants];
        delete product.variants;
        variants.unshift(product);
        return variants;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single product by admin handler
 */
const getProductByAdmin = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProductByAdmin(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        return product;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get single product by vendor handler
 */
const getProductByVendor = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = checkProductIdOrSlug({}, productIdOrSlug);
        let product = yield _populateProduct(models_1.productModel.findOne(conditions), {}, true);
        if (!product)
            throw utils_1.helper.buildError("No product found with this id/slug", 404);
        return product;
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by admin handler
 */
const getProductsByAdmin = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        let vendorObj = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, vendorObj, req.role);
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo)
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
        else
            docs = yield _populateProduct(mongoQuery, queryParams);
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by vendor handler
 */
const getProductsByVendor = (req, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = {};
        let userToJson = req.user.toJSON();
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, userToJson, req.role);
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo)
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
        else
            docs = yield _populateProduct(mongoQuery, queryParams);
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list handler
 */
const getProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conditions = { status: true };
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        conditions = _setConditions(queryParams, conditions, null, interfaces_1.UserRole.USER);
        if ("category" in queryParams) {
            conditions.category = queryParams.category;
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo) {
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(), queryParams);
        }
        else
            docs = yield _populateProduct(mongoQuery.lean(), queryParams);
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
const searchProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        let conditions = { $and: [{ deleted: false }] };
        if ((_c = queryParams === null || queryParams === void 0 ? void 0 : queryParams.search) === null || _c === void 0 ? void 0 : _c.length)
            conditions["$text"] = { $search: queryParams.search };
        if (queryParams.price) {
            conditions.$and.push({
                $and: [
                    { sellingPrice: { $gte: queryParams.price.from } },
                    { sellingPrice: { $lte: queryParams.price.to } },
                ],
            });
        }
        if ((_d = queryParams === null || queryParams === void 0 ? void 0 : queryParams.brands) === null || _d === void 0 ? void 0 : _d.length)
            conditions.$and.push({ $or: queryParams.brands.map((id) => ({ brand: id })) });
        if ((_e = queryParams === null || queryParams === void 0 ? void 0 : queryParams.categories) === null || _e === void 0 ? void 0 : _e.length)
            conditions.$and.push({ $or: queryParams.categories.map((id) => ({ category: id })) });
        if ((_f = queryParams === null || queryParams === void 0 ? void 0 : queryParams.rating) === null || _f === void 0 ? void 0 : _f.length)
            conditions.$and.push({ $or: queryParams.rating.map((n) => ({ rating: n })) });
        // let minMaxPrice = await (productModel as any).aggregateWithDeleted([
        //   { $match: conditions },
        //   { $group: { _id: "", minPrice: { $min: "$sellingPrice" }, maxPrice: { $max: "$sellingPrice" } } },
        //   { $project: { min: { $min: "$minPrice" }, max: { $max: "$maxPrice" } } },
        // ]);
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo) {
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize).lean(), queryParams);
        }
        else
            docs = yield _populateProduct(mongoQuery.lean(), queryParams);
        // let min = minMaxPrice[0]?.min || 0;
        // let max = minMaxPrice[0]?.max || 0;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * get product list by collection slug/id handler
 */
const getProductsByCollection = (collectionIdOrSlug, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        let collection = yield _1.collectionService.fetchCollection(collectionIdOrSlug);
        let conditions = { status: true, isApproved: interfaces_1.ApprovalStatus.APPROVED };
        let collectionObj = collection.toJSON();
        let collConditions = [];
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        if (queryParams === null || queryParams === void 0 ? void 0 : queryParams._id)
            conditions._id = queryParams === null || queryParams === void 0 ? void 0 : queryParams._id;
        for (let cond of collectionObj.conditions || []) {
            let query = utils_1.helper.getProductQuery(cond.field, cond.condition, cond.value);
            if (query)
                collConditions.push(query);
        }
        if (collectionObj.mustMatchAll)
            conditions["$and"] = collConditions;
        else
            conditions["$or"] = collConditions;
        if ((_g = queryParams.textSearch) === null || _g === void 0 ? void 0 : _g.length)
            conditions["$text"] = { $search: queryParams.textSearch };
        // set filter by
        if ("filterBy" in queryParams) {
            let filterBy = utils_1.CONSTANT.FILTER_DROPDOWN.find((v) => v.key == queryParams.filterBy);
            if (filterBy) {
                queryParams.sortBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.sortBy;
                queryParams.orderBy = filterBy === null || filterBy === void 0 ? void 0 : filterBy.orderBy;
            }
            if ((filterBy === null || filterBy === void 0 ? void 0 : filterBy.key) && ["PRICE_LOW_TO_HIGH", "PRICE_HIGH_TO_LOW"].includes(filterBy.key)) {
                conditions.variants = { $ne: [] };
                conditions["variants.variant.mrp"] = { $ne: null };
            }
            if ("FEATURED" == queryParams.filterBy)
                conditions.isFeatured = true;
            if ("BEST_SELLING" == queryParams.filterBy)
                return yield getBestSellingProducts(pageInfo, conditions);
        }
        const count = yield models_1.productModel.countDocuments(conditions);
        const mongoQuery = models_1.productModel.find(conditions).collation({ locale: "en" });
        let docs = [];
        if (pageInfo)
            docs = yield _populateProduct(mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize), queryParams);
        else
            docs = yield _populateProduct(mongoQuery, queryParams);
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs, interfaces_1.UserRole.USER, collectionObj), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product status handler
 */
const updateProductStatus = (req, productIdOrSlug, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        const productObj = product.toJSON();
        const userObj = req.user.toJSON();
        if (![interfaces_1.UserRole.ADMIN, interfaces_1.UserRole.SUPER_ADMIN].includes(userObj === null || userObj === void 0 ? void 0 : userObj.role)) {
            if (productObj.vendor.toString() != userObj._id.toString())
                throw utils_1.helper.buildError("You can't change status of this product", 400);
            yield product.set({ status }).save();
        }
        else {
            yield product.set({ status }).save();
        }
    }
    catch (error) {
        throw error;
    }
});
/**
 * approve vendor's product by admin handler
 */
const updateVendorProductApprovalStatus = (req, productIdOrSlug, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        yield product.set({ isApproved: status }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * update product featured status by admin handler
 */
const updateProductFeatureStatus = (req, productIdOrSlug, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne(checkProductIdOrSlug({}, productIdOrSlug));
        if (!product)
            throw utils_1.helper.buildError("No product found with this id", 404);
        yield product.set({ isFeatured: status }).save();
    }
    catch (error) {
        throw error;
    }
});
/**
 * get collections by products
 */
const getCollectionsByProductId = (productIdOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, e_2, _j, _k;
    try {
        let collections = yield models_1.collectionModel.find({ status: true });
        let selectedCollections = [];
        try {
            for (var _l = true, collections_1 = __asyncValues(collections), collections_1_1; collections_1_1 = yield collections_1.next(), _h = collections_1_1.done, !_h;) {
                _k = collections_1_1.value;
                _l = false;
                try {
                    let col = _k;
                    let item = yield _getProductByCollection(col, { _id: productIdOrSlug.toString() });
                    if (item)
                        selectedCollections.push(col);
                }
                finally {
                    _l = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_l && !_h && (_j = collections_1.return)) yield _j.call(collections_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return selectedCollections;
    }
    catch (error) {
        throw error;
    }
});
/**
 * add bluk products through xls file
 */
const uploadBulkProducts = (req, products) => __awaiter(void 0, void 0, void 0, function* () {
    let uploaded = [];
    try {
        // not using insert many because mongoose slug updater not supported
        const extractData = (p) => __awaiter(void 0, void 0, void 0, function* () {
            let parentId = null;
            let category = null;
            let subCategory = null;
            let brand = null;
            let variants = [];
            if (p.parent) {
                parentId = yield models_1.productModel.findOne({ name: p.parent });
            }
            if (p.category) {
                category = yield models_1.categoryModel.findOne({ name: p.category });
            }
            if (p.subCategory) {
                subCategory = yield models_1.categoryModel.findOne({ name: p.subCategory });
            }
            if (p.brand) {
                brand = yield models_1.brandModel.findOne({ name: p.brand });
            }
            return Object.assign(Object.assign({}, p), { parentId: (parentId === null || parentId === void 0 ? void 0 : parentId._id) || null, category: (category === null || category === void 0 ? void 0 : category._id) || null, subCategory: (subCategory === null || subCategory === void 0 ? void 0 : subCategory._id) || null, brand: (brand === null || brand === void 0 ? void 0 : brand._id) || null, variants });
        });
        // first create parent product in db
        for (let p of products) {
            if (p.parentId != null)
                continue;
            const prod = yield extractData(p);
            uploaded.push(yield models_1.productModel.create(prod));
            products.splice(0, 1);
        }
        // save all pending child products
        for (let p of products) {
            const prod = yield extractData(p);
            const child = yield models_1.productModel.create(prod);
            uploaded.push(child);
            // update new variant info in parent product
            yield models_1.productModel.updateOne(p.parent, { $addToSet: { variants: child._id } });
        }
        return uploaded;
    }
    catch (error) {
        for (let p of uploaded)
            yield p.remove();
        throw error;
    }
});
/**
 * find High Rated Products
 */
const fetchHighRatedProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let condition = { status: true, rating: { $gt: 0 } };
        let query = models_1.productModel.find(condition).sort({ rating: -1 });
        let count = yield models_1.productModel.countDocuments(condition);
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let docs = [];
        if (pageInfo)
            docs = yield query.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield query;
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs, interfaces_1.UserRole.USER), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * find High views Products
 */
const fetchHighViewsProducts = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let condition = { status: true, viewCount: { $gt: 0 } };
        let query = models_1.productModel.find(condition).sort({ viewCount: -1 });
        let count = yield models_1.productModel.countDocuments(condition);
        let pageInfo = utils_1.helper.checkPagination(queryParams);
        let docs = [];
        if (pageInfo)
            docs = yield query.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield query;
        return utils_1.helper.makePaginatedData(_sortVariantsByProducts(docs, interfaces_1.UserRole.USER), count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * find Home Page Products
 */
const fetchHomePageProducts = (pType, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (pType == interfaces_1.HomeProduct.HIGH_RATED)
            return yield fetchHighRatedProducts(queryParams);
        if (pType == interfaces_1.HomeProduct.HIGH_VIEWS)
            return yield fetchHighViewsProducts(queryParams);
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch products for compare
 */
const fetchCompareProduct = (fromProduct, toProduct) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let datafromProduct = yield getProduct(fromProduct, {});
        let datatoProduct = yield getProduct(toProduct, {});
        return [datafromProduct, datatoProduct];
    }
    catch (error) {
        throw error;
    }
});
/**
 * fetch top selling product
 */
const fetchTopSellingProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orders = yield models_1.orderModel.aggregate([
            // { $match: { currentOrderStatus: OrderStatus.DELIVERED } },
            { $limit: 5 },
        ]);
        let pIds = [];
        for (let order of orders) {
            for (let p of order.items) {
                if (!pIds.includes(p.product.toString()))
                    pIds.push(p.product.toString());
            }
        }
        let conditions = {};
        if (pIds.length)
            conditions._id = { $in: pIds };
        return yield models_1.productModel.find(conditions).sort({ updatedAt: -1 }).limit(5);
    }
    catch (error) {
        throw error;
    }
});
const updateProductRating = (productId, adminRating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield models_1.productModel.findOne({ _id: productId });
        if (!product)
            throw utils_1.helper.buildError("no product found with this id", 404);
        yield product.set({ adminRating }).save();
    }
    catch (error) {
        throw error;
    }
});
const downloadProductFileSample = (type, cb) => __awaiter(void 0, void 0, void 0, function* () {
    let path;
    if (type == "CSV")
        path = utils_1.helper.buildPath("public", "examples", "products.csv");
    else
        path = utils_1.helper.buildPath("public", "examples", "products.xls");
    cb(path);
});
const downloadAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    let products = yield models_1.productModel.find({}).lean();
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
    const csvParser = new json2csv_1.Parser({ fields: csvFields });
    let jsonProducts = [];
    for (let p of products) {
        let obj = {
            "Product Name": p.name,
            "Product Description": p.description,
            Images: ((p === null || p === void 0 ? void 0 : p.images) || []).join(","),
            "Meta Description": p.metaDescription,
            Tags: ((p === null || p === void 0 ? void 0 : p.tags) || []).join(","),
            "Variant Selling Price": 0,
            "Variant MRP": 0,
            "Badal Dalo Price": 0,
            "Variant Quantity": 0,
            "Variant SKU": "",
        };
        for (let vr of p.variants) {
            let v = vr.variant;
            obj["Variant Selling Price"] = (v === null || v === void 0 ? void 0 : v.sellingPrice) || 0;
            obj["Variant MRP"] = (v === null || v === void 0 ? void 0 : v.mrp) || 0;
            obj["Badal Dalo Price"] = (v === null || v === void 0 ? void 0 : v.badalDaloPrice) || 0;
            obj["Variant Quantity"] = (v === null || v === void 0 ? void 0 : v.quantity) || 0;
            obj["Variant SKU"] = v === null || v === void 0 ? void 0 : v.SKU;
            for (let vInfo in v) {
                if (!["quantity", "sellingPrice", "mrp", "badalDaloPrice", "SKU", "deleted"].includes(vInfo)) {
                    obj[vInfo] = v[vInfo];
                }
            }
            jsonProducts.push(Object.assign({}, obj));
        }
    }
    let csvData = csvParser.parse(jsonProducts);
    return csvData;
});
exports.default = {
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
