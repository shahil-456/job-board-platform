import e from "express";
import {  jobProfile,new_test,profileUpdate,accountDeactivate,changePassword,createJob,getJobs,jobDetails,applyForJob,searchJobs,verifyJob ,updateJob,getApplications,deleteAllJobApp,deleteJob,getAppbyID,getJobsAdmin,applyDetails,acceptJob,getUserJobs,deleteApps,} from "../controllers/jobControllers.js";
import { mentorLogin, mentorLogout, mentorProfile, mentorSignup ,userDetails,getAllEmployers} from "../controllers/mentorControllers.js";



import { mentorAuth } from "../middlewares/mentorAuth.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { jobAuth } from "../middlewares/jobAuth.js";



import { upload } from "../middlewares/multer.js";

const router = e.Router()


//signup

router.post("/create",mentorAuth,upload.single('image') ,createJob);

// router.get("/jobs",mentorAuth ,getJobs);

// router.get("/jobs",adminAuth ,getJobs);
// router.get("/jobs",userAuth ,getJobs);
router.get("/del", jobAuth, deleteAllJobApp);


router.get("/jobs",jobAuth ,getJobs);

router.get("/jobs-admin",jobAuth ,getJobsAdmin);

router.get("/get-Applications",jobAuth ,getApplications);

router.get("/get-UserJobs",userAuth ,getUserJobs);

router.get("/get-App/:id",jobAuth ,getAppbyID);


router.get("/del-job/:id" ,deleteJob);


router.get("/get_job_apply/:id",userAuth ,applyDetails);

router.get("/get_employers/",jobAuth ,getAllEmployers);




router.get("/get_job_details/:id",jobAuth ,jobDetails);

router.get("/apply_job/:id",userAuth ,applyForJob);

router.post("/search_jobs/",userAuth ,searchJobs);

router.get("/verify_job/:id",adminAuth ,verifyJob);

router.put("/update-job/:jobId",mentorAuth,upload.single('image'), updateJob);


//login
// router.put("/login", jobLogin);

//profile
router.get("/profile", mentorAuth, jobProfile);

// router.get("/new_test", new_test);

router.post("/new_test", new_test);

router.get("/accept_job/:id",jobAuth ,acceptJob);

router.get("/del_s", jobAuth,deleteApps);




// router.get("/deactivate",mentorAuth, accountDeactivate);

//logout
// router.get("/logout", mentorAuth, JobLogout);



export { router as jobRouter };




//check-Job

