import * as _ from "lodash";
import { Tables } from "./config/tables";
import { ResponseBuilder } from "./helpers/responseBuilder";

export class Middleware {

  public authenticateUser = async (req, res, next: () => void) => {

    if (req.headers.authorization && !_.isEmpty(req.headers.authorization)) {
        return res.status(401).json(ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
      
    } else {
      return res.status(401).json(ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
    }
  }
}
