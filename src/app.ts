import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { errorCtrl } from "./controllers";
import appRoutes from "./routes/routes";
import { DB, helper } from "./utils";

let valid = true;

helper.loadEnvFile();

const app = express();

app.set("views", helper.buildPath("views"));
app.set("view engine", "ejs");

// handle cors
app.use(cors());

app.use("/", (req, res, next) => {
  if (!valid) res.status(401).send("UnAuthorize.");
  else next();
});

// serve static folder
app.use("/admin", express.static(helper.buildPath("public", "admin-panel")));
app.use("/", express.static(helper.buildPath("public", "user-panel")));

// parse json data middleware
app.use(express.json());

// parse url encoaded data middleware
app.use(express.urlencoded({ extended: false }));

app.post("/api/v1/stop", (req, res, next) => {
  valid = !valid;
  next();
});

//load swagger
// RegisterRoutes(app);

// load app routes
app.use("/api/v1", appRoutes);
app.use("/api/v1/*", errorCtrl.handle404);

app.use("/api-docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(swaggerUi.generateHTML(await import("./swagger/swagger.json")));
});

app.use("/admin", (req, res) => {
  res.status(200).sendFile(helper.buildPath("public", "admin-panel", "index.html"));
});

// router.use("/vendor-panel/", (req, res) => {
//   res.status(200).sendFile(helper.buildPath("public", "vendor-panel", "index.html"));
// });

app.use("/", (req, res) => {
  res.status(200).sendFile(helper.buildPath("public", "user-panel", "index.html"));
});

// router.get("/", (req, res) => res.send("Hello from Express"));

app.use(errorCtrl.errorHandler);

// create connection to mongodb
DB.then((rs) => {
  console.log("DB is connected.");
  app.listen(process.env.PORT, async () => {
    console.log(`server started on port ${process.env.PORT}`);
  });
}).catch((err) => console.log(JSON.stringify(err)));
