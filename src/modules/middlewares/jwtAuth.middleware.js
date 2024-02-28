import jwt from "jsonwebtoken";
import { checkError } from "../helpers/checkError.helper.js";

// User Authentication By Token
const Authentication = (model) => async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.send(checkError("Authentication Error"));
    // console.log("token", token);
    const decodedString = jwt.verify(token, process.env.secretToken);
    // console.log("decodedString", decodedString);
    const user = await model.findOne({
      _id: decodedString._id,
      deletedAccount: false,
    });
    if (!user) return res.send(checkError("Authentication Error"));
    console.log("user", user._id);
    req.user = user;

    next();
  } catch (error) {
    res.send(checkError(error));
  }
};

export { Authentication };
