import jwt from "jsonwebtoken";

// For generating jwt auth token
export const generateAuthToken = (user) => {
  return new Promise((resolve, reject) => {
    let token = jwt.sign(
      { _id: user._id.toString() },
      process.env.secretToken,
      { expiresIn: 60 * 60 * 60 }
    );
    if (!token) reject("Error Generating Token");
    resolve(token);
  });
};
