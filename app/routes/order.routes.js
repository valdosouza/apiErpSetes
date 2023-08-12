const { Router } = require("express");
  
const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         tb_user_id:
 *           type: integer
 *         doc_user:
 *           type: string
 *         dt_record:
 *           type: string
 *         note:
 *           type: string
 *         origin:
 *           type: string
 *         status:
 *           type: string
 *         being_used:
 *           type: string
 *  
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: Order
  *   description: The Order managing API
  */



module.exports = router;