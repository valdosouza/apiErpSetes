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
 *     orderAction:
 *       type: object
 *       required:
 *         - tb_institution_id
 *         - tb_order_id 
 *         - tb_user_id
 *         - dt_record
 *       properties:
 *         tb_institution_id:
 *           type: integer
 *         id:
 *           type: integer
 *         tb_user_id:
 *           type: integer 
 *         dt_record:
 *           type: string
 *  
 *     orderResulAction:
 *       type: object
 *       properties:
 *         result:
 *           type: boolean
 *         message:
 *           type : string
 * 
 *     orderParams:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         tb_user_id:
 *           type: integer 
 *         number:
 *           type: integer
 *         nick_trade:
 *           type: string  
 */
 
 
 /**
  * @swagger
  * tags:
  *   name: Order
  *   description: The Order managing API
  */



module.exports = router;