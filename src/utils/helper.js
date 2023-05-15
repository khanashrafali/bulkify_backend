import path from "path";
const numId = require("nodejs-unique-numeric-id-generator");
import moment from "moment";
import _ from "lodash";
import { createHash } from "crypto";
import AWS from "aws-sdk";
import dotEnv from "dotenv";
import { validationResult, query } from "express-validator";
import { IRequest, PageInfo, userRole } from "./interfaces";
import { CONSTANT, helper } from ".";

// build path
const buildPath = (...pathSeg) => path.join(process.cwd(), ...pathSeg);

// build unique hash
const getHash = () => {
  var current_date = new Date().valueOf().toString();
  var random = Math.random().toString();
  return createHash("sha1")
    .update(current_date + random)
    .digest("hex");
};

// load environment file
const loadEnvFile = () => dotEnv.config({ path: buildPath(".env") });

loadEnvFile();

// build error object
const buildError = (message = "An Error Occured!", statusCode = 500, data = null, status = false) => {
  let err = new Error(message);
  err.statusCode = statusCode;
  err.status = status;
  err.data = data;
  return err;
};

// build response object
const buildResponse = (res, message, data = null, statusCode = 200, status = true) => {
  return res.status(statusCode).json({ message, data, statusCode, status });
};

// validate request payload is valid
const handlePayloadError = (req) => {
  const err = validationResult(req);
  if (!err.isEmpty()) throw buildError(err.array()[0].msg, 400, err.array());
};

// validate request contains files
const checkPayloadFiles = (req, msg = "files is required") => {
  if (!req.file && !Object.keys(req?.files || {})?.length && !req?.files?.length) throw buildError(msg, 400);
};

// validate request contains files
const checkUserRole = (req, allowedRoles = [userRole.SUPER_ADMIN, userRole.ADMIN], msg = "unauthorize") => {
  const userToJson= req.user.toJSON();
  if (!allowedRoles.includes(userToJson.role)) throw buildError(msg, 400);
  if (userToJson.role == userRole.ADMIN && !userToJson.isActive) throw helper.buildError("Your account is deactived by super admin", 400);
};

const sendOTP = async (mobileNumber, msg) => {
  try {
    // Load the AWS SDK for Node.js
    AWS.config.update({ region: process.env.AWS_REGION });
    var params = { Message: msg, PhoneNumber: `+91${mobileNumber}` };
    var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" }).publish(params).promise();
    return publishTextPromise
      .then((data) => console.log("MessageID is " + data.MessageId))
      .catch((err) => console.error(err, err.stack));
  } catch (error) {
    console.log("send otp error", error);
    throw error;
  }
};

const regxEscape = (val) => `^${val.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")}$`;

// check pagination params
const checkPagination = (pageParams) => {
  let page = +pageParams?.page;
  let pageSize = +pageParams?.pageSize;
  if (!page || !pageSize) return null;
  return { page, pageSize, skip: (page - 1) * pageSize };
};

// build pagination with list
const getPaginatedData = (itemsList, pageInfo) => {
  return {
    page: pageInfo?.page,
    pageSize: pageInfo?.pageSize,
    docs: _.drop(itemsList, pageInfo.skip).slice(0, pageInfo.pageSize),
    count: itemsList.length,
    pages: Math.ceil(itemsList.length / pageInfo.pageSize),
  };
};

// build paginated response data
const makePaginatedData = (pagedItems, count, pageInfo) => {
  let pageData = { page: pageInfo?.page, pageSize: pageInfo?.pageSize, docs: pagedItems, count: count };
  if (pageInfo?.pageSize) pageData.pages = Math.ceil(count / pageInfo?.pageSize);
  return pageData;
};

// build product query
const getProductQuery = (fkey, ckey, value) => {
  let field = CONSTANT.PRODUCT_FIELDS.find((f) => f.key == fkey);
  if (!field) return;

  let cond = CONSTANT.PRODUCT_CONDITION(field?.field, value).find((c) => c.key == ckey);
  if (!cond) return;
  return cond.query;
};

// build submitable labels
const buildSubmitableLabel = (variantOptionValues) => {
  let submitableLabels = [];

  let type1 = variantOptionValues[0]?.type;
  let option1 = variantOptionValues[0]?.values || [];
  let type2 = variantOptionValues[1]?.type;
  let option2 = variantOptionValues[1]?.values || [];
  let type3 = variantOptionValues[2]?.type;
  let option3 = variantOptionValues[2]?.values || [];

  for (let p1 of option1) {
    if (!option2?.length) submitableLabels.push({ [type1]: p1 });

    for (let p2 of option2) {
      if (!option3?.length) submitableLabels.push({ [type1]: p1, [type2]: p2 });
      for (let p3 of option3) submitableLabels.push({ [type1]: p1, [type2]: p2, [type3]: p3 });
    }
  }

  return submitableLabels;
};

const currentDate = new Date(moment().format(CONSTANT.DATE));

const getNumId = () => numId.generate(new Date().toJSON());

const getPaginationValidator = [
  query("page", "Please enter valid page").optional().toInt().isInt({ gt: 0 }),
  query("pageSize", "Please enter valid pageSize").optional().toInt().isInt({ gt: 0 }),
];

export default {
  buildPath,
  loadEnvFile,
  buildResponse,
  checkPayloadFiles,
  handlePayloadError,
  buildError,
  sendOTP,
  checkUserRole,
  getHash,
  regxEscape,
  checkPagination,
  getPaginatedData,
  makePaginatedData,
  getProductQuery,
  buildSubmitableLabel,
  currentDate,
  getNumId,
  getPaginationValidator,
};