/**
 * Load Module Dependencies.
 */
import * as Router from "koa-router";

import * as userController from "../controllers/user";
import * as authController from "../controllers/auth";

var router  = Router();

/**
 * @api {post} /users/login Login A user
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup User
 *
 * @apiDescription Log in a user. The request returns a token used to authentication
 * of the user on subsequent requests. The token is placed as an HTTP header ie
 * ```Authorization: Bearer <Token-here>``` otherwise requests are rejected.
 *
 *
 */
router.post('/login', authController.login);

/**
 * @api {post} /users/create Create A user
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup User
 *
 * @apiDescription Log in a user. The request returns a token used to authentication
 * of the user on subsequent requests. The token is placed as an HTTP header ie
 * ```Authorization: Bearer <Token-here>``` otherwise requests are rejected.
 *
 *
 */
router.post('/create', userController.create);

/**
 * @api {post} /users/logout Logout a user
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup User
 *
 * @apiDescription Invalidate a users token
 *
 *
 */
router.post('/logout', authController.logout);

/**
 * @api {get} /users/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get users collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup User
 *
 * @apiDescription Get a collection of users. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 */
router.get('/', userController.fetchAllByPagination);


/**
 * @api {put} /users/:id Get User
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup User
 *
 * @apiDescription Get a user with the given id
 *
 *
 */
router.put('/:id', userController.update);


/**
 * @api {delete} /users/:id Get User
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup User
 *
 * @apiDescription Get a user with the given id
 *
 *
 */
router.delete('/:id', userController.remove);


/**
 * @api {get} /users/:id Get User
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup User
 *
 * @apiDescription Get a user with the given id
 *
 *
 */
router.get('/:id', userController.fetchOne);


// Expose User Router
export default router;
