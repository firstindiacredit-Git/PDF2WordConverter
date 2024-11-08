const express = require("express");
const Router = express.Router();

// Controller imports
const uploadFile = require("../controllers/uploadFileController");
const convertFile = require("../controllers/convertFileController");
const checkStatus = require("../controllers/checkStatusController");
const downloadFile = require("../controllers/downloadFIleController");
const cloudinaryUploader = require("../controllers/cloudinaryUploader");

// Middleware to set CORS headers for all routes in this router
Router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://pdftowordpizeonfly.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// Define routes
Router.route("/file/upload").post(uploadFile);
Router.route("/file/convert").post(convertFile);
Router.route("/file/status").get(checkStatus);
Router.route("/file/download").get(downloadFile);
Router.route("/file/cloud/upload").get(cloudinaryUploader);

module.exports = Router;
