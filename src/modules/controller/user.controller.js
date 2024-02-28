import { User } from "../models/user.model.js";
import { generateAuthToken } from "../utils/generateToken.util.js";
import CryptoJS from "crypto-js";

const registerUser = async (req) => {
  const { userName, password, cpassword, email } = req.body;

  const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existingUser) throw "User Already Exists";

  if (password !== cpassword) throw "Passwords fields does not match";
  delete req.body.cpassword;

  let encryptedText = CryptoJS.AES.encrypt(
    password,
    process.env.secretKey
  ).toString();
  req.body.password = encryptedText;
  req.body.role = "User";

  let userCreated = await User.create(req.body);
  let token = await generateAuthToken(userCreated);

  const user = await User.findOneAndUpdate(
    { userName },
    { $set: { token } },
    { new: true }
  );
  return user;
};

const login = async (req) => {
  const { userName, password } = req.body;
  let foundUser = await User.findOne({ userName, deletedAccount: false });
  if (!foundUser) throw "User Not Found";

  let encryptedText = CryptoJS.AES.decrypt(
    foundUser.password,
    process.env.secretKey
  ).toString(CryptoJS.enc.Utf8);
  console.log("password", encryptedText);

  if (encryptedText !== password) throw "Entered Password is Incorrect";

  let token = await generateAuthToken(foundUser);

  const user = await User.findOneAndUpdate(
    { userName },
    { $set: { token } },
    { new: true }
  );
  return user;
};

const logout = async (req) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No Token Provided" });
    return;
  }
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { token: "" } },
    { new: true }
  );

  return { message: "Logout successful" };
};

export { registerUser, login, logout };
