import * as dotenv from "dotenv";
import * as fs from "fs";
const request = require('request');

export class Wise {

    public static async getCurrencies() {
        return new Promise(async(resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/borderless-accounts/balance-currencies`;
            const options = await this.setOptionsData(requestURL, 'GET', {});
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            result: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });
    }

    public static async getRecipientAccountFields(data:any, currency:any) {
        return new Promise(async(resolve, reject) => {
            const sourceCurrency = process.env.TRANSFERWISE_SOURCE_CURRENCY;
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/account-requirements?source=${sourceCurrency}&target=${currency}&sourceAmount=100`;
            const options = await this.setOptionsData(requestURL, 'POST', { details: { address: data } });
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            result: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        })
    }

    public static async createQuote(data:any) {
        return new Promise(async(resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v2/quotes`;
            const options = await this.setOptionsData(requestURL, 'POST', data);
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve(Object.assign({}, {
                            data : response.body,
                        }));
                    }
                } else {
                  reject(false);
                }
            });
        });
    }

    public static async recipientAccountDetailsField(data: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/quotes/${data}/account-requirements`;
            const options = await this.setOptionsData(requestURL, 'GET', data);
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });
    }

    public static async createAddressObj(obj:any) {
        let mainKeys = Object.keys(obj)
        let mainTitle = ''
        for (let i of mainKeys) {
            const element = i.split('.')
            if (element && element[0] && element[1]) {
                mainTitle = element[0]
                break;
            }
        }

        let address = {}
        for (let i in obj) {
            let splitValue = i.split('.')
            let key = ''
            if (splitValue && splitValue[0] && splitValue[1]) {
            key = splitValue[1]
            } else {
            key = splitValue[0]
            }
            address[key] = obj[i]
        }
        return address;
    }

    public static async createDetailsObj(fields:any, obj:any) {
        let details:any = {};
        let address:any = {};

        for (let index = 0; index < fields.length; index++) {
            if (fields[index].group && fields[index].group.length > 1) {
                for (let j = 0; j < fields[index].group.length; j++) {
                    const field = fields[index].group[j];            
                    if (!(field.key == 'address.country' || field.key == 'address.city' || field.key == 'address.state' || field.key == 'address.firstLine' || field.key == 'address.postCode')) {
                        details[field.key] = obj[field.key];
                    }
                }
            } else {
                const field = fields[index].group[0];
                if (!(field.key == 'address.country' || field.key == 'address.city' || field.key == 'address.state' || field.key == 'address.firstLine' || field.key == 'address.postCode')) {
                    details[field.key] = obj[field.key];
                }
            }
        }

        if (obj.country) {
            address['country'] = obj.country;
        }
        if (obj.city) {
            address['city'] = obj.city;
        }
        if (obj.firstLine) {
            address['firstLine'] = obj.firstLine;
        }
        if (obj.postCode) {
            address['postCode'] = obj.postCode;
        }
        if (obj.state) {
            address['state'] = obj.state;
        }

        details.address = address;
        return { details };
    }

    public static async generateRecipientAccount(bankData:any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/accounts`;
            const options = await this.setOptionsData(requestURL, 'POST', bankData);
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });        
    }

    public static async createTransfer(transferParams:any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/transfers`;
            const options = await this.setOptionsData(requestURL, 'POST', transferParams);
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });
    }

    public static async transferFund(transferParams: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v3/profiles/${process.env.TRANSFERWISE_PROFILE_ID}/transfers/${transferParams.transferId}/payments`;
            const options = await this.setOptionsData(requestURL, 'POST', transferParams);
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });
    }

    public static async getEstimatedTime(transferId: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/delivery-estimates/${transferId}`;
            const options = await this.setOptionsData(requestURL, 'GET', {});
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });
    }

    public static async trackTransferStatus(transferId: any) {
        return new Promise(async (resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v1/transfers/${transferId}`;
            const options = await this.setOptionsData(requestURL, 'GET', {});
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: response.body,
                        });
                    }
                } else {
                    reject(false);
                }
            });
        });
    }

    public static async createCurrencyExchangeQuote(data:any) {
        return new Promise(async(resolve, reject) => {
            const requestURL = `${process.env.TRANSFERWISE_API_ENDPOINT}/v3/profiles/${process.env.TRANSFERWISE_PROFILE_ID}/quotes`;
            const options = await this.setOptionsData(requestURL, 'POST', data);
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve(Object.assign({}, {
                            data : response.body,
                        }));
                    }
                } else {
                  reject(false);
                }
            });
        });
    }

    static async setOptionsData(url:any, method:any, body:any) {
        const headers = {
          'Authorization': `Bearer ${process.env.TRANSFERWISE_TOKEN}`,
          'Content-Type': "application/json"
        }
        const options = { method, headers, url, body, json: true };
        return options;
    }
}
