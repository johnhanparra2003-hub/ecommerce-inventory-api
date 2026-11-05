import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const createProductSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(120).required(),
    description: Joi.string().trim().max(2000).allow('').default(''),
    sku: Joi.string().trim().alphanum().min(3).max(30).required(),
    price: Joi.number().min(0).precision(2).required(),
    stock: Joi.number().integer().min(0).default(0),
    category: Joi.string().trim().min(2).max(50).required()
  })
};

export const productIdSchema = {
  params: Joi.object({ id: objectId.required() })
};

export const listProductsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    category: Joi.string().trim(),
    search: Joi.string().trim().max(100),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    sortBy: Joi.string().valid('createdAt', 'price', 'name', 'stock').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};
