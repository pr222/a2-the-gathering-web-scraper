/**
 * A module for finding free restaurant tables.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import fetch from 'node-fetch'

const LOGIN = 'username=zeke&password=coys&submit=login'

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
    // Do a POST request to login to the page.
    const login = await this._postLogin(url)

    // Take the set-cookie from the response.
    const cookie = login.headers.get('set-cookie')

    // Prepare url for next request.
    const nextUrl = `${url}login/booking`

    const tablesPage = await this._getPage(nextUrl, cookie)

    const page = await tablesPage.text()
    // console.log(page)
    return this._freeTables
  }

  /**
   * Do a POST for login to page.
   *
   * @param {string} url - base url of webpage.
   * @returns {object} - header response object.
   * @memberof Restaurant
   */
  async _postLogin (url) {
    const postLogin = await fetch(`${url}login/`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${LOGIN}`
    })

    return postLogin
  }

  /**
   * Do a GET request for a page.
   *
   * @param {string} url - the page to get.
   * @param {string} cookie - a cookie to include.
   * @returns {object} - header response object.
   * @memberof Restaurant
   */
  async _getPage (url, cookie) {
    const getPage = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        cookie: `${cookie}`
      }
    })

    return getPage
  }
}
