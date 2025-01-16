import express from 'express';
import { connectDB } from './config/db.js';



const app = express();
const port = 3000;

const myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
  }
  
app.use(myLogger);


connectDB();

console.log('URI:', process.env.uri);

app.get('/', (req, res) => {
  res.send('Hello World!');
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
