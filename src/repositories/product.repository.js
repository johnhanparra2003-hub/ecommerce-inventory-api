import { Product } from '../models/product.model.js';

const create = (productData) => Product.create(productData);

const findById = (id) => Product.findById(id);

const findBySku = (sku) => Product.findOne({ sku: sku.toUpperCase() });

const findAll = async ({ filter, sort, skip, limit }) => {
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ]);
  return { items, total };
};

export const productRepository = { create, findById, findBySku, findAll };
