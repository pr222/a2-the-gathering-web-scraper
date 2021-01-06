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
    // this._requestDayIds = []
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
    this._findDayOptionElements(page)
    // console.log(page)
  }

  async _findDayOptionElements (page) {
    // Convert the text to a DOM.
    const dom = new JSDOM(page)

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
          this.suggestions[index].requestDayIds = j.getAttribute('value')
        }
      }
    }
    console.log(this.suggestions)
    // Find options of all movies, ignore the first without a value attribute.
    const movieOptions = Array.from(dom.window.document.querySelectorAll('#movie option[value]'))

    console.log(movieOptions)
  }
}
