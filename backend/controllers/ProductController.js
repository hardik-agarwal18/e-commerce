import Product from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const addProduct = async (req, res) => {
  const { name, image, category, new_price, old_price } = req.body;

  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    id = last_product_array[0].id + 1; // last product's id
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: name,
    image: image,
    category: category,
    new_price: new_price,
    old_price: old_price,
  });
  console.log(product);

  await product.save();
  console.log("Saved");

  res.json({
    success: true,
    message: "Product Added",
  });
};

export const deleteProduct = async (r, q, res) => {
  const { id } = req.body;
  const product = await Product.findOneAndDelete({ id });
  console.log("Removed the Product");
  res.json({
    success: true,
    message: "Removed the Product",
    name: product.name,
  });
};
export const getAllProducts = async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
};

export const newCollection = async (req, res) => {
  let products = await Product.find({});

  let newcollection = products.slice(1).slice(-8);
  if (newcollection) {
    return res.status(200).json({ newcollection });
  }
};

export const popularInWomen = async (req, res) => {
  const products = await Product.find({ category: "women" });
  let popularinwomen = products.slice(1).slice(-4);
  if (popularinwomen) {
    return res.status(200).json({ popularinwomen });
  }
};

export const addToCart = async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  const user = await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  await user.save();
  return res.status(203).json({ message: "Added items in the cart" });
};

export const removeFromCart = async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  const user = await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  await user.save();
  return res.status(203).json({ message: "Removed items from the cart" });
};

export const getCart = async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
};
