import express = require("express");
import * as l10n from "jm-ez-l10n";
import { Middleware } from "./middleware";
import { UserRoute } from "./modules/user/userRoute";

export class Routes {
  protected basePath: string;

  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case "production":
        this.basePath = "/app/dist";
        break;
      case "development":
        this.basePath = "/app/public";
        break;
    }
  }

  public defaultRoute(req: express.Request, res: express.Response) {
    res.json({
      message: "Hello !",
    });
  }

  public path() {
    const router = express.Router();
    const middleware = new Middleware();
    router.use("/user", UserRoute);
    // router.use("/other-module", OtherModule);

    router.all("/*", (req, res) => {
      return res.status(404).json({
        error: l10n.t("ERR_URL_NOT_FOUND"),
      });
    });
    return router;
  }
}
