import e from "express";
import { userLogin, userLogout, userProfile, userSignup,new_test,profileUpdate,accountDeactivate,changePassword } from "../controllers/userControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

//signup
router.post("/signup", userSignup);

//login
router.put("/login", userLogin);

//profile
router.get("/profile", userAuth, userProfile);

// router.get("/new_test", new_test);

router.post("/new_test", new_test);

router.post("/update_profile",userAuth, profileUpdate);

router.post("/change_password",userAuth, changePassword);

router.post("/forgot_password", changePassword);

// router.get("/deactivate",userAuth, accountDeactivate);

//logout
router.get("/logout", userAuth, userLogout);




export { router as userRouter };
