const express=require('express');
const router=express.Router();

router.get('/course',(req,res)=>{
    res.send("Course Info will appear here");
})

module.exports = router;