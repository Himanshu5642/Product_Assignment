import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDb } from "./modules/db/mongoose.js";
import { router } from "./routes.js";
import { checkError } from "./modules/helpers/checkError.helper.js";

const port = 4000;

dotenv.config();
connectDb();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("welcome user"));

// Error handling
app.use(function (err, req, res, next) {
  if (err) return res.status(401).send(checkError(err));
  next();
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
