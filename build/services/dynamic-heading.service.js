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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
utils_1.helper.loadEnvFile();
const saveQueiry = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.dynamicModel.create(data);
    }
    catch (error) {
        throw error;
    }
});
const getQueries = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageInfo = utils_1.helper.checkPagination(queryParams);
        const mongoQuery = models_1.dynamicModel.find();
        let docs = [];
        const count = yield models_1.dynamicModel.countDocuments();
        if (pageInfo)
            docs = yield mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
        else
            docs = yield mongoQuery;
        return utils_1.helper.makePaginatedData(docs, count, pageInfo);
    }
    catch (error) {
        throw error;
    }
});
/**
 * update main category handler
 */
const updateHeading = (id, heading) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let headingData = { heading };
        const data = yield models_1.dynamicModel.findById(id);
        if (!data)
            throw utils_1.helper.buildError("No data found with this id", 404);
        return yield data.set(headingData).save();
    }
    catch (error) {
        throw error;
    }
});
const getQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.dynamicModel.findOne({ _id: id });
        if (!data)
            throw utils_1.helper.buildError("no data found with this id", 404);
        return data;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    saveQueiry,
    getQueries,
    getQuery,
    updateHeading
};
