const jwt = require("jsonwebtoken");
const { adminModel } = require("../../models");

const isAdmin = async(req, res, next) => {
    try {
        let ReqData = req;
        let defaultPrifix = ["Bearer", "token"];
        let token = req.headers.authorization;
        let tokenPrifix;
        let authData;
        let authRole;
        tokenPrifix = token?.split(" ")[0];
        token = token?.split(" ")[1];

        if (!token) return res.status(401).json({message:'Unauthorize!'});
        // throw helper.buildError("Please Login!", 401);

        if (!tokenPrifix || !defaultPrifix.includes(tokenPrifix)) {
            return res.status(401).json({message:`Please add valid token prefix like ${defaultPrifix.join(",")}`});
        // throw helper.buildError(`Please add valid token prefix like ${defaultPrifix.join(",")}`, 401);
        }

        authData = jwt.verify(token, process.env.JWT_SECRET);
        let authUser = await adminModel.findOne({ _id: authData.id });

        if (!authUser) return res.status(401).json({message:'Unauthorize!'});
        // throw helper.buildError(`Unauthorize!`, 401);
        if (authUser) authRole = (authUser).role;

        let userToJson = authUser.toJSON();

        if (userToJson.role == userRole.ADMIN && !userToJson.isActive) {
            return res.status(401).json({message:'Your account is deactived by super admin!'});
        // throw helper.buildError("Your account is deactived by super admin", 400);
        }

        ReqData.user = authUser;
        ReqData.role = authRole;
        req = ReqData;
        next();
    } catch (error) {
        let err = error;
        if (!error.statusCode) err = helper.buildError("Please Login Again!", 401);
        next(err);
    }
}

module.exports = { isAdmin }