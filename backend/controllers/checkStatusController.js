const axios = require("axios");
const BigPromise = require("../utils/BigPromise");
const CustomError = require("../utils/CustomError");

const checkStatus = BigPromise((req, res, next) => {
    if (!req.query) {
        return next(new CustomError("task_id not found", 400));
    }

    const setIntervalId = setInterval(() => {
        const options = {
            method: "GET",
            url: `https://api.conversiontools.io/v1/tasks/${req.query.taskId}`,
            headers: {
                Authorization: process.env.API_TOKEN,
                "Content-Type": "application/json",
            },
        };
        axios
            .request(options)
            .then((response) => {
                if (
                    response.data.status === "SUCCESS" ||
                    response.data.status === "ERROR"
                ) {
                    if (response.data.status === "SUCCESS") {
                        res.status(200).json({
                            file_id: response.data.file_id,
                            status: "SUCCESS",
                        });
                        clearInterval(setIntervalId);
                    } else {
                        return next(new CustomError("Conversion failed", 400));
                    }
                    clearInterval(setIntervalId);
                }
            })
            .catch((err) => {
                clearInterval(setIntervalId);
                return next(new CustomError("Conversion status failed", 400));
            });
    }, 5000);
});

module.exports = checkStatus;
