import e from "express";
import {new_test } from "../controllers/test.js";

const router = e.Router();


router.get("/new_test", new_test);



export { router as testRouter };
