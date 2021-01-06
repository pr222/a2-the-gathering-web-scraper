/**
 * A module for finding bookable movies.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import { Scraper } from './scraper.js'
import jsdom from 'jsdom'
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

    this._extractDayOptions(dom)
    this._extractMovieOptions(dom)

    console.log(this._requestDayIds)
    console.log(this.suggestions)
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
    console.log(this._movieOptions)
  }
}
