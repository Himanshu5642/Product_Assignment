import { Product } from "../models/products.model.js";
import { createClient } from "redis";
import { addToEmailQueue } from "../utils/sendMail.util.js";
import { User } from "../models/user.model.js";

const redisClient = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const addProduct = async (req) => {
  let image = req.files.image[0].filename;

  const product = await Product.create({
    ...req.body,
    image,
  });

  const users = await User.find().lean();
  let usersEmails = users.map((user) => user.email);

  const emailDataArray = usersEmails.map((email) => {
    return {
      from: "Enter Email",
      to: email,
      subject: "New Product Created!",
      text: `We have launched a new product: ${product.name}. Check it out!`,
    };
  });
  addToEmailQueue(emailDataArray);

  return product;
};

const getAllProducts = async (req) => {
  let { page = 1 } = req.query;
  let limit = 5;
  let skip = +page > 0 ? limit * (+page - 1) : 0;
  console.log("page", page);

  const redisProductKey = `products_page_${page}_limit_${limit}`;

  const savedProducts = await redisClient.get(redisProductKey);
  if (savedProducts) return JSON.parse(savedProducts);

  const products = await Product.find()
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (products.length === 0) throw "No Products";

  redisClient.setEx(redisProductKey, 3600, JSON.stringify(products));

  return products;
};

const updateProduct = async (req) => {
  const { id: productId } = req.params;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: req.body },
    { new: true }
  );
  return updatedProduct;
};

const deleteProduct = async (req) => {
  let { id: productId } = req.params;
  await Product.findByIdAndDelete(productId);
  return { msg: "Done" };
};

const searchProducts = async (req) => {
  const { keyword, page = 1 } = req.query;
  let limit = 5;
  let skip = +page > 0 ? limit * (+page - 1) : 0;

  let searchedProduct = await Product.find({
    name: { $regex: keyword, $options: "i" },
  })
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!searchedProduct) throw "No Product Found";
  return searchedProduct;
};

const filterProducts = async (req) => {
  const { filters } = req.body;
  let { page = 1 } = req.query;
  let limit = 5;
  let skip = +page > 0 ? limit * (+page - 1) : 0;

  const products = await Product.find(filters)
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return products;
};

export {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProducts,
};
