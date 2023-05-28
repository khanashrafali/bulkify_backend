import { CustomValidator, body, oneOf, param, query } from "express-validator";
import { CONSTANT, helper } from "../../utils";
import { categoryModel } from "../../models";
import { UserRole } from "../../utils/interfaces";

const userLogin: any[] = [
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
];

const checkCategory: CustomValidator = async (val, { req }) => {
  let category = await categoryModel.findOne({ _id: val });
  if (!category) throw helper.buildError("No category found with this id", 404);
};

const userSignup: any[] = [
  body("name", "Please enter valid name")
    .exists()
    .trim()
    .notEmpty()
    .isAlpha("en-IN", { ignore: [" ", "."] }),
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
];

const vendorSignup: any[] = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password),
  body('firstName', "Please enter valid first name").exists().trim().notEmpty(),
  body('lastName', "Please enter valid last name").exists().trim().notEmpty(),
  body('mobileNumber', "Please enter valid mobile number").exists().trim().notEmpty(),
  body('companyName', "Please enter valid company name").exists().trim().notEmpty(),
  body('country', "Please enter valid country").exists().trim().notEmpty(),
  // body('categoryForBusiness', "Please select valid category").exists().trim().notEmpty().custom(checkCategory),
];

const resendOtp = [
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
];

const verifyOtp = [
  oneOf(
    [
      body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
      body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
    ],
    "Please enter valid mobile number or email id"
  ),
  body("otp", "Please enter valid otp").exists().trim().notEmpty(),
];

const adminSignup = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password),
  body('firstName', "Please enter valid first name").exists().trim().notEmpty(),
  body('lastName', "Please enter valid last name").exists().trim().notEmpty(),
  body('mobileNumber', "Please enter valid mobile number").exists().trim().notEmpty(),
  body("role", "Please select valid role").exists().trim().notEmpty().isIn([UserRole.SUPER_ADMIN, UserRole.ADMIN])
];

const resendAdminEmail = [body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()];

const verifyAdminEmail = [
  body("token", "Please enter valid token").exists().trim().notEmpty(),
  body("email","Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()
];

const resendVendorEmail = [body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()];

const verifyVendorEmail = [
  body("token", "Please enter valid token").exists().trim().notEmpty(),
  body("email","Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail()
];

const adminLogin = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Please enter valid password`).exists().trim().notEmpty(),
];

const getValidateToken = [
  query("token", "Please enter valid token").exists().trim().notEmpty(),
  query("role", `Please enter valid role like ${CONSTANT.USER_ROLES.join(", ")}`).isIn(CONSTANT.USER_ROLES),
];

const vendorLogin = [
  body("email", "Please enter valid email").exists().trim().notEmpty().isEmail().normalizeEmail(),
  body("password", `Please enter valid password`).exists().trim().notEmpty(),
];

const changePassword = [
  body("oldPassword", "Please enter valid oldPassword").exists(),
  body("newPassword", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password),
  body("confirmPassword", "Please enter valid confirmPassword").exists().trim().notEmpty(),
];

const postReplacePassword = [
  body("newPassword", `Password must be at least 8 digits and it should have 1 uppercase, 1 lowercase, 1 number and 1 special character`)
    .exists()
    .trim()
    .notEmpty()
    .matches(CONSTANT.REGX.Password)
    .isLength({ max: 20 })
    .withMessage("password length must be less then 20"),
  body("confirmPassword", "Please enter valid confirm confirmPassword")
    .exists()
    .trim()
    .notEmpty()
    .custom(async (val, { req }) => {
      if (val !== req.body.newPassword) throw helper.buildError("must match new Password and confirm password", 400);
    }),
];

const putResetAdminPassword = [body("otp", "Please enter valid otp").exists().trim().notEmpty(), ...postReplacePassword];
const postSendAdminForgotPasswordMail = [...resendAdminEmail];
const putResetVendorPassword = [body("otp", "Please enter valid token").exists().trim().notEmpty(), ...postReplacePassword];
const postSendVendorForgotPasswordMail = [...resendAdminEmail];

export default {
  userLogin,
  userSignup,
  resendOtp,
  verifyOtp,
  vendorLogin,
  vendorSignup,
  adminLogin,
  adminSignup,
  resendAdminEmail,
  verifyAdminEmail,
  resendVendorEmail,
  verifyVendorEmail,
  getValidateToken,
  changePassword,
  putResetAdminPassword,
  postSendAdminForgotPasswordMail,
  putResetVendorPassword,
  postSendVendorForgotPasswordMail,
};
