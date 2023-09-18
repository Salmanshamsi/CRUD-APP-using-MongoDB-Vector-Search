import {DB_Collection ,openai} from "../server.mjs";
import { ObjectId } from "mongodb";



const setData = async (req, res) => {
  const doc = {
    title: req?.body?.title,
    content: req?.body?.content,
  };

  try {

    if(doc.title && doc.content){

      const result = await DB_Collection.insertOne(doc);
      
          if(res){
            res.send("Data SucessFully Added");
          }else{
            res.send("Data not Added try later");
          }
      
    }else{

    }
  } catch (e) {
    console.log('Error on inserting data: ', e);
    res.status(500).send('Failed to insert data. Please try later.');
  }
};

const getData = async (req, res) => {
  try {
    
    const cursor = DB_Collection
    .find({})
    .sort({ _id: -1 })
    .project({ stories_embedding: 0 })

    const allStories = await cursor.toArray();
    res.status(200).send(allStories);

  } catch (error) {
    res.status(500).send('Failed to get stories. Please try later.',error);
  }
};

const getSingle = async (req,res) =>{

    const queryText = req.query.q;

    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: queryText,
    });

    const vector = response?.data[0]?.embedding
    console.log("vector: ", vector);
  
    try{

        const documents = await DB_Collection.aggregate([
            {
              "$search": {
                "index": "storiesIndex",
                "knnBeta": {
                  "vector": vector,
                  "path": "stories_embedding",
                  "k": 2147483647
                },
                "scoreDetails": true
              }
            },
            {
              "$project": {
                "stories_embedding": 0,
                "score": { "$meta": "searchScore" },
                "scoreDetails": { "$meta": "searchScoreDetails" }
              },
            }
          ]).toArray();
        
          console.log(documents);
          
          res.send(documents)

    }catch(e){
        console.log("Error on searching ",e);
    }
    


}


const putData = async (req, res) => {
  
    if (!ObjectId.isValid(req.params.id)) {
    res.status(403).send({ message: 'Incorrect product id' });
    return;
  }

  let doc = {
    title: req?.body?.title,
    content: req?.body?.content,
  };

  try {
        if (doc.title && doc.content) {
      
         const updateResponse = await DB_Collection
         .updateOne(
           { _id: new ObjectId(req.params.id) },
           { $set: doc }
         );
  
        console.log("Product updated: ", updateResponse);
  
        res.send({
          message: "story updated successfully"
        });

    } else {
      res.send('Do not update with empty data');
    }
  } catch (error) {
    console.log('Error', error);
    res.status(500).send('Failed to update story. Please try later.');
  }
};

const delData = async (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(403).send({ message: "incorrect product id" });
        return;
      }
    
    try {
        const deleteResponse = await DB_Collection
        .deleteOne({ _id: new ObjectId(req.params.id) });
        console.log("Product deleted: ", deleteResponse);
    
        res.send({
          message: "story deleted successfully"
        });
    
      } catch (error) {
        console.log("error", error);
        res.status(500).send({ message: "failed to delete story, please try later" });
      }

};

export { getData,setData, putData, delData,getSingle};
