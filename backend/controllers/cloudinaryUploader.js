const BigPromise = require("../utils/BigPromise");
const CustomError = require("../utils/CustomError");
const cloudinary = require("cloudinary").v2;

const cloudinaryUploader = BigPromise(async (req, res, next) => {
    if (!req.query) {
        return next(new CustomError("no fileName found in url", 400));
    }
    let fileName = req.query.fileName;
    const result = await cloudinary.uploader.upload(`/tmp/${fileName}`, {
        folder: "docs",
        resource_type: "raw",
    });

    res.status(200).json({
        success: true,
        file_url: result.secure_url,
    });
});

module.exports = cloudinaryUploader;
