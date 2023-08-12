const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderItemCofins:
 *       type: object
 *       properties:
 *         tb_order_id:
 *           type: integer
 *         tb_order_item_id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         cst:
 *           type: string
 *         base_value:
 *           type: number
 *         aliq_value:
 *           type: number
 *         tag_value:
 *           type: number
 *         qt_sale_qtty:
 *           type: number
 *         qt_aliq_value:
 *           type: number
 *  
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: OrderItemCofins
*   description: The OrderItemCofins managing API
*/
module.exports = router;