# TransferWise Node.js Library

[![Version](https://img.shields.io/npm/v/@fightmegg/transferwise.svg)](https://www.npmjs.com/package/@fightmegg/transferwise)
[![Downloads](https://img.shields.io/npm/dm/@fightmegg/transferwise.svg)](https://www.npmjs.com/package/@fightmegg/transferwise)
[![CircleCI](https://circleci.com/gh/fightmegg/transferwise/tree/master.svg?style=svg)](https://circleci.com/gh/fightmegg/transferwise/tree/master)

> An open-source TransferWise API client for Node.JS
The TransferWise Node library provides convient access to the TransferWise API from applications written in server-side JavaScript.

## Documentation

See the [TransferWise API docs](https://api-docs.transferwise.com/#transferwise-api) for the offical docs, below is a list of methods supported by this library.

## Generate Credentials

Below is a series of steps which can through you can generate wise payment gateway's credentials.:

- When creating a new account you redirected to the sandbox account.
- From settings section you can generate new API tokens.
- Collect API-KEY and put it in your .env file.

**NB: Requires Node >= 12**

## Methods

Currently only supports methods listed below. Aim to support all API methods _soon_.

### Profiles :: 

**Request**


**`GET http://localhost:3003/api/wise/profiles`**

**description**

Create personal user profile. Same person cannot have multiple active duplicate user profiles. Thus creating multiple profiles with the same details will fail. Use the access token you received to act on behalf of the user in the Authorization header..  

**Example Request:**

```shell
curl --location --request GET 'http://localhost:3003/api/wise/profiles'
```

**Example Response:**
```json
{
    "message": "Profile details found successfully.",
    "result": [
        {
            "id": < ID >,
            "type": "personal",
            "details": {
                "firstName": "< firstName >",
                "lastName": "< lastName >",
                "dateOfBirth": "< dateOfBirth >",
                "phoneNumber": "< phoneNumber >",
                "avatar": null,
                "occupation": null,
                "occupations": null,
                "primaryAddress": "< primaryAddress >",
                "firstNameInKana": null,
                "lastNameInKana": null,
                "localizedInformation": []
            }
        },
    ]
}
```

### Currency Exchange Response :: 

**Request**


**`POST http://localhost:3003/api/wise/currency-exchange-response`**

**description**

Currency exchange api returns the real time currency exchange charges, fees and final amount to send to respective recipients account.  

**Example Request:**

```shell
curl --location --request POST 'http://localhost:3003/api/wise/currency-exchange-response' \
--header 'Content-Type: application/json' \
--data-raw '{
        "sourceAmount":10,
        "targetCurrency":"CAD"
    }'
```

**Example Response:**
```json
{
    "message": "Currency exchange response has been found successfully.",
    "result": {
        "payIn": "BALANCE",
        "payOut": "BANK_TRANSFER",
        "sourceCurrency": "USD",
        "targetCurrency": "CAD",
        "sourceAmount": 10,
        "targetAmount": 12.23,
        "fee": 0.53,
        "rate": 1.2914,
        "rateType": "FIXED",
        "feePercentage": 0.053,
        "estimatedDelivery": "2022-06-21T15:30:00Z"
    }
}
```

### Get profiles currencies ::

**Request**


**`POST http://localhost:3003/api/wise/balance-currencies`**

**description**

This API returns the all the available currencies in the wise platform which can helps to developer to showcase the all currencies in the UI.  

**Example Request:**

```shell
curl --location --request GET 'http://localhost:3003/api/wise/balance-currencies'
```

**Example Response:**
```json
{
    "message": "Balance currencies found successfully.",
    "result": [
        {
            "code": "<country code>",
            "hasBankDetails": false,
            "payInAllowed": false,
            "sampleBankDetails": null
        },
    ]
}
```

### Get account's requirements (Related to fields) :: 

**Request**


**`POST http://localhost:3003/api/wise/account-requirements/:currencyName`**

**description**

This API returns the all the fields which is necessary to fill up when we selected any currency. Based on this api in UI side developers showcase the dynamic form for the bank account based on selected currency.  

**Example Request:**

```shell
curl --location --request POST 'http://localhost:3003/api/wise/account-requirements/USD' \
--header 'Content-Type: application/json' \
--data-raw '{
    "currency": "GBP",
    "legalType": "PRIVATE"
}'
```

**Example Response:**
```json
{
    "message": "Account requirements has been found successfully.",
    "result": [
        {
            "type": "sort_code",
            "title": "Local bank account",
            "usageInfo": null,
            "fields": [
                {
                    "name": "Recipient type",
                    "group": [
                        {
                            "key": "legalType",
                            "name": "Recipient type",
                            "type": "select",
                            "refreshRequirementsOnChange": true,
                            "required": true,
                            "displayFormat": null,
                            "example": "",
                            "minLength": null,
                            "maxLength": null,
                            "validationRegexp": null,
                            "validationAsync": null,
                            "valuesAllowed": [
                                {
                                    "key": "PRIVATE",
                                    "name": "Person"
                                },
                                {
                                    "key": "BUSINESS",
                                    "name": "Business"
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    ]
}
```

### Create bank account ::

**Request**

**`POST http://localhost:3003/api/wise/accounts`**

**description**

Recipient is a person or institution who is the ultimate beneficiary of your payment.
Recipient data includes three data blocks.

**1. General Data**

Owned by customer is a boolen to flag whether this recipient is the same entity (person or business) as the one sending the funds. i.e. A user sending money to thier own account in another country/currency. This can be used to separate these recipients in your UI.

**2. Bank account data**

There are many different variations of bank account details needed depending on recipient target currency. 

**3. Address data**

Recipient address data is required only if target currency is USD, PHP, THB or TRY, or if the source currency is USD or AUD.

**Example Request:**

```shell
curl --location --request POST 'http://localhost:3003/api/wise/accounts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "paymentType":"bank",
    "currency":"CAD",
    "type":"canadian",
    "accountHolderName":"<user name>",
    "legalType":"PRIVATE",
    "institutionNumber":"270",
    "transitNumber":"00012",
    "accountNumber":"40117399",
    "accountType":"CHECKING",
    "address.country":"CA",
    "address.city":"Toronto",
    "address.firstLine":"JP Morgan Chase Bank, N.A., Toronto Branch",
    "address.postCode":"M5J2J2",
    "address.state":"ON"
}'
```

**Example Response:**
```json
{
    "message": "Wise account has been created successfully.",
    "result": {
        "wiseId": 148415792,
        "recipientData": {
            "data": {
                "id": 148415792,
                "business": 16462863,
                "profile": 16462863,
                "accountHolderName": "< user name >",
                "currency": "CAD",
                "country": "CA",
                "type": "canadian",
                "details": {
                    "address": {
                        "country": "CA",
                        "countryCode": "CA",
                        "firstLine": "JP Morgan Chase Bank, N.A., Toronto Branch",
                        "postCode": "M5J2J2",
                        "city": "Toronto",
                        "state": "ON"
                    },
                    "email": null,
                    "legalType": "PRIVATE",
                    "accountHolderName": null,
                    "accountNumber": "40117399",
                    "sortCode": null,
                    "abartn": null,
                    "accountType": "CHECKING",
                    "bankgiroNumber": null,
                    "ifscCode": null,
                    "bsbCode": null,
                    "institutionNumber": "270",
                    "transitNumber": "00012",
                    "phoneNumber": null,
                    "bankCode": null,
                    "russiaRegion": null,
                    "routingNumber": null,
                    "branchCode": null,
                    "cpf": null,
                    "cardToken": null,
                    "idType": null,
                    "idNumber": null,
                    "idCountryIso3": null,
                    "idValidFrom": null,
                    "idValidTo": null,
                    "clabe": null,
                    "swiftCode": null,
                    "dateOfBirth": null,
                    "clearingNumber": null,
                    "bankName": null,
                    "branchName": null,
                    "businessNumber": null,
                    "province": null,
                    "city": null,
                    "rut": null,
                    "token": null,
                    "cnpj": null,
                    "payinReference": null,
                    "pspReference": null,
                    "orderId": null,
                    "idDocumentType": null,
                    "idDocumentNumber": null,
                    "targetProfile": null,
                    "targetUserId": null,
                    "taxId": null,
                    "job": null,
                    "nationality": null,
                    "interacAccount": null,
                    "bban": null,
                    "town": null,
                    "postCode": null,
                    "language": null,
                    "billerCode": null,
                    "customerReferenceNumber": null,
                    "prefix": null,
                    "IBAN": null,
                    "iban": null,
                    "BIC": null,
                    "bic": null
                },
                "user": 5974075,
                "active": true,
                "ownedByCustomer": false
            }
        }
    }
}
```


### Create transfer ::

**Request**

**`POST http://localhost:3003/api/wise/transfers`**

**description**

A transfer is a payout order to a recipient account based on a quote. Once created, a transfer needs to be funded during the next 10 working days (based on the source currency). In case not it will get automatically cancelled.

**Example Request:**

```shell
curl --location --request POST 'http://localhost:3003/api/wise/transfers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "wiseId":148415792,
    "targetCurrency":"CAD",
    "sourceAmount":10
}'
```

**Example Response:**
```json
{
    "message": "Transfer to account has been completed.",
    "result": {
        "wiseTransactionId": 2783106,
        "estimatedTime": "2022-06-21T22:30:00.000Z",
        "status": "COMPLETED",
        "paymentGatewayData": {
            "transferId": 50916083,
            "quoteId": "58f9e9cf-e12a-49c9-9026-0cf9e3abed39",
            "type": "BALANCE",
            "status": "COMPLETED",
            "errorCode": null,
            "errorMessage": null,
            "balanceTransactionId": 2783106
        }
    }
}
```



### Create transfer ::

**Request**

**`POST http://localhost:3003/api/wise/transfers`**

**description**

A transfer is a payout order to a recipient account based on a quote. Once created, a transfer needs to be funded during the next 10 working days (based on the source currency). In case not it will get automatically cancelled.

**Example Request:**

```shell
curl --location --request POST 'http://localhost:3003/api/wise/transfers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "wiseId":148415792,
    "targetCurrency":"CAD",
    "sourceAmount":10
}'
```

**Example Response:**
```json
{
    "message": "Transfer to account has been completed.",
    "result": {
        "wiseTransactionId": 2783106,
        "estimatedTime": "2022-06-21T22:30:00.000Z",
        "status": "COMPLETED",
        "paymentGatewayData": {
            "transferId": 50916083,
            "quoteId": "58f9e9cf-e12a-49c9-9026-0cf9e3abed39",
            "type": "BALANCE",
            "status": "COMPLETED",
            "errorCode": null,
            "errorMessage": null,
            "balanceTransactionId": 2783106
        }
    }
}
```











## Webhook Verification

TransferWise signs all Webhook events, and it is recommended that you [verify this signature](https://api-docs.transferwise.com/#webhook-events-list-signature-header) . Luckily this library can do that for you.

Similarly to how `stripe node` works, you should only use the event returned from the method below.

```js
const event = tw.webhooks.constructEvent("<webhookMsg>", "<signature>");
```

Please note that you must pass the **raw** request body, exactly as recieved from TransferWise to the `constructEvent()` function; this will not work with a parsed (i.e., JSON) request body.

You can find an example of how to use this with [Express](https://expressjs.com/) below:

```js
app.post("/", bodyParser.raw({ type: "application.json" }), (req, res) => {
  const sig = req.headers["x-signature"];
  const event = tw.webhooks.constructEvent(req.body, sig);
  // ...
});
```

## Known Sandbox Issues

Below is a series of issues that l have found out through various email chains with TransferWise API team.

**1. Create a Transfer**

When creating a transfer, the field **targetValue** will always be populated as `0` regardless, therefore you should only rely on this field in production.

**2. Simulate a Transfer**

When funding a transfer, the transfer state might show `processing`, however this state is misleading. When simulating, you will still need to simulate from `incoming_payment_waiting` to `processing`.

## Development

Run all tests:

```bash
$ npm test
```

This library is published to both the NPM and GitHub package registrys.
