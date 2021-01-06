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
   * Find available movies to watch.
   *
   * @param {string} url - For the cinema's webpage.
   * @param {string[]} days - Days to choose movies from.
   * @returns {object[]} - List with suggested movies.
   * @memberof Movies
   */
  async findMovies (url, days) {
    const page = await SCRAPER.getPageText(url)

    // Convert the text to a DOM.
    const dom = new JSDOM(page)

    // Get information from the page's option elements.
    const dayIds = await this._extractDayOptions(dom, days)
    const allMovies = await this._extractMovieOptions(dom)

    // Create an array of Query strings to use.
    const queries = this._generateQuerystrings(dayIds, allMovies)

    // Do a fetch request to get an array of available movies.
    const movies = await this._fetchForMovies(url, queries)

    const suggestions = this._addTitle(allMovies, movies)

    return suggestions
  }

  /**
   * Match options from page with days to get ids for the days.
   *
   * @param {object} dom - A DOM representing the cinema page.
   * @param {string[]} days - The days to find.
   * @returns {string[]} - Id's for the days on the page.
   * @memberof Movies
   */
  async _extractDayOptions (dom, days) {
    const dayIds = []
    // Get all option-elements regarding days.
    const dayOptions = Array.from(dom.window.document.querySelectorAll('#day option'))

    // Find the corresponding number in the value attribute for each day.
    for (const day of days) {
      // Match together option and days with their sting values.
      for (const element of dayOptions) {
        if (element.textContent === day) {
          // Add requestId for the day according to the value attribute.
          dayIds.push(element.getAttribute('value'))
        }
      }
    }

    return dayIds
  }

  /**
   * Extract movie options from page to get all current movies.
   *
   * @param {object} dom - A DOM representing the cinema page.
   * @returns {object[]} - All movies that are showing this week.
   * @memberof Movies
   */
  async _extractMovieOptions (dom) {
    // Find options of all movies, ignore the first without a value attribute.
    const movieOptions = Array.from(dom.window.document.querySelectorAll('#movie option[value]'))

    const allMovies = []

    for (const i of movieOptions) {
      allMovies.push({
        requestMovieId: i.getAttribute('value'),
        movieTitle: i.textContent
      })
    }

    return allMovies
  }

  /**
   * Generate query stings for get requests.
   *
   * @param {string[]} dayIds - for each day to get a query for.
   * @param {object[]} allMovies - to combine with days.
   * @returns {string[]} - all query string combinations.
   * @memberof Movies
   */
  _generateQuerystrings (dayIds, allMovies) {
    let day, movie
    const queries = []

    for (const id of dayIds) {
      day = id

      for (const id in allMovies) {
        movie = allMovies[id].requestMovieId

        queries.push(`/check?day=${day}&movie=${movie}`)
      }
    }

    return queries
  }

  /**
   * Fetch for getting all available movies.
   *
   * @param {string} url - should be the main URL of the page.
   * @param {string} queries - the query to add to the URL.
   * @returns {object[]} - Movies with available tickets.
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
    // Flatten array.
    queriedMovies = queriedMovies.flat()

    // Only interested in movies with status 1,
    // then there are still available tickets.
    const sortedMovies = []
    for (const movie of queriedMovies) {
      if (movie.status === 1) {
        sortedMovies.push(movie)
      }
    }

    return sortedMovies
  }

  /**
   * Add title property to movies.
   *
   * @param {object[]} allMovies - with an id and title.
   * @param {object[]} movies - to match title for.
   * @returns {object[]} - movies, with added title.
   * @memberof Movies
   */
  _addTitle (allMovies, movies) {
    const complementeMovies = movies

    // Go through suggested movies.
    for (const movie of complementeMovies) {
      // Go through list of all movies and add title when matched.
      for (const title of allMovies) {
        movie.title = title.movieTitle
      }
    }

    return complementeMovies
  }
}
