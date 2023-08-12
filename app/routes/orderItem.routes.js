const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderItems:
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
 *         kind:
 *           type: string
 *         tb_product_id:
 *           type: integer
 *         tb_stock_list_id:
 *           type: integer
 *         quantity:
 *           type: number
 *         unit_value:
 *           type: number
 *         discount_aliquot:
 *           type: number 
 *         discount_value:
 *           type: number
 *         tb_price_list_id:
 *           type: integer
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: OrderItem
*   description: The OrderItem managing API
*/


module.exports = router;