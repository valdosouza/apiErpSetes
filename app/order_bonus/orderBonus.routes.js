const { Router } = require("express");
  
const orderbonus =  require("../order_bonus/orderBonus.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     orderBonus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         terminal:
 *           type: integer
 *         number:
 *           type: integer
 *         tb_entity_id:
 *           type: integer
 *         name_entity:
 *           type: string
 *         doc_entity:
 *           type: string 
 *         tb_stock_list_id:
 *           type: integer 
 *         name_stock_list:
 *           type: string
 *         direction:
 *           type: string
 * 
 * 
 *     objOrderBonus:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/order'
 *         bonus:
 *           $ref: '#/components/schemas/orderBonus'
 *         totalizer:
 *           $ref: '#/components/schemas/orderTotalizer'
 *         items:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/orderItems'
 *  
 */
 
 
 
/**
* @swagger
* tags:
*   name: OrderBonus
*   description: The OrderBonus managing API
*/

 /**
 * @swagger
 * /orderbonus/sync:
 *   post:
 *     summary: Sync a OrderBonus
 *     tags: [OrderBonus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderBonus'
 *     responses:
 *       200:
 *         description: The objOrderBonus was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderBonus'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", orderbonus.sync);

/**
 * @swagger
 * /orderbonus:
 *   post:
 *     summary: Create a new OrderBonus
 *     tags: [OrderBonus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objOrderBonus'
 *     responses:
 *       200:
 *         description: The OrderBonus was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderBonus'
 *       500:
 *         description: Some server error
 */
  //router.post("/", orderbonus.create);
  protectedRouter.post("/", orderbonus.create);

 /**
 * @swagger
 * /orderbonus/getlist/:
 *   post:
 *     summary: Returns the list of all the OrderBonus
 *     tags: [OrderBonus]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderParams'
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/orderBonus'
 */
  protectedRouter.post("/getlist/", orderbonus.getList); 

/**
 * @swagger
 * /orderbonus/get/{tb_institution_id}/{tb_user_id}/{tb_order_id}:
 *   get:
 *     summary: Returns the OrderBonus
 *     tags: [OrderBonus]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: tb_user_id
 *      - in: path
 *        name: tb_order_id
 *     responses:
 *       200:
 *         description: The OrderBonus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objOrderBonus'
 */
  router.get("/get/:tb_institution_id/:tb_user_id/:tb_order_id", orderbonus.get);
  
 /**
 * @swagger
 * /orderbonus:
 *  put:
 *    summary: Update the OrderBonus by the id
 *    tags: [OrderBonus]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objOrderBonus'
 *    responses:
 *      200:
 *        description: The OrderBonus was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/objOrderBonus'
 *      404:
 *        description: The orderbonus was not found
 *      500:
 *        description: Some error happened
 */
  //router.put("/", orderbonus.update);
  protectedRouter.put("/", orderbonus.update);

/**
 * @swagger
 * /orderbonus/{tb_institution_id}/{id}:
 *  delete:
 *    summary: Delete the orderbonus by the id
 *    tags: [OrderBonus]
 *    parameters:
 *      - in: path
 *        name: tb_institution_id
 *      - in: path
 *        name: id 
 *        schema:
 *          type: string
 *        required: true
 *        description: The orderbonus id
 *    responses:
 *      200:
 *        description: The OrderBonus was deleted
 *      404:
 *        description: The orderbonus was not found
 *      500:
 *        description: Some error happened
 */
  //router.delete("/:tb_institution_id/:id", orderbonus.delete);
  protectedRouter.delete("/:tb_institution_id/:id", orderbonus.delete);

/**
 * @swagger
 * /orderbonus/closure:
 *   post:
 *     summary: Close status Order Bonus
 *     tags: [OrderBonus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderAction'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orderResulAction'
 *       201:
 *         description: The OrderBonus is already closed
 *       404:
 *         description: The Order Transfer was notTransfer
 *       500:
 *         description: Some error happened
 */
  
  protectedRouter.post("/closure/", orderbonus.closure);
 /**
  * @swagger
  * /orderbonus/reopen:
  *   post:
  *     summary: Reopen Status Order Bonus
  *     tags: [OrderBonus]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/orderAction'
  *     responses:
  *       200:
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/orderResulAction'
  *       201:
  *         description: The OrderBonus is already open
  *       404:
  *         description: The Order Transfer was notTransfer
  *       500:
  *         description: Some error happened
  */
  //router.post("/reopen/", orderbonus.reopen);     
  protectedRouter.post("/reopen/", orderbonus.reopen);     
  
module.exports = router;