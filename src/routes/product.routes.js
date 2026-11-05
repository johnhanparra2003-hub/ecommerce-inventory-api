import { Router } from 'express';
import {
  createProduct,
  getProductById,
  listProducts
} from '../controllers/product.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.js';
import { USER_ROLES } from '../models/user.model.js';
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema
} from '../validations/product.validation.js';

const router = Router();

// Public catalog
router.get('/', validate(listProductsSchema), listProducts);
router.get('/:id', validate(productIdSchema), getProductById);

// Admin only
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(createProductSchema),
  createProduct
);

export default router;
