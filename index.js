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
  origin: (origin, callback) => {
    // Allow specific trusted origins
    if (!origin || ['http://localhost:5173', 'https://job-board-platform-front-end.vercel.app'].includes(origin)) {
      callback(null, true);  // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS'), false);  // Reject other origins
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  credentials: true,  // Allow sending cookies (credentials)
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Allow specific headers
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
