/**
 * A module for finding free restaurant tables.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Class for finding free tables in a restaurant.
 *
 * @exports
 * @class Restaurant
 */
export class Restaurant {
/**
 * Creates an instance of Restaurant.
 *
 * @memberof Restaurant
 */
  constructor () {
    this._freeTables = []
  }

  /**
   * Get the free tables.
   *
   * @readonly
   * @memberof Restaurant
   * @returns {object[]} - Free tables.
   */
  get freeTables () {
    return [...this._freeTables]
  }

  /**
   * Find suggestions for tables to book after movies.
   *
   * @param {string} url - to the restaurant's login page.
   * @param {object[]} movies - to watch before eating.
   * @memberof Restaurant
   */
  async findTableSuggestions (url, movies) {

  }
}
