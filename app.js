const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config() //to use the variables from env via process.env



app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const https = require("https");

    const data ={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/db4fa46136";

    const options = {
        method: "POST",
        auth: "bhavesh:" + process.env.key
        
    }
    

    const request = https.request(url, options, function (response) {
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", (req,res) => {
    res.redirect("/");
})

app.listen( 3000, function (){
    console.log("Server is running on port 3000 and do test");
    console.log(process.env.key)
});

