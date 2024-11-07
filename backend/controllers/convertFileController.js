const axios = require("axios");
const BigPromise = require("../utils/BigPromise");
const CustomError = require("../utils/CustomError");

const convertFile = BigPromise((req, res, next) => {
    if (!req.query) {
        return next(new CustomError("No fileId found in query", 400));
    }

    const options = {
        method: "POST",
        url: "https://api.conversiontools.io/v1/tasks",
        headers: {
            Authorization: process.env.API_TOKEN,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({ type: "convert.pdf_to_word", file_id: req.query.fileId }),
    };

    axios
        .request(options)
        .then((response) => {
            res.status(200).json({
                success: true,
                task_id: response.data.task_id,
            });
        })
        .catch((err) => {
            return next(new CustomError("Conversion failed", 400));
        });
});

module.exports = convertFile;
