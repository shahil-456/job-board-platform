import e from "express";
import { userRouter } from "./userRoutes.js";
import { mentorRouter } from "./mentorRoutes.js";
import { jobRouter } from "./jobRoutes.js";
import { adminRouter } from "./adminRoutes.js";

import { paymentRouter } from "./paymentRoutes.js";


const router = e.Router();

router.use("/user", userRouter);
router.use("/mentor", mentorRouter);
router.use("/job", jobRouter);
router.use("/admin", adminRouter);
router.use("/payment", paymentRouter);




// router.use("/tester", testRouter);


// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();

// // Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// // Parse application/json
// app.use(bodyParser.json());


// router.get("/", getProducts);
// router.post("/", createProduct);

// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export { router as apiRouter };

