/**
 * A calendar module for finding available days.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import { Scraper } from './scraper.js'
import jsdom from 'jsdom'
const { JSDOM } = jsdom
const SCRAPER = new Scraper()

/**
 * Calendar for available days.
 *
 * @exports
 * @class Calendar
 */
export class Calendar {
/**
 * Creates an instance of Calendar.
 *
 * @memberof Calendar
 */
  constructor () {
    this._availableDays = []
  }

  /**
   * Get the available days.
   *
   * @readonly
   * @memberof Calendar
   * @returns {string[]} - The available days.
   */
  get availableDays () {
    return [...this._availableDays]
  }

  /**
   * Check for available days.
   *
   * @param {string} url - To the main calendar page.
   * @memberof Calendar
   * @returns {string[]} - The days that are available.
   */
  async checkForDays (url) {
    // Prepare fullpath links for individual calendars
    // based on the provided url parameter.
    const fullPathLinks = await this._prepareLinks(url)

    const potentialDays = [0, 0, 0]

    // Work with each link to fill up the potential days.
    for (const index in fullPathLinks) {
      // Get the plain text content from the page.
      const page = await SCRAPER.getPageText(fullPathLinks[index])

      // Convert the text to a DOM.
      const dom = new JSDOM(page)

      // Make an array from the nodelist with all
      // td's text content, where the info if the day
      // is OK or not is.
      const options = Array.from(dom.window.document.querySelectorAll('td'), option => option.textContent)

      console.log(options)
      // Check for OKs in the options.
      for (const i in options) {
        // If the option has a positive answer, add value to
        // corresponding index in potentialDays.
        if (options[i].match(/ok/i)) {
          potentialDays[i] += 1
        }
      }
    }

    // Finally, check the index and its value
    // to determine if a day is available and
    // add the day to available days if so.
    for (const [index, element] of potentialDays.entries()) {
      let day

      if (index === 0 && element === 3) {
        day = 'Friday'
      }
      if (index === 1 && element === 3) {
        day = 'Saturday'
      }
      if (index === 2 && element === 3) {
        day = 'Sunday'
      }

      if (element === 3) {
        this._availableDays.push(day)
      }
    }

    return this._availableDays
  }

  /**
   * Prepare all links for the calendar.
   *
   * @param {string} url - To the main calendar page.
   * @returns {string[]} - Full URLs for each persons' calendar.
   * @memberof Calendar
   */
  async _prepareLinks (url) {
    // Find links on the first calendar page.
    const pageLinks = await SCRAPER.findLinksFromPage(url)

    // Prepare relative path, first two characters not needed.
    const realtivePath = []
    pageLinks.forEach(element => {
      realtivePath.push(element.slice(2))
    })

    // Construct full links for every persons' calendar page.
    const fullPathLinks = []
    realtivePath.forEach(element => {
      fullPathLinks.push(`${url}${element}`)
    })

    return fullPathLinks
  }
}
