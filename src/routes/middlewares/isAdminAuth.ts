import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { adminModel, userModel } from "../../models";
import { helper } from "../../utils";
import { UserRole } from "../../utils/interfaces";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let ReqData: any = req;
    let defaultPrifix = ["Bearer", "token"];
    let token = req.headers.authorization;
    let tokenPrifix: string | undefined;
    let authData: any;
    let authRole: any;

    tokenPrifix = token?.split(" ")[0];
    token = token?.split(" ")[1];

    if (!token) throw helper.buildError("Please Login!", 401);

    if (!tokenPrifix || !defaultPrifix.includes(tokenPrifix)) {
      throw helper.buildError(`Please add valid token prefix like ${defaultPrifix.join(",")}`, 401);
    }

    authData = jwt.verify(token, process.env.JWT_SECRET as string);

    let authUser = await userModel.findOne({ _id: authData.id });

    if (!authUser) throw helper.buildError(`Unauthorize!`, 401);
    if (authUser) authRole = (authUser as any).role;

    let userToJson: any = authUser.toJSON();

    if (userToJson.role == UserRole.ADMIN && !userToJson.isActive) throw helper.buildError("Your account is deactived by super admin", 400);

    ReqData.user = authUser;
    ReqData.role = authRole;
    req = ReqData;
    next();
  } catch (error: any) {
    let err = error;
    if (!error.statusCode) err = helper.buildError("Please Login Again!", 401);
    next(err);
  }
};

export { isAdmin };
