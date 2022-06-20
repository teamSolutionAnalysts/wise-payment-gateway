import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as dotenv from "dotenv";
import * as express from "express";
import * as helmet from "helmet"; // Security
import * as l10n from "jm-ez-l10n";
import * as morgan from "morgan"; // log requests to the console (express4)
import * as path from "path";
import { Log } from "./helpers/logger";
import { ResponseBuilder } from "./helpers/responseBuilder";
import { Routes } from "./routes";

dotenv.config();

export class App {
  protected app: express.Application;
  private logger = Log.getLogger();
  constructor() {
    const NODE_ENV = process.env.NODE_ENV;
    const PORT = process.env.PORT as string;
    this.app = express();
    this.app.use(helmet());
    this.app.all("/*", (req, res, next) => {
      // res.setHeader("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Request-Headers", "*");
      // tslint:disable-next-line: max-line-length
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST");
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    });

    this.app.use(morgan("dev")); // log every request to the console
    l10n.setTranslationsFile("en", "src/language/translation.en.json");
    this.app.use(l10n.enableL10NExpress);
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.json(), (error, req, res, next) => {
      if (error) {
        return res.status(400).json({ error: req.t("ERR_GENRIC_SYNTAX") });
      }
      next();
    });
    this.app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
    const routes = new Routes(NODE_ENV);
    this.app.use("/api", routes.path());
    this.app.listen(PORT, () => {
      this.logger.info(`The server is running in port localhost: ${process.env.PORT}`);
    });
  }
}
