
/**
 * Define the pelerin router object
 */
class Router {
  /**
   * Initialize the router
   */
  constructor() {
    // initialize routes
    this._routes = {}
  }

  /**
   * Get the router routes.
   *
   * @returns {object} - The routes map
   */
  get routes() {
    return this._routes
  }

  /**
   * Define the router settings.
   *
   * @param {string} path - Name of the handler.
   * @param {...any} args - External arguments.
   * @returns {object} - this
   */
  handler(path, ...args) {
    this._routes[path] = args
  }
}

module.exports = Router
