const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderTotalizer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         items_qtde:
 *           type: integer
 *         product_qtde:
 *           type: number
 *         product_value:
 *           type: number
 *         ipi_value:
 *           type: number
 *         discount_aliquot:
 *           type: number
 *         discount_value:
 *           type: number
 *         expenses_value:
 *           type: number
 *         total_value:
 *           type: number
 *  
 */
 
 
/**
* @swagger
* tags:
*   name: OrderTotalizer
*   description: The OrderTotalizer managing API
*/

module.exports = router;