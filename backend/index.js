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

require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary");

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: 'https://pdftowordpizeonfly.vercel.app', // Set this to your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
}));


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

// Import and use routes
const handleFileRoute = require("./routes/handleFileRoute");
app.use("/api", handleFileRoute);

// Root route
app.get('/', (req, res) => {
    res.send("Welcome to PDF to Word Converter API!");
});

// Start the server
app.listen(PORT, () => {
    console.log("Server started successfully at Port: " + PORT);
});
