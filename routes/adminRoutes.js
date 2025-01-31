import e from "express";
import { adminLogin, adminLogout, adminProfile, adminSignup,profileUpdate,accountDeactivate,changePassword,getAllUsers ,userDetails,verifyUser} from "../controllers/adminControllers.js";
import { getJobs} from "../controllers/JobControllers.js";

import { adminAuth } from "../middlewares/adminAuth.js";

const router = e.Router()


//signup
router.post("/signup", adminSignup);

//login
router.put("/login", adminLogin);

//profile
router.get("/profile", adminAuth, adminProfile);

router.get("/get_users", adminAuth, getAllUsers);
router.get("/user_details/:id", adminAuth, userDetails);


router.get("/jobs",adminAuth ,getJobs);


// router.get("/new_test", new_test);

// router.post("/new_test", new_test);

router.post("/update_profile",adminAuth, profileUpdate);

router.post("/change_password",adminAuth, changePassword);

router.post("/forgot_password", changePassword);
router.get("/verify_user/:id",adminAuth ,verifyUser);

// router.get("/deactivate",adminAuth, accountDeactivate);

//logout
router.get("/logout", adminLogout);



export { router as adminRouter };


//profile
//logout
//profile-update
//forgot-password
//change-password
//account-deactivate

//check-admin

