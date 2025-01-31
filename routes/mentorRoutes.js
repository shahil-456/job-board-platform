import e from "express";
import { mentorLogin, mentorLogout, mentorProfile, mentorSignup,new_test,profileUpdate,accountDeactivate,changePassword,getAllUsers ,userDetails} from "../controllers/mentorControllers.js";
import { mentorAuth } from "../middlewares/mentorAuth.js";

const router = e.Router()


//signup
router.post("/signup", mentorSignup);

//login
router.put("/login", mentorLogin);

//profile
router.get("/profile", mentorAuth, mentorProfile);

router.get("/get_users", mentorAuth, getAllUsers);
router.get("/user_details/:id", mentorAuth, userDetails);


// router.get("/new_test", new_test);

router.post("/new_test", new_test);

router.post("/update_profile",mentorAuth, profileUpdate);

router.post("/change_password",mentorAuth, changePassword);

router.post("/forgot_password", changePassword);

// router.get("/deactivate",mentorAuth, accountDeactivate);

//logout
router.get("/logout", mentorLogout);



export { router as mentorRouter };


//profile
//logout
//profile-update
//forgot-password
//change-password
//account-deactivate

//check-mentor

