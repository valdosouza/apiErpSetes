const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderBilling:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_payment_types_id:
 *           type: integer 
 *         name_payment:
 *           type: string 
 *         task_owner:
 *           type: integer
 *         deadline:
 *           type: string
 *         plots:
 *           type: string
 *  
 */
 
 
/**
* @swagger
* tags:
*   name: Orderbilling
*   description: The OrderBilling managing API
*/

module.exports = router;