const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderItemIcms:
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
 *         origem:
 *           type: string
 *         determ_base:
 *           type: string
 *         determ_base_st:
 *           type: string
 *         discharge:
 *           type: integer
 *         aliq_rd_base:
 *           type: number
 *         base_value:
 *           type: number
 *         aliq:
 *           type: number
 *         aliq_rd:
 *           type: number
 *         value:
 *           type: number
 *         aliq_rd_base_st:
 *           type: number
 *         base_value_st:
 *           type: number
 *         aliq_st:
 *           type: number
 *         aliq_rd_st:
 *           type: number
 *         value_st:
 *           type: number
 *         mva:
 *           type: number
 *         withheld_base_value:
 *           type: number
 *         withheld_value:
 *           type: number
 *         withheld_base_value_st:
 *           type: number
 *         withheld_value_st:
 *           type: number
 *         sharing:
 *           type: string
 *         pass_through:
 *           type: string
 *         cred_calc_aliq:
 *           type: number
 *         cred_expl_value:
 *           type: number
 *         freight_value:
 *           type: number
 *         insurance_Value:
 *           type: number
 *         expenses_value:
 *           type: number
 *         tb_cfop_id:
 *           type: string
 *         approximate_tax:
 *           type: number
 *  
 * 
 */
 
 
/**
* @swagger
* tags:
*   name: OrderItemIcms
*   description: The OrderItemIcms managing API
*/


module.exports = router;