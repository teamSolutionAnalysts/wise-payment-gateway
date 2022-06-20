// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../middleware";
import { Validator } from "../../validate";
import { WiseController } from "./wiseController";
import { WiseMiddleware } from "./wiseMiddleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const wiseController = new WiseController();
const wiseMiddleware = new WiseMiddleware();
const middleware = new Middleware();

// Get currencies and account requirements
router.get("/balance-currencies", wiseController.getBalanceCurrencies);
router.post("/account-requirements/:currencyName", wiseController.accountRequirements);

// Add receipient one per payment
router.post("/accounts", wiseController.createBankAccount);

// Fund transfer (from Balance)
router.post("/transfers", wiseController.createTransfer);

// Simulation Transfer Process (SBX only)
router.get("/simulation/:transferId/processing", wiseController.changePaymentStatus);
router.get("/simulation/:transferId/funds_converted", wiseController.changePaymentStatus);
router.get("/simulation/:transferId/outgoing_payment_sent", wiseController.changePaymentStatus);
router.get("/simulation/:transferId/bounced_back", wiseController.changePaymentStatus);
router.get("/simulation/:transferId/funds_refunded", wiseController.changePaymentStatus);

// Export the express.Router() instance to be used by server.ts
export const WiseRoute: Router = router;