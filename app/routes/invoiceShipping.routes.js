const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     invoice_shipping:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         total_qtty:
 *           type: number
 *         sort_tag:
 *           type: string 
 *         brand_tag:
 *           type: string 
 *         gross_weight:
 *           type: string
 *         net_weight:
 *           type: string
 *         volume_number:
 *           type: string
 *         vehicle_plaque:
 *           type: string 
 *         state_plaque:
 *           type: string
 *         rntc_plaque:
 * 
 *  
 */
 
 
/**
* @swagger
* tags:
*   name: InvoiceShipping
*   description: The InvoiceShipping managing API
*/

module.exports = router;