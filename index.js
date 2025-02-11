import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { apiRouter } from "./routes/index.js";
import dotenv from "dotenv";
import bodyParser from 'body-parser'; // Import body-parser
import cors  from 'cors';

dotenv.config();

const app = express();


// Use body-parser to parse JSON bodies
app.use(express.json())
app.use(cookieParser())
const port = 3001;
app.use(cors({
    origin: ['http://localhost:5173','https://job-board-platform-front-qqitgf11v-shahils-projects-80f10986.vercel.app/user/login'] ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
    credentials: true,  // Allow sending cookies
  }));
//   allowedHeaders: '*',  // Allow all headers
 

app.use(express.json())

app.use(bodyParser.urlencoded({
    extended: true
}));

connectDB();

console.log('URI:', process.env.uri);
if (!process.env.uri) {
    console.error('Environment variable "uri" is not defined');
}


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post('/test', (req, res) => {
    console.log(req.body); // Log the POST data
    res.json({
        message: 'Received POST data',
        data: req.body
    });
});


app.use("/api", apiRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});





//http://localhost:3000/api/user/login
