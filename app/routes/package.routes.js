const { Router } = require("express");
  
const package =  require("../endpoint/package.endpoint.js");

const { withJWTAuthMiddleware } = require("express-kun");
const router = Router();

const protectedRouter = withJWTAuthMiddleware(router, process.env.SECRET);
/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
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
  *   name: Package
  *   description: The Package managing API
  */

 /**
 * @swagger
 * /Package/sync:
 *   post:
 *     summary: Sincronize a new brand
 *     tags: [Package]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: The Package was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       500:
 *         description: Some server error
 */
 router.post("/sync/", package.sync);

/**
 * @swagger
 * /package:
 *   post:
 *     summary: Create a new brand
 *     tags: [Package]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: The Package was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       500:
 *         description: Some server error
 */
 router.post("/", package.create);

 /**
 * @swagger
 * /Package/getlist/{tb_institution_id}:
 *   get:
 *     summary: Returns the list of all the Brands
 *     tags: [Package]
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
 *                 $ref: '#/components/schemas/Package'
 */

router.get("/getlist/:tb_institution_id", package.getList);
  
/**
 * @swagger
 * /Package/get/{tb_institution_id}/{id}:
 *   get:
 *     summary: Returns the Package
 *     tags: [Package]
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
 *         description: The Package
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 */

 router.get("/get/:tb_institution_id/:id", package.get);
 /**
 * @swagger
 * /package:
 *  put:
 *    summary: Update the brand by the id
 *    tags: [Package]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Package'
 *    responses:
 *      200:
 *        description: The Package was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Package'
 *      404:
 *        description: The brand was not found
 *      500:
 *        description: Some error happened
 */
 router.put("/", package.update);

/**
 * @swagger
 * /brand/{id}:
 *  delete:
 *    summary: Delete the brand by the id
 *    tags: [Package]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The brand id
 *    responses:
 *      200:
 *        description: The Package was deleted
 *      404:
 *        description: The brand was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/", package.delete);

module.exports = router;