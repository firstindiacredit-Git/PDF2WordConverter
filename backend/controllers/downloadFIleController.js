const axios = require("axios");
const BigPromise = require("../utils/BigPromise");
const CustomError = require("../utils/CustomError");
const fs = require("fs");

const downloadFile = BigPromise((req, res, next) => {
    if (!req.query) {
        return next(new CustomError("no fileId found in url", 400));
    }

    const options = {
        method: "get",
        url: `https://api.conversiontools.io/v1/files/${req.query.fileId}`,
        headers: {
            Authorization: process.env.API_TOKEN,
        },
        responseType: "stream",
    };

    // task - to download the file
    axios
        .request(options)
        .then((response) => {
            const responseHeader = { ...response.headers };
            let fileName = responseHeader["content-disposition"]
                .split(";")
                .find((n) => n.includes("filename="))
                .replace("filename=", "")
                .trim();

            fileName = fileName.split('"')[1];
            response.data.pipe(fs.createWriteStream(`/tmp/` + fileName));
            res.status(200).json({
                fileName: fileName,
            });
        })
        .catch((err) => {
            return next(new CustomError("Download file failed", 400));
        });
});

module.exports = downloadFile;
