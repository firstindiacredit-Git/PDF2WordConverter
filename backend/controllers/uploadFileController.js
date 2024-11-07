//package imports
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

// file imports
const CustomError = require("../utils/CustomError");
const BigPromise = require("../utils/BigPromise");

const uploadFile = BigPromise(async (req, res, next) => {
    if (!req.files) {
        return next(new CustomError("Please provide a file", 400));
    }

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
    axios
        .request(options)
        .then(function (response) {
            res.status(200).json({
                success: true,
                file_id: response.data.file_id,
            });
        })
        .catch(function (error) {
            return next(new CustomError(err, 400));
        });
});

module.exports = uploadFile;
