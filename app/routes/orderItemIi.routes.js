const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderItemIi:
 *       type: object
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         tb_order_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_order_item_id:
 *           type: integer
 *         base_value:
 *           type: number
 *         customs_expense:
 *           type: number
 *         tag_value:
 *           type: number
 *         iof_value:
 *           type: number
 *  
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: OrderItemIi
*   description: The OrderItemIi managing API
*/


module.exports = router;