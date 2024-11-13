// require("dotenv").config();
// const express = require("express");
// const app = require("./app");
// const cloudinary = require("cloudinary");
// const cors = require("cors");
// const PORT = process.env.PORT || 8000;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// app.use(cors({ origin: 'https://pdftowordpizeonfly.vercel.app',methods: ['GET', 'POST'],
//     credentials: true }));
// app.get('/', (req, res)=>{
//     res.send("Welcome to PDF to Word Converter API!");
// });
// app.listen(PORT, () => {
//     console.log("Server started successfully at Port: " + PORT);
// });

// require("dotenv").config();
// const express = require("express");
// const fileUpload = require("express-fileupload");
// const cors = require("cors");
// const cloudinary = require("cloudinary");

// // Initialize the express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// app.use(cors({
//     origin: 'https://pdftowordpizeonfly.vercel.app', // Set this to your frontend URL
//     methods: ['GET', 'POST'],
//     credentials: true,
// }));


// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Express middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // File upload middleware
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
// }));

// // Import and use routes
// const handleFileRoute = require("./routes/handleFileRoute");
// app.use("/api", handleFileRoute);

// // Root route
// app.get('/', (req, res) => {
//     res.send("Welcome to PDF to Word Converter API!");
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log("Server started successfully at Port: " + PORT);
// });



// Package imports
require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 8000;

// Error handling classes and middleware
class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

const BigPromise = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};

// CORS configuration
app.use(cors());
// app.use(cors({
//     origin: 'https://pdftowordpizeonfly.vercel.app', // Set this to your frontend URL
//     methods: ['GET', 'POST'],
//     credentials: true,
// }));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

// Controller functions
const uploadFile = BigPromise(async (req, res, next) => {
    if (!req.files) return next(new CustomError("Please provide a file", 400));

    const form = fs.createReadStream(`${req.files.file.tempFilePath}`);
    const data = new FormData();
    data.append("file", form);

    const options = {
        method: "POST",
        url: "https://api.conversiontools.io/v1/files",
        headers: {
            Authorization: process.env.API_TOKEN,
            "Content-Type": "multipart/form-data",
        },
        data: data,
    };

    axios.request(options)
        .then(response => {
            res.status(200).json({ success: true, file_id: response.data.file_id });
        })
        .catch(err => next(new CustomError("File upload failed", 400)));
});

const convertFile = BigPromise((req, res, next) => {
    if (!req.query) return next(new CustomError("No fileId found in query", 400));

    const options = {
        method: "POST",
        url: "https://api.conversiontools.io/v1/tasks",
        headers: {
            Authorization: process.env.API_TOKEN,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({ type: "convert.pdf_to_word", file_id: req.query.fileId }),
    };

    axios.request(options)
        .then(response => res.status(200).json({ success: true, task_id: response.data.task_id }))
        .catch(() => next(new CustomError("Conversion failed", 400)));
});

const checkStatus = BigPromise((req, res, next) => {
    if (!req.query) return next(new CustomError("task_id not found", 400));

    const setIntervalId = setInterval(() => {
        const options = {
            method: "GET",
            url: `https://api.conversiontools.io/v1/tasks/${req.query.taskId}`,
            headers: { Authorization: process.env.API_TOKEN, "Content-Type": "application/json" },
        };

        axios.request(options)
            .then(response => {
                if (response.data.status === "SUCCESS" || response.data.status === "ERROR") {
                    if (response.data.status === "SUCCESS") {
                        res.status(200).json({ file_id: response.data.file_id, status: "SUCCESS" });
                    } else {
                        next(new CustomError("Conversion failed", 400));
                    }
                    clearInterval(setIntervalId);
                }
            })
            .catch(() => {
                clearInterval(setIntervalId);
                next(new CustomError("Conversion status failed", 400));
            });
    }, 5000);
});

const downloadFile = BigPromise((req, res, next) => {
    if (!req.query) return next(new CustomError("no fileId found in url", 400));

    const options = {
        method: "get",
        url: `https://api.conversiontools.io/v1/files/${req.query.fileId}`,
        headers: { Authorization: process.env.API_TOKEN },
        responseType: "stream",
    };

    axios.request(options)
        .then(response => {
            const fileName = response.headers["content-disposition"]
                .split(";")
                .find(n => n.includes("filename="))
                .replace("filename=", "")
                .trim().split('"')[1];

            response.data.pipe(fs.createWriteStream(`/tmp/${fileName}`));
            res.status(200).json({ fileName });
        })
        .catch(() => next(new CustomError("Download file failed", 400)));
});

const cloudinaryUploader = BigPromise(async (req, res, next) => {
    if (!req.query) return next(new CustomError("no fileName found in url", 400));

    const result = await cloudinary.uploader.upload(`/tmp/${req.query.fileName}`, {
        folder: "docs",
        resource_type: "raw",
    });

    res.status(200).json({ success: true, file_url: result.secure_url });
});

// Routes setup
app.post("/api/file/upload", uploadFile);
app.post("/api/file/convert", convertFile);
app.get("/api/file/status", checkStatus);
app.get("/api/file/download", downloadFile);
app.get("/api/file/cloud/upload", cloudinaryUploader);

// Root route
app.get('/', (req, res) => {
    res.send("Welcome to PDF to Word Converter API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.code || 500).json({ message: err.message || "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
    console.log("Server started successfully at Port: " + PORT);
});

