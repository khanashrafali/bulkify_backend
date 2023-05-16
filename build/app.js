"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const controllers_1 = require("./controllers");
const routes_1 = __importDefault(require("./routes/routes"));
const utils_1 = require("./utils");
let valid = true;
utils_1.helper.loadEnvFile();
const app = (0, express_1.default)();
app.set("views", utils_1.helper.buildPath("views"));
app.set("view engine", "ejs");
// handle cors
app.use((0, cors_1.default)());
app.use("/", (req, res, next) => {
    if (!valid)
        res.status(401).send("UnAuthorize.");
    else
        next();
});
// serve static folder
app.use("/admin", express_1.default.static(utils_1.helper.buildPath("public", "admin-panel")));
app.use("/", express_1.default.static(utils_1.helper.buildPath("public", "user-panel")));
// parse json data middleware
app.use(express_1.default.json());
// parse url encoaded data middleware
app.use(express_1.default.urlencoded({ extended: false }));
app.post("/api/v1/stop", (req, res, next) => {
    valid = !valid;
    next();
});
//load swagger
// RegisterRoutes(app);
// load app routes
app.use("/api/v1", routes_1.default);
app.use("/api/v1/*", controllers_1.errorCtrl.handle404);
app.use("/api-docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("./swagger/swagger.json")))));
}));
app.use("/admin", (req, res) => {
    res.status(200).sendFile(utils_1.helper.buildPath("public", "admin-panel", "index.html"));
});
// router.use("/vendor-panel/", (req, res) => {
//   res.status(200).sendFile(helper.buildPath("public", "vendor-panel", "index.html"));
// });
app.use("/", (req, res) => {
    res.status(200).sendFile(utils_1.helper.buildPath("public", "user-panel", "index.html"));
});
// router.get("/", (req, res) => res.send("Hello from Express"));
app.use(controllers_1.errorCtrl.errorHandler);
// create connection to mongodb
utils_1.DB.then((rs) => {
    console.log("DB is connected.");
    app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`server started on port ${process.env.PORT}`);
    }));
}).catch((err) => console.log(JSON.stringify(err)));
