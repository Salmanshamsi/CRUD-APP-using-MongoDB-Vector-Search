import express from 'express';
import { getData,setData,putData,delData,getSingle } from '../controller/story.mjs';


const router = express.Router()

router.get("/",(reqs,resp)=>{
        getData(reqs,resp);
})
router.get("/search",(reqs,resp)=>{
        getSingle(reqs,resp);
})
router.post("/",(reqs,resp)=>{
        setData(reqs,resp);
})
router.delete("/:id",(reqs,resp)=>{
        delData(reqs,resp);      
})
router.put("/:id",(reqs,resp)=>{
        putData(reqs,resp);
})

export default router;