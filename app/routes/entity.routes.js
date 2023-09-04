const { Router } = require("express");
  
const entity =  require("../endpoint/entity.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     entity:
 *       type: object
 *       required:
 *         - id
 *         - name_company
 *         - nick_trade
 *       properties:
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         aniversary:
 *           type: string
 *         tb_line_buiness_id:
 *           type: integer
 *         name_linebusiness:
 *           type: string 
 *         note:
 *           type: string
 * 
 * 
 *     objEntity:
 *       type: object
 *       properties:
 *         description:
 *           type: string 
 *         tb_institution_id:
 *           type: integer 
 *         webId:
 *           type: integer 
 *         terminal:
 *           type: integer
 *         page:
 *           type: integer
 *         date_change:
 *           type: string
 *         cnpj_institution:
 *           type: string
 *         entity:
 *           $ref: '#/components/schemas/entity' 
 *         addressList:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/address' 
 *         phoneList:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/phone'  
 * 
 *     ListEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name_company:
 *           type: string
 *         nick_trade:
 *           type: string
 *         doc_type:
 *           type: string
 *         doc_number:
 *           type: string
 *  
 *     entityParams:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         tb_institution_id:
 *           type: integer 
 *         id:
 *           type: integer
 *         name_entity:
 *           type: string  
 */


 /**
  * @swagger
  * tags:
  *   name: Entity
  *   description: The Entity managing API
  */

/**
 * @swagger
 * /Entity:
 *   post:
 *     summary: Create a new entity
 *     tags: [Entity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/objEntity'
 *     responses:
 *       200:
 *         description: The Entity was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/objEntity'
 *       500:
 *         description: Some server error
 */
 router.post("/", entity.create);

/**
 * @swagger
 * /entity/getlist/:
 *   post:
 *     summary: Returns the list of all the Customers
 *     tags: [Entity]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/entityParams'
 *     responses:
 *       200:
 *         description: The list of the customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ListEntity'
 */

router.post("/getlist/", entity.getList);
  
 /**
 * @swagger
 * /entity/{id}:
 *  put:
 *    summary: Update the entity by the id
 *    tags: [Entity]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The entity id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/objEntity'
 *    responses:
 *      200:
 *        description: The Entity was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/objEntity'
 *      404:
 *        description: The entity was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", entity.update);

/**
 * @swagger
 * /entity/{id}:
 *  delete:
 *    summary: Delete the entity by the id
 *    tags: [Entity]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The entity id
 *    responses:
 *      200:
 *        description: The Entity was deleted
 *      404:
 *        description: The entity was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", entity.delete);

module.exports = router;  