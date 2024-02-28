import mongoose from "mongoose";

const connectDb = () => {
  const mongodbUri = process.env.mongodb_uri;
  mongoose
    .connect(mongodbUri)
    .then(() => console.log("database connection successfull"))
    .catch((err) => console.log(err));
  mongoose.set("debug", true);
};

export {connectDb}