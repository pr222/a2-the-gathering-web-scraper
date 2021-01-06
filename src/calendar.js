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
   * Set the avialable days.
   *
   * @param {Array} values - Number of votes for each day.
   * @memberof Calendar
   */
  _setAvailableDays (values) {
    // Determine for each index with its value if a day
    // should be added to available days.
    for (const [index, element] of values.entries()) {
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

    // Go to all links and look for the potential days.
    const potentialDays = await this._findPotentialDays(fullPathLinks)

    // Set the available days based on the votes for potential days.
    this._setAvailableDays(potentialDays)

    // Make sure there are any available days before returning.
    if (this.availableDays.length < 1) {
      throw new Error('Sorry, there were no possible days for this week.')
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

  /**
   * Find all OKs for days when people are available.
   *
   * @param {string[]} urls - To visit and look for Oks in.
   * @returns {Array} - With number of votes for each day.
   * @memberof Calendar
   */
  async _findPotentialDays (urls) {
    const potentialDays = [0, 0, 0]

    // Work with each link to fill up the potential days.
    for (const index in urls) {
      // Get the plain text content from the page.
      const page = await SCRAPER.getPageText(urls[index])

      // Convert the text to a DOM.
      const dom = new JSDOM(page)

      // Make an array from the nodelist with all
      // td's text content, where the info wether
      // the day is OK or not are.
      const answerBox = Array.from(dom.window.document.querySelectorAll('td'), option => option.textContent)

      // Check for OKs in the options.
      for (const i in answerBox) {
        if (answerBox[i].match(/ok/i)) {
          potentialDays[i] += 1
        }
      }
    }

    return potentialDays
  }
}
