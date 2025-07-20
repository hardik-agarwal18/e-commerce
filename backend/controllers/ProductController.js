import Product from "../models/ProductModel.js";

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

export const deleteProduct = async (req, res) => {
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
