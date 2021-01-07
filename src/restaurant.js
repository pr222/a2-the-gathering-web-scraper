/**
 * A module for finding free restaurant tables.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import fetch from 'node-fetch'

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
   * @returns {object} -
   * @memberof Restaurant
   */
  async findTables (url, movies) {
    const firstGet = await fetch(url)
    // console.log(firstGet)
    console.log(firstGet.status)
    // console.log(firstGet.cookie)
    // const cookie = document.cookie
    // console.log(cookie)

    const postLogin = await fetch(`${url}login/`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'username=zeke&password=coys&submit=login'
    })
    // console.log(postLogin)
    console.log(postLogin.url)
    console.log(postLogin.status)
    console.log(postLogin.cookie)

    return this._freeTables
  }
}
