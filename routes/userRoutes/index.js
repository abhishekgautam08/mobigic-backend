const { Router } = require("express");
const { signupUserController, loginUserController, whoAmIController } = require("../../controllers/userController");
const { authorizeUser } = require("../../middlewares/authorize");


const userRouter = Router();

userRouter.route("/signup").post(signupUserController);
userRouter.route("/login").post(loginUserController);

userRouter.route("/me").get(authorizeUser, whoAmIController);

module.exports = userRouter;
