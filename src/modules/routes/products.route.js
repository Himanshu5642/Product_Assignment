import { Router } from "express";
import { User } from "../models/user.model.js";
import { Authentication } from "../middlewares/jwtAuth.middleware.js";
import { wrapAsync } from "../helpers/route.helper.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    addProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct,
    searchProducts,
    filterProducts
} from "../controller/products.controller.js";

const ProductRouter = Router();

ProductRouter.post("/product/add", Authentication(User), upload.fields([{ name: "image"}]), wrapAsync(addProduct));
ProductRouter.get("/products", Authentication(User), wrapAsync(getAllProducts));
ProductRouter.put("/products/:id", Authentication(User), wrapAsync(updateProduct));
ProductRouter.delete("/products/:id", Authentication(User), wrapAsync(deleteProduct));

ProductRouter.get("/products/search", Authentication(User), wrapAsync(searchProducts));
ProductRouter.post("/products/filter", Authentication(User), wrapAsync(filterProducts));

export { ProductRouter };
