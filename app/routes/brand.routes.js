const { Router } = require("express");
  
const brand =  require("../endpoint/brand.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - id
 *         - tb_institution_id
 *         - description
 *         - active
 *       properties:
 *         id:
 *           type: integer
 *         tb_institution_id:
 *           type: integer
 *         description:
 *           type: string
 *         active:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Brand
  *   description: The Brand managing API
  */

 /**
 * @swagger
 * /brand/sync:
 *   post:
 *     summary: Sincronize a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/brand'
 *     responses:
 *       200:
 *         description: The Brand was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/brand'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", brand.sync);

/**
 * @swagger
 * /brand:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/brand'
 *     responses:
 *       200:
 *         description: The Brand was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/brand'
 *       500:
 *         description: Some server error
 */
 router.post("/", brand.create);

 /**
 * @swagger
 * /brand/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Brands
 *     tags: [Brand]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand tb_institution_id
 *     responses:
 *       200:
 *         description: The list of the payment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/brand'
 */

router.get("/getlist/:tb_institution_id", brand.getList);
  
/**
 * @swagger
 * /brand/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Brand
 *     tags: [Brand]
 *     parameters:
 *      - in: path
 *        name: tb_institution_id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand by tb_institution_id and....
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand by id
 *     responses:
 *       200:
 *         description: The Brand
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/brand'
 */

 router.get("/get/:tb_institution_id/:id", brand.get);
 /**
 * @swagger
 * /brand:
 *  put:
 *    summary: Update the brand by the id
 *    tags: [Brand]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/brand'
 *    responses:
 *      200:
 *        description: The Brand was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/brand'
 *      404:
 *        description: The brand was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", brand.update);

/**
 * @swagger
 * /brand/{id}:
 *  delete:
 *    summary: Delete the brand by the id
 *    tags: [Brand]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand id
 *    responses:
 *      200:
 *        description: The Brand was deleted
 *      404:
 *        description: The brand was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", brand.delete);

module.exports = router;