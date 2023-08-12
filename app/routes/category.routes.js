const { Router } = require("express");
  
const category =  require("../endpoint/category.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id         
 *         - description
 *         - posit_level
 *         - kind
 *         - active
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         description:
 *           type: string
 *         posit_level:
 *           type: string
 *         kind:
 *           type: string 
 *         active:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Category
  *   description: The Category managing API
  */

 /**
 * @swagger
 * /Category/sync:
 *   post:
 *     summary: Sincronize a new Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The Category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", category.sync);

/**
 * @swagger
 * /Category:
 *   post:
 *     summary: Create a new Category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The Category was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Some server error
 */
 router.post("/", category.create);

 /**
 * @swagger
 * /Category/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Categorys
 *     tags: [Category]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Category tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

router.get("/getlist/:tb_institution_id", category.getList);
  
/**
 * @swagger
 * /Category/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Category
 *     tags: [Category]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Category by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Category by id
 *     responses:
 *       200:
 *         description: The Category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

 router.get("/get/:tb_institution_id/:id", category.get);
 /**
 * @swagger
 * /Category:
 *  put:
 *    summary: Update the Category by the id
 *    tags: [Category]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      200:
 *        description: The Category was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      404:
 *        description: The Category was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", category.update);

/**
 * @swagger
 * /Category/{id}:
 *  delete:
 *    summary: Delete the Category by the id
 *    tags: [Category]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Category id
 *    responses:
 *      200:
 *        description: The Category was deleted
 *      404:
 *        description: The Category was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", category.delete);

module.exports = router;