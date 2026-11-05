import { productRepository } from '../repositories/product.repository.js';
import { AppError } from '../utils/AppError.js';

const createProduct = async (productData, userId) => {
  const existingProduct = await productRepository.findBySku(productData.sku);
  if (existingProduct) {
    throw new AppError(`A product with SKU "${existingProduct.sku}" already exists`, 409);
  }
  return productRepository.create({ ...productData, createdBy: userId });
};

const getProductById = async (productId) => {
  const product = await productRepository.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

const listProducts = async ({ page, limit, category, search, minPrice, maxPrice, sortBy, order }) => {
  const filter = { isActive: true };

  if (category) filter.category = category.toLowerCase();
  if (search) filter.$text = { $search: search };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const { items, total } = await productRepository.findAll({ filter, sort, skip, limit });

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

export const productService = { createProduct, getProductById, listProducts };
