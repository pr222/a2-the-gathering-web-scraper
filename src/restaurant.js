/**
 * A module for finding free restaurant tables.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import fetch from 'node-fetch'
import jsdom from 'jsdom'

const { JSDOM } = jsdom
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
   * Set information of all tables into an object.
   *
   * @param {string[]} values - strings with information to set.
   * @memberof Restaurant
   */
  _setTables (values) {
    // Extraxt infromation from the strings to create an object for each table.
    for (const value of values) {
      const tableInfo = {
        day: value.slice(0, 3),
        tableStart: value.slice(3, 5),
        tableEnd: value.slice(5, 7)
      }

      // Convert string day names to number-like strings instead.
      if (tableInfo.day === 'fri') {
        tableInfo.day = '05'
      } else if (tableInfo.day === 'sat') {
        tableInfo.day = '06'
      } else if (tableInfo.day === 'sun') {
        tableInfo.day = '07'
      }

      this._freeTables.push(tableInfo)
    }
  }

  /**
   * Find suggestions for tables to book.
   *
   * @param {string} url - to the restaurant's login page.
   * @returns {object[]} - time information for each available table.
   * @memberof Restaurant
   */
  async findTables (url) {
    // Do a POST request to login to the page.
    const login = await this._postLogin(url)

    // Take the set-cookie from the response.
    const cookie = login.headers.get('set-cookie')

    // Prepare url for next request.
    const nextUrl = `${url}login/booking`

    // Do a GET request to redirect to page with all table options.
    const getPage = await this._getPage(nextUrl, cookie)

    // Convert the response to plain text and make an DOM of it.
    const page = await getPage.text()
    const dom = new JSDOM(page)

    // Find all radio inputs and extract the value attribute
    // with day and time information about the available table.
    const tables = Array.from(dom.window.document.querySelectorAll('input[type="radio"]'), element => element.value)

    // Convert the string information into an object for each table.
    this._setTables(tables)

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

    // Throw error if not returning the right resonse status.
    if (postLogin.status !== 302) {
      throw new Error(`Something went wrong with login: ${postLogin.status}`)
    }

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

    // Throw error if page was not gotten.
    if (getPage.status !== 200) {
      throw new Error(`${getPage.status} Sorry, could not get the webpage...`)
    }

    return getPage
  }
}
