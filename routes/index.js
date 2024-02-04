const { Router } = require("express");
const fileRouter = require("./fileRoutes");
const userRouter = require("./userRoutes");

const router = Router();

router.use("/users", userRouter);
router.use("/files", fileRouter);

module.exports = router;
