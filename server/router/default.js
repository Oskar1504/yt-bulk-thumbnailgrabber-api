const express = require('express');
const router = express.Router();

router.get('/',async (req, res, next) => {
    try{
        res.send("Up and running")
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});

module.exports = router;
