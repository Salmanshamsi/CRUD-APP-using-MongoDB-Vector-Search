import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import stories from './routes/story.mjs';
import { MongoClient,ServerApiVersion} from "mongodb";
import OpenAI from "openai";



//  server initialization...

const app  = express();
const port = process.env.PORT || 3000;

// OPEN AI initializiation...

const openAI_API = "";

const openai = new OpenAI({
    apiKey: openAI_API
});

// mongodb initialization...

const uri = "";

const client = new MongoClient(uri);
  
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