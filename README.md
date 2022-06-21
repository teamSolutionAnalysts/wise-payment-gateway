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

### Profiles

**Request**


**`GET http://localhost:3003/api/wise/profiles`**

**description**

A transfer is a payout order to a recipient account based on a quote. Once created, a transfer needs to be funded during the next 10 working days (based on the source currency). 
In case not it will get automatically cancelled.  

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






**balance-currencies**

```js
await tw.borderlessAccounts("<profileId>");
```

**accounts-requirements**

```js
await tw.recipientAccounts.create("<accounts object>");
await tw.recipientAccounts.get("<accountId>");
await tw.recipientAccounts.delete("<accountId>");
await tw.recipientAccounts.list("<account url params>");
```

**accounts**

```js
await tw.quotes.temporary("<quote url params>");
await tw.quotes.create("<quote object>");
await tw.quotes.get("<quoteId>");
```

**transfers**

```js
await tw.transfers.create("<transfer object>");
await tw.transfers.cancel("<transfer object>");
await tw.transfers.get("<transferId>");
await tw.transfers.issues("<transferId>");
await tw.transfers.fund("<profileId>", "<transferId>");
await tw.transfers.deliveryEstimate("<transferId>");
await tw.transfers.list("<transfer url params>");
```

**simulation**

```js
await tw.simulation.transfers.processing("<transferId>");
await tw.simulation.transfers.fundsConverted("<transferId>");
await tw.simulation.transfers.outgoingPaymentSent("<transferId>");
await tw.simulation.transfers.bouncedBack("<transferId>");
await tw.simulation.transfers.fundsRefunded("<transferId>");
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
