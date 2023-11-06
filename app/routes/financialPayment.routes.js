const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     financial_payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         tb_order_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         parcel:
 *           type: integer
 *         interest_value:
 *           type: number
 *         late_value:
 *           type: number
 *         discount_aliquot:
 *           type: number
 *         paid_value:
 *           type: number
 *         dt_payment:
 *           type: string
 *         dt_real_payment:
 *           type: string
 *         settled:
 *           type: string
 *         tb_financial_plans_id:
 *           type: integer
 *         settled_code:
 *           type: integer
 *         tb_payment_types_id:
 *           type: integer
 * 
 */ 

/**
 * @swagger
 * tags:
 *   name: Financial Payment
 *   description: The Financial Payment managing API
 */
module.exports = router;