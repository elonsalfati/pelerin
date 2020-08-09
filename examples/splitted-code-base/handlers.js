const { Router } = require("../../")

// initialize router
const router = new Router()

/**
 * Handle say hello.
 *
 * @param {pelerin.Request} req - Pelerin request object
 * @param {pelerin.Response} res - Pelerin response
 */
router.handler("SayHello", (req, res) => res.send({ message: `Hello, ${req.body.name}` }))

// export router
module.exports = router
