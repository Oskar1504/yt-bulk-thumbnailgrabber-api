const express = require('express');
const router = express.Router();
const axios = require("axios");
const nodemailer = require('nodemailer');
const JSZip  = require("jszip");
const fs  = require("fs");
const config = require("../../config.json")

let mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email,
        pass: config.password
    }
});

router.post('/getImages',async (req, res, next) => {
    try{
        // i could add the images at this point to the zip but i wanted to make it variable if u want to receive an zip
        let rescontent = req.body
        rescontent["imageLinks"] = []
        rescontent.youtubeLinks.forEach( link => {
            rescontent.imageLinks.push(`https://i.ytimg.com/vi/${link.split("=")[1].split("?")[0]}/maxresdefault.jpg`)
        })

        if(req.body.email){
            let zip = new JSZip();
            zip.file("README.txt", fs.readFileSync("email_readme.txt"));

            let img = zip.folder("images")
            for (const link of rescontent.imageLinks) {
                // converts image url to base64 string => https://stackoverflow.com/a/52648030/14077167
                let image = await axios.get(link, {responseType: 'arraybuffer'});
                img.file(link.split("/").reverse()[1] + ".png",  image.data, {base64: true});
            }

            let mailOptions = {
                from: config.email,
                to: req.body.email,
                subject: 'Node.js bulk thumbnailgrabber ',
                text: 'Bulk youtube thumbnail grabber' ,
                attachments: [{
                    filename: 'out.zip',
                    content: zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
                }]
            }

            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    rescontent["info"] = "Email containing images was sent to "+req.body.email
                    res.json(rescontent)
                }
            });
        }else{
            rescontent["info"] = "Add an email tag with your email to the post body to receive an zip containing all thumbnails"
            res.json(rescontent)
        }


    }catch(e){
        res.sendStatus(500)
    }
});

module.exports = router;
