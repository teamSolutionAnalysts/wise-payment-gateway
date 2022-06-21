// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../middleware";
import { Validator } from "../../validate";
import { WiseController } from "./wiseController";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const wiseController = new WiseController();
const middleware = new Middleware();

// Get profiles
router.get("/profiles", wiseController.getProfiles);
router.post("/currency-exchange-response", wiseController.getCurrencyExchange);

// Get currencies and account requirements
router.get("/balance-currencies", wiseController.getBalanceCurrencies);
router.post("/account-requirements/:currencyName", wiseController.accountRequirements);

// Add receipient one per payment
router.post("/accounts", wiseController.createBankAccount);

// Fund transfer (from Balance)
router.post("/transfers", wiseController.createTransfer);

// Simulation Transfer Process (SBX only)
router.get("/simulation/:id/:status", wiseController.changePaymentStatus); // processing, outgoing_payment_sent, funds_converted, bounced_back, funds_refunded

// Export the express.Router() instance to be used by server.ts
export const WiseRoute: Router = router;