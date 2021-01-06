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
    this.days = days
  }

  /**
   * Find available movies to watch.
   *
   * @param {string} url - For the cinema's webpage.
   * @memberof Movies
   */
  async findMovies (url) {
    const page = await SCRAPER.getPageText(url)

    console.log(page)
  }
}
