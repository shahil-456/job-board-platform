import e from "express";
import { userLogin, userLogout, userProfile, userSignup,new_test,profileUpdate,accountDeactivate,changePassword,uploadCV,myCV,checkUser } from "../controllers/userControllers.js";
import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";


const router = e.Router();

//signup
router.post("/signup", userSignup);

//login
router.put("/login", userLogin);

//profile
router.get("/profile", userAuth, userProfile);

router.get("/my_cv", userAuth, myCV);
router.get("/check-user", userAuth, checkUser);

// router.get("/new_test", new_test);

router.post("/new_test", new_test);

router.post("/update_profile",userAuth,upload.single('profile_pic'), profileUpdate);

router.post("/change_password",userAuth, changePassword);

router.post("/forgot_password", changePassword);

router.post("/upload_cv",userAuth,upload.single('cv') ,uploadCV);


// router.get("/deactivate",userAuth, accountDeactivate);

//logout
router.get("/logout", userAuth, userLogout);



export { router as userRouter };
