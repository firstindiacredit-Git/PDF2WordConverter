require("dotenv").config();
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");

// all route imports
const handleFileRoute = require("./routes/handleFileRoute");

//express middlewares
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors({ origin: 'https://pdftowordpizeonfly.vercel.app',methods: ['GET', 'POST'],
//    credentials: true }));


//cors and fileupload middleware
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

//route middlewares
app.use("/api", handleFileRoute);

module.exports = app;
