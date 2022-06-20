import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";

import {isEmpty} from "lodash";
import { async } from "q";

export class UserController {
  private logger: any = Log.getLogger();

  // Get all currencies which available in wise plateform
  public currencies = async (req: Request, res: Response) => {
    const { password, email, fullName } = req.body;
    const encryptedPassword = bcryptjs.hashSync(password, 12);
    const userDetail =  { email, fullName, password: encryptedPassword };

    res.status(200).json(ResponseBuilder.data(null, req.t("SUCCESS")));
  }

  // Get all currencies-requirements of currency
  public currencyRequirements = async (req: Request, res: Response) => {
    const user = req.user;
    if (bcryptjs.compareSync(req.body.password, user.password)) {
      res.status(200).json(ResponseBuilder.data(null, req.t("SUCCESS")));
    } else {
      return res.status(400).json(ResponseBuilder.errorMessage(req.t("ERR_INVALID_PASSWORD")));
    }

  }

  // Create bank account 
  public createBankAccount = async (req: Request, res: Response) => {
    if (!isEmpty(req._user)) {
      const userData = req._user;
      return res.status(200).json(ResponseBuilder.data(userData, req.t("SUCCESS")));
    } else {
      return res.status(500).json(ResponseBuilder.errorMessage(req.t("ERR_TOKEN_EXP")));
    }
  }

  // Create transfer
  public createTransfer = async (req: Request, res: Response) => {
    if (!isEmpty(req._user)) {
      const userData = req._user;
      return res.status(200).json(ResponseBuilder.data(userData, req.t("SUCCESS")));
    } else {
      return res.status(500).json(ResponseBuilder.errorMessage(req.t("ERR_TOKEN_EXP")));
    }
  }

  // Changed payment status
  public changedPaymentStatus = async (req: Request, res: Response) => {
    if (!isEmpty(req._user)) {
      const userData = req._user;
      return res.status(200).json(ResponseBuilder.data(userData, req.t("SUCCESS")));
    } else {
      return res.status(500).json(ResponseBuilder.errorMessage(req.t("ERR_TOKEN_EXP")));
    }
  }
}
