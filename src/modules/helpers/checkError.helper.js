import mongoose from "mongoose";

export function checkError(err) {
  let errorMsg, msg;
  console.log(err);
  if (err instanceof mongoose.Error) {
    return {
      errorType: "Bad credentials",
      message: err.message,
    };
  }

  // MongoServerError
  if (err.name == "MongoServerError") {
    if (err.code == 11000) {
      const keyArr = Object.keys(err.keyPattern)[0].split(".");

      return {
        errorType: "duplicate credientials",

        message: `${keyArr[keyArr.length - 1]} must be unique`,
      };
    }
    return {
      errorType: "Duplicate credientials",
      message: err.message,
    };
  }

  if (typeof err != "object") {
    msg = err;
  }
  errorMsg = {
    error: err || msg,
    body: msg || "Server Error",
  };

  return errorMsg;
}
