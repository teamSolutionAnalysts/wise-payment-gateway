import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Wise } from "./wiseUtil";

import {isEmpty} from "lodash";
import { async } from "q";

export class WiseController {

  // Get profiles details
  public getProfiles = async (req: Request, res: Response) => {
    try {
      const profileResponse:any = await Wise.getProfile();
      if (profileResponse && profileResponse.result) {
        return res.status(Constants.SUCCESS_CODE).json({message: req.t("PROFILE_FOUND"),result: profileResponse.result });
      } else {
        return res.status(Constants.NOT_FOUND_CODE).json(ResponseBuilder.errorMessage(req.t("PROFILE_NOT_FOUND")));
      }   
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Get all currencies which available in wise plateform
  public getBalanceCurrencies = async (req: Request, res: Response) => {
    try {
      const currencyResponse:any = await Wise.getCurrencies();
      if (currencyResponse && currencyResponse.result) {
        return res.status(Constants.SUCCESS_CODE).json({message: req.t("BALANCE_CURRENCY_FOUND"),result: currencyResponse.result });
      } else {
        return res.status(Constants.NOT_FOUND_CODE).json(ResponseBuilder.errorMessage(req.t("BALANCE_CURRENCY_NOT_FOUND")));
      }
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Get all currencies-requirements of currency
  public accountRequirements = async (req: Request, res: Response) => {
    try {
      const { currency } = req.body;
      const result:any = await Wise.getRecipientAccountFields(req.body, currency);
      if (result && result.result) {
        return res.status(Constants.SUCCESS_CODE).json({ message: req.t("PAYMENT_CURRENCY_FIELDS_FOUND"), result: result.result });
      } else {
        return res.status(Constants.NOT_FOUND_CODE).json(ResponseBuilder.errorMessage(req.t("PAYMENT_CURRENCY_FIELDS_NOT_FOUND")));
      }  
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // Create bank account 
  public createBankAccount = async (req: Request, res: Response) => {
    try {
      let accountData = req.body;

      // create quote object
      const quoteObj = {
        profile: Number(process.env.TRANSFERWISE_PROFILE_ID),
        sourceCurrency: process.env.TRANSFERWISE_SOURCE_CURRENCY,
        targetCurrency: accountData.currency,
        targetAmount: Number(process.env.TRANSFERWISE_AMOUNT),
        payOut: null,
        preferredPayIn: null
      }

      const quoteData:any = await Wise.createQuote(quoteObj); // create quote
      const fieldData:any = await Wise.recipientAccountDetailsField(quoteData.data.id); // get recipient data
      const addressData = await Wise.createAddressObj(accountData); // create address object
      const detailsData = await Wise.createDetailsObj(fieldData.data[0].fields, addressData); // create details object

      // Generate user bank account params
      const bankParams = {
        "profile" : process.env.TRANSFERWISE_PROFILE_ID,
        "accountHolderName" : accountData.accountHolderName,
        "type"  : accountData.type,
        "currency"  : accountData.currency,
        ...detailsData
      }

      let accountResponse:any = await Wise.generateRecipientAccount(bankParams); // Generate recipient account
      
      if(accountResponse && accountResponse.data.id) {
        // account response
        const accountResult = {
          wiseId : accountResponse.data.id,
          recipientData: accountResponse
        }
        return res.status(Constants.SUCCESS_CODE).json({ message: req.t("BANK_ADDED"), result: accountResult });
      } else {
        const errMsg = (accountResponse.data.errors.length > 0) ? accountResponse.data.errors[0].message : req.t("ERR_BANK_ADD");
        return res.status(Constants.FAIL_CODE).json(ResponseBuilder.errorMessage(errMsg));
      }
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
