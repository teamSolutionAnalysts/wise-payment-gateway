
import * as l10n from "jm-ez-l10n";
import { Constants } from "../config/constants";

export class Failure extends Error {
  public static error(err: any, data?: any) {
    if (err instanceof SpFailure) {
      err.data = err.data === undefined ? data : err.data;
      return err;
    }
    if (err instanceof Failure) {
      err.type = err.type ? err.type : Constants.BAD_DATA;
      err.data = err.data === undefined ? data : err.data;
      return err;
    }
    const error = new Failure(l10n.t("ERR_INTERNAL_SERVER"), "Error is thrown by code", err, false, data);
    error.type = Constants.CODE;
    error.errorStack = err;
    error.data = data;
    return error;
  }

  public static spError(err: any, isSpError: boolean) {
    if (err instanceof Failure) {
      err.type = isSpError ? Constants.CODE : Constants.BAD_DATA;
      return err;
    }
    const error = new Failure(l10n.t("ERR_INTERNAL_SERVER"), "Error is thrown by code");
    error.type = Constants.CODE;
    error.errorStack = err;
    return error;
  }

  public static throwApiError(response) {
    if (response && response.responseCode === "01") {
      return new Failure(response.responseDescription || l10n.t("ERR_THIRD_PARTY"),
      response.responseDescription || l10n.t("ERR_THIRD_PARTY"), response, false);
    }
    return new Failure(l10n.t("ERR_THIRD_PARTY"), response.responseDescription || l10n.t("ERR_THIRD_PARTY"),
    response, false);
  }
  public description: string;
  public errorStack: Json;
  public title: string;
  public type: "BAD_DATA" | "CODE";
  public data: any;
  // Better approach need to be found for type
  constructor(title, description: string, errStack?: Json, isError?: boolean, data?: any) {
    super(title);
    this.title = title;
    this.type = isError ? Constants.CODE : Constants.BAD_DATA;
    this.description = description;
    if (errStack) {
      this.errorStack = errStack;
    }
    if (data) {
      this.data = data;
    }
  }
}

export class SpFailure extends Failure {
  constructor(title, description: string, isSpError: boolean, data?: Json) {
    super(title, description);
    super.type = isSpError ? Constants.CODE : Constants.BAD_DATA;
    super.data = data;
  }
}
