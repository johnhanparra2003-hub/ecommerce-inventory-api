import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id);
  res.status(201).json({ success: true, data: { product } });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: { product } });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { items, pagination } = await productService.listProducts(req.query);
  res.status(200).json({ success: true, data: { products: items }, pagination });
});
