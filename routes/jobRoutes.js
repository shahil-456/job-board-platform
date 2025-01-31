import e from "express";
import {  jobProfile,new_test,profileUpdate,accountDeactivate,changePassword,createJob,getJobs,jobDetails,applyForJob,searchJobs,verifyJob } from "../controllers/JobControllers.js";
import { mentorAuth } from "../middlewares/mentorAuth.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";

const router = e.Router()


//signup

router.post("/create",mentorAuth,upload.single('image') ,createJob);

// router.get("/jobs",mentorAuth ,getJobs);

// router.get("/jobs",adminAuth ,getJobs);
// router.get("/jobs",userAuth ,getJobs);

router.get("/jobs",userAuth ,getJobs);


router.get("/get_job_details/:id",mentorAuth ,jobDetails);

router.get("/apply_job/:id",userAuth ,applyForJob);

router.post("/search_jobs/",userAuth ,searchJobs);

router.get("/verify_job/:id",adminAuth ,verifyJob);








//login
// router.put("/login", jobLogin);

//profile
router.get("/profile", mentorAuth, jobProfile);

// router.get("/new_test", new_test);

router.post("/new_test", new_test);






// router.get("/deactivate",mentorAuth, accountDeactivate);

//logout
// router.get("/logout", mentorAuth, JobLogout);



export { router as jobRouter };




//check-Job

