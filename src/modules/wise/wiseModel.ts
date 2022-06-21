import {
    IsNotEmpty, IsNumberString, IsOptional, MaxLength, MinLength,
  } from "class-validator";
  
  import { Model } from "../../model";
  
  export class BankModel extends Model {
    @IsNotEmpty({
      message: "ERR_ACCOUNT_NUMBER_IS_EMPTY",
    })
    @MinLength(5, {
      message: "ERR_ACCOUNT_NUMBER_LENGTH_SMALLER",
    })
    @MaxLength(50, {
      message: "ERR_ACCOUNT_NUMBER_LENGTH_LARGER",
    })
    @IsNumberString()
    public accountNumber: string;
  
    constructor(body: any) {
      super();
      const {
        accountNumber,
      } = body;
  
      this.accountNumber = accountNumber;
    }
  }
  
  export class BankUpdateModel extends Model {
  
    @IsNotEmpty()
    @MinLength(5, {
      message: "ERR_ACCOUNT_NUMBER_LENGTH_SMALLER",
    })
    @MaxLength(50, {
      message: "ERR_ACCOUNT_NUMBER_LENGTH_LARGER",
    })
    @IsNumberString()
    @IsOptional()
    public accountNumber: string;
  
    constructor(body: any) {
      super();
      const {
        accountNumber,
      } = body;
  
      this.accountNumber = accountNumber;
  
    }
  }
  
  export class CurrencyExchangeModel extends Model {
    @IsNotEmpty({
      message: "ERR_SOURCE_AMOUNT_IS_EMPTY",
    })
    public sourceAmount: string;
  
    constructor(body: any) {
      super();
      const {
        sourceAmount
      } = body;
  
      this.sourceAmount = sourceAmount;
    }
  }