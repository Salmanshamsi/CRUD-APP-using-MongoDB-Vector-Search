import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import stories from './routes/story.mjs';
import { MongoClient} from "mongodb";
import OpenAI from "openai";


// Env Variables..

const OPENAI_API = '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';
const MONGODB_URI = 'mongodb+srv://shamsisalman81:salman@cluster0.f0kvwnv.mongodb.net/?retryWrites=true&w=majority';

//  server initialization...

const app  = express();
const port = process.env.PORT || 3000;

// OPEN AI initializiation...

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API || OPENAI_API
});

// mongodb initialization...

const client = new MongoClient(process.env.URI || MONGODB_URI);
  
 await client.connect().then(()=>{
    client.db('socialapp').command({ ping: 1 });
    console.log('connect database sucessfully !');
 }).catch(()=>{
    console.log('database do not connected try again !');
});

const DB_Collection = client.db('socialapp').collection('stories');

// set middleWares..

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd + "/public" )));

// REST APIs

app.use("/stories",stories);

app.listen(port,()=>{
    console.log("server started..");
});


// Exports....

export {openai, DB_Collection};