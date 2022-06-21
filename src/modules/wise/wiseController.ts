import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import * as uuid from "node-uuid";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { Wise } from "./wiseUtil";
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
      let transferParams = req.body;
      const wiseId = Number(transferParams.wiseId)
   
      // Generate QuoteParams
      const quoteParams:any = {
        profile: Number(process.env.TRANSFERWISE_PROFILE_ID),
        sourceCurrency: process.env.TRANSFERWISE_SOURCE_CURRENCY,
        sourceAmount: transferParams.sourceAmount,
        targetCurrency: transferParams.targetCurrency,
        targetAccount: wiseId,
        payOut: null,
        preferredPayIn: null
      }

      const quote:any = await Wise.createQuote(quoteParams); // Generated quote
      if( quote && quote.data && quote.data.id ) {
        const transferParams = {
          targetAccount: wiseId,
          quoteUuid: quote.data.id,
          customerTransactionId: uuid.v4()
        }
        const transfer: any = await this.createTransferFund(quote.data.id, transferParams); // Create Transfer
       
        if(transfer && transfer.paymentStatus == Constants.TRANSFER_STATUS.REJECTED){
          const transferResponse = {
            status: Constants.TRANSFER_STATUS.FAILED, 
            wiseTransactionId: transfer.paymentGatewayData.balanceTransactionId,
            paymentGatewayData: JSON.stringify(transfer.paymentGatewayData), // invoice data
          };
          return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).json(ResponseBuilder.errorMessage({message: req.t("TRANSFERWISE_REJECTED"), result: transferResponse}));

        } else if(transfer && transfer.paymentStatus == Constants.TRANSFER_STATUS.COMPLETED) {
          const getTimeEst: any = await Wise.getEstimatedTime(transfer.paymentGatewayData.transferId);
          const estTime = (getTimeEst && getTimeEst.data && getTimeEst.data.estimatedDeliveryDate) ? new Date(getTimeEst.data.estimatedDeliveryDate) : "";
        
          const transferResponse = {
            wiseTransactionId: transfer.paymentGatewayData.balanceTransactionId,
            estimatedTime : estTime,
            status: Constants.TRANSFER_STATUS.COMPLETED, 
            paymentGatewayData: transfer.paymentGatewayData, // invoice data
          };
          return res.status(Constants.SUCCESS_CODE).json({ message: req.t("TRANSFERWISE_COMPLETED"), result: transferResponse });
        } else {
          return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).json(ResponseBuilder.errorMessage(req.t("TRANSFERWISE_FAILED")));
        }
      } else {
        console.log(`ERR_PAY_INVOICE_QUOTE : ${Date.now()} , TARGET_ACCOUNT - ${quoteParams.targetAccount}`);
        return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).json(ResponseBuilder.errorMessage(req.t("ERR_PAY_INVOICE_QUOTE")));
      }
    } catch (error) {
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }

  // create Transfer
  public createTransferFund = async(quoteId, transferParams) => {
    let resObj = {};
    const transfer:any = await Wise.createTransfer(transferParams);
    if( transfer && transfer.data && transfer.data.id ) {
      const transferId = transfer.data.id;
      const fundTransferObj = {
          transferId,
          type: Constants.BALANCE,
      }

      // Transfer Money
      const transferFund: any = await Wise.transferFund(fundTransferObj);
      if (transferFund && transferFund.data) {
        let paymentStatus = ''
        let invoiceObj = {};
        if (transferFund.data.status === Constants.TRANSFER_STATUS.COMPLETED) {
            console.log(`TRANSFERWISE_SUCCESSFULLY : ${Date.now()} , TRANSFER_ID- ${transferId} , TARGET_ACCOUNT - ${transferParams.targetAccount}`);

            paymentStatus = Constants.TRANSFER_STATUS.COMPLETED;
            invoiceObj = {
                transferId,
                quoteId,
                ...transferFund.data
            }
            resObj = { paymentStatus: paymentStatus, paymentGatewayData: invoiceObj }
            return resObj;
        } else {
            console.log(`ERR_TRANSFERWISE_REJECTED_OR_FAILED : ${Date.now()} , TRANSFER_ID- ${transferId} , TARGET_ACCOUNT - ${transferParams.targetAccount}`);
            paymentStatus = Constants.TRANSFER_STATUS.REJECTED;
            invoiceObj = {
                transferId,
                quoteId,
                ...transferFund.data
            }
            resObj = { paymentStatus: paymentStatus, paymentGatewayData: invoiceObj }
            return resObj;
        }
      } else {
        console.log(`ERR_PAY_INVOICE_TRANSFER_FUND : ${Date.now()} , TRANSFER_ID- ${transferId} , TARGET_ACCOUNT - ${transferParams.targetAccount}`);
        resObj = { paymentStatus: Constants.TRANSFER_STATUS.REJECTED, paymentGatewayData: transferFund }
        return resObj;
      }
    } else {
      console.log(`ERR_PAY_CREATE_TRANSFER : ${Date.now()} , TRANSFER_ID- ${quoteId} , TARGET_ACCOUNT - ${transferParams.targetAccount}`);
      resObj = { paymentStatus: Constants.TRANSFER_STATUS.REJECTED, paymentGatewayData: transfer }
      return resObj;
    }
  }

  // Changed payment status
  public changePaymentStatus = async (req: Request, res: Response) => {
    try {
      const { id, status } = req.params;
      // change to stimulate status
      const stimulateResponse:any = await Wise.stimulateStatusChanging(id, status);

      if(stimulateResponse && stimulateResponse.data && stimulateResponse.data.id){
        const message = (status == Constants.WISE_TRANSFER_STATUS.PROCESSING) ? req.t("STATUS_CHANGED_PROCESSING") :
                        (status == Constants.WISE_TRANSFER_STATUS.OUTGOING_PAYMENT_SENT) ? req.t("STATUS_CHANGED_OUTGOING_PAYMENT_SENT") :
                        (status == Constants.WISE_TRANSFER_STATUS.FUNDS_REFUNDED) ? req.t("STATUS_CHANGED_FUNDS_REFUNDED") :
                        (status == Constants.WISE_TRANSFER_STATUS.FUNDS_CONVERTED) ? req.t("STATUS_CHANGED_FUNDS_CONVERTED") :
                        req.t("STATUS_CHANGED_BOUNCED_BACK");

        return res.status(Constants.SUCCESS_CODE).json({message : message, result : stimulateResponse.data});
      } else {
        const errMsg = (stimulateResponse.data.errors.length > 0) ? stimulateResponse.data.errors[0].message : req.t("STATUS_NOT_CHANGED");
        return res.status(Constants.NOT_FOUND_CODE).json(ResponseBuilder.errorMessage(errMsg));
      }
    } catch (error) {
      console.log(error);
      return res.status(Constants.INTERNAL_SERVER_ERROR_CODE).send({ error: req.t("ERR_INTERNAL_SERVER")});
    }
  }
}
