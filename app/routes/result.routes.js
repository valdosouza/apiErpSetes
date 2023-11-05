const { Router } = require("express");
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     result_message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         body:
 *           type: string
 *         message:
 *           type: string 
 *  
 */
 
 
/**
* @swagger
* tags:
*   name: Result of operation
*   description: The Result managing API
*/

module.exports = router;