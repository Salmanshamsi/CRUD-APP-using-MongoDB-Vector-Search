import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import stories from './routes/story.mjs';
import { MongoClient} from "mongodb";
import OpenAI from "openai";
import './config/index.mjs'

// Env Variables..

const OPENAI_API = process.env.OPEN_AI_API;
const MONGODB_URI = `mongodb+srv://shamsisalman81:salman@cluster0.f0kvwnv.mongodb.net/?retryWrites=true&w=majority`;

// OPEN AI initializiation...

const openai = new OpenAI({
    apiKey: OPENAI_API
});

//  server initialization...

// set middleWares..

const app  = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd() + "/public" )));


const port = process.env.PORT || 3000;


// mongodb initialization...

const client = new MongoClient(MONGODB_URI);
  
 await client.connect().then(()=>{
    client.db('socialapp').command({ ping: 1 });
    console.log('connect database sucessfully !');
 }).catch(()=>{
    console.log('database do not connected try again !');
});

const DB_Collection = client.db('socialapp').collection('stories');


// REST APIs

app.use("/stories",stories);

app.listen(port,()=>{
    console.log("server started..");
});


// Exports....

export {openai, DB_Collection};