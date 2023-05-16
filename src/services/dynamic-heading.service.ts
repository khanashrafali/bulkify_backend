import { dynamicModel } from "../models";
import { emailHandler, helper } from "../utils";

helper.loadEnvFile();

const saveQueiry = async (data: any) => {
  try {
    await dynamicModel.create(data);
  } catch (error) {
    throw error;
  }
};

const getQueries = async (queryParams: any) => {
  try {
    const pageInfo = helper.checkPagination(queryParams);
    const mongoQuery = dynamicModel.find();
    let docs: any[] = [];
    const count = await dynamicModel.countDocuments();

    if (pageInfo) docs = await mongoQuery.skip(pageInfo.skip).limit(pageInfo.pageSize);
    else docs = await mongoQuery;

    return helper.makePaginatedData(docs, count, pageInfo);
  } catch (error) {
    throw error;
  }
};
/**
 * update main category handler
 */
const updateHeading = async (
    id: string,
    heading: string,
  ) => {
    try {
      let headingData: any = { heading};
      const data = await dynamicModel.findById(id);
      if (!data) throw helper.buildError("No data found with this id", 404);
      return await data.set(headingData).save();
    } catch (error) {
      throw error;
    }
  };

const getQuery = async (id: string) => {
  try {
    const data = await dynamicModel.findOne({ _id: id });
    if (!data) throw helper.buildError("no data found with this id", 404);
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  saveQueiry,
  getQueries,
  getQuery,
  updateHeading
};
