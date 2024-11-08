require("dotenv").config();
const express = require("express");
const app = require("./app");
const cloudinary = require("cloudinary");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.get('/', (req, res)=>{
    res.send("Welcome to PDF to Word Converter API!");
});
app.listen(PORT, () => {
    console.log("Server started successfully at Port: " + PORT);
});
