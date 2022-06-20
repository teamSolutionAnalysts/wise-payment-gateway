// Import only what we need from express
import { Router } from "express";
import { Middleware } from "../../middleware";
import { Validator } from "../../validate";
import { UserController } from "./userController";
import { UserMiddleware } from "./userMiddleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const userMiddleware = new UserMiddleware();
const middleware = new Middleware();

router.get("/currencies", userController.currencies);
router.get("/currency-requirements/:currencyName", userController.currenciesRequirements);
router.post("/",  userController.getUser);

// Export the express.Router() instance to be used by server.ts
export const UserRoute: Router = router;
