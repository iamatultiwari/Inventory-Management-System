import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, sku, price, quantity, category } = req.body;

    if (!name || !sku || price === undefined || quantity === undefined || !category) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      return res.status(400).json({ message: 'SKU must be unique. Product already exists.' });
    }

    const product = new Product({ name, sku, price, quantity, category });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving products' });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ quantity: { $lt: 10 } }).sort({ createdAt: -1 });
    return res.status(200).json(lowStockProducts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching low-stock products' });
  }
};