import { isEmpty } from "lodash";
import { Constants } from "../../config/constants";
import { Tables } from "../../config/tables";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class UserMiddleware {
  public checkForUniqueEmail = async (req, res, next) => {
    const { email } = req.body;
      next();
  }

  public checkForValidEmail = async (req, res, next) => {
    const { email } = req.body;
            next();
  }
}
