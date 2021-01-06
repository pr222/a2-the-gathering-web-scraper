/**
 * A module for finding bookable movies.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import { Scraper } from './scraper.js'
import jsdom from 'jsdom'
import fetch from 'node-fetch'

const { JSDOM } = jsdom
const SCRAPER = new Scraper()

/**
 * Class for finding movies.
 *
 * @exports
 * @class Movies
 */
export class Movies {
  /**
   * Creates an instance of Movies.
   *
   * @param {string[]} days - The days to find movies for.
   * @memberof Movies
   */
  constructor (days) {
    this._days = days
    this._requestDayIds = []
    this._movieOptions = []
    this.suggestions = []
  }

  /**
   * Find available movies to watch.
   *
   * @param {string} url - For the cinema's webpage.
   * @memberof Movies
   */
  async findMovies (url) {
    const page = await SCRAPER.getPageText(url)

    // Convert the text to a DOM.
    const dom = new JSDOM(page)

    // Get information of days and movies that's on the webpage.
    this._extractDayOptions(dom)
    this._extractMovieOptions(dom)

    // Create an array of Query strings to use.
    const queries = this._generateQuerystrings()

    // Do a fetch request to get an array of available movies.
    const moviesToSort = await this._fetchForMovies(url, queries)

    console.log(moviesToSort)
  }

  /**
   * Extract Day options from page and add to suggestions.
   *
   * @param {object} dom - A DOM representing the cinema page.
   * @memberof Movies
   */
  async _extractDayOptions (dom) {
    // Get all option-elements regarding days.
    const dayOptions = Array.from(dom.window.document.querySelectorAll('#day option'))

    // Find the corresponding number in the value attribute for each day.
    for (const [index, element] of this._days.entries()) {
      // Add object with the day to suggestions.
      this.suggestions.push({ day: element })

      // Match together option and days with their sting values.
      for (const j of dayOptions) {
        if (j.textContent === element) {
          // Add requestId for the day according to the value attribute.
          this._requestDayIds.push(j.getAttribute('value'))
          this.suggestions[index].requestDayId = j.getAttribute('value')
        }
      }
    }
  }

  /**
   * Extract Movie options from page.
   *
   * @param {object} dom - A DOM representing the cinema page.
   * @memberof Movies
   */
  async _extractMovieOptions (dom) {
    // Find options of all movies, ignore the first without a value attribute.
    const movieOptions = Array.from(dom.window.document.querySelectorAll('#movie option[value]'))

    for (const i of movieOptions) {
      this._movieOptions.push({
        requestMovieId: i.getAttribute('value'),
        movieTitle: i.textContent
      })
    }
  }

  /**
   * Generate querysting for page requests.
   *
   * @returns {string[]} - query strings to add to url.
   * @memberof Movies
   */
  _generateQuerystrings () {
    let day, movie
    const queries = []

    for (const id of this._requestDayIds) {
      day = id

      for (const id in this._movieOptions) {
        movie = this._movieOptions[id].requestMovieId

        queries.push(`/check?day=${day}&movie=${movie}`)
      }
    }

    return queries
  }

  /**
   * Fetch for getting all movies.
   *
   * @param {string} url - should be the main URL of the page.
   * @param {string} queries - the query to add to the URL.
   * @returns {object[]} - Array with all movies as objects.
   * @memberof Movies
   */
  async _fetchForMovies (url, queries) {
    let queriedMovies = []

    for (const query of queries) {
      // Make the fetch request.
      const response = await fetch(`${url}${query}`)

      // Just to be sure, check the status.
      if (response.ok) {
        // Convert body from JSON and add to array.
        const body = await response.json()

        queriedMovies.push(body)
      } else {
        throw new Error(`Something went wrong when trying to get available movies: ${response.status}`)
      }
    }
    // Flatten array before returning it.
    queriedMovies = queriedMovies.flat()

    return queriedMovies
  }
}
