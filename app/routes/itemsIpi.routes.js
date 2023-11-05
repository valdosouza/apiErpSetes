const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     items_ipi:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
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
 *         class_frame:
 *           type: string
 *         producer_cnpj:
 *           type: string
 *         stamp_ctrl:
 *           type: string
 *         stamp_qtty:
 *           type: number
 *         class_frame_code:
 *           type: string
 *         base_value:
 *           type: number
 *         aliq_value:
 *           type: number
 *         unit_qtty:
 *           type: number
 *         unit_value:
 *           type: number 
 *  
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: OrderItemIpi
*   description: The OrderItemIpi managing API
*/


module.exports = router;