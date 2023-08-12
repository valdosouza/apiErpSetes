const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderItemIssqn:
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
 *         base_value:
 *           type: number
 *         aliq_value:
 *           type: number
 *         tag_value:
 *           type: number
 *         listservice:
 *           type: string
 *         tax_code:
 *           type: string
 *  
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: OrderItemIssqn
*   description: The OrderItemIssqn managing API
*/


module.exports = router;