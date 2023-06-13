const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const https = require("https");

// starting express
const app = express();
// using boby -parser with express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/83583a67e2";

    const options = {
        method: "POST",
        auth: "Edouard:8fca58c7c34cc8d0546c732a7de76ea4-us21",
    };
    const mailChimpRequest = https.request(url, options, function (response) {
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else
            res.sendFile(__dirname + "/failure.html");
        
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    mailchimpRequest.write(jsonData);
    mailchimpRequest.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.Port || 3000, function () {
    console.log("The server is running at port 3000");
});