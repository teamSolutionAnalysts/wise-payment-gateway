import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Wise } from "./wiseUtil";

import {isEmpty} from "lodash";
import { async } from "q";

export class WiseController {
  // Get all currencies which available in wise plateform
  public getBalanceCurrencies = async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Get all currencies-requirements of currency
  public accountRequirements = async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Create bank account 
  public createBankAccount = async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Create transfer
  public createTransfer = async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Changed payment status
  public changePaymentStatus = async (req: Request, res: Response) => {
    try {
      
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }
}
