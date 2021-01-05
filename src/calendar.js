/**
 * A calendar module for finding available days.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import { Scraper } from './scraper.js'

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
 * @param {string} url - the page with all persons' calendars.
 * @memberof Calendar
 */
  constructor (url) {
    this.allCalendarsPage = url
    this.availableDays = []
  }

  /**
   * Check for available days.
   *
   * @param {string} link -
   * @memberof Calendar
   * @returns {*} -
   */
  async checkForDays (link) {
    // Find links on the first calendar page.
    const scraper = new Scraper()
    const pageLinks = await scraper.findLinksFromPage(link)

    // Prepare relative path.
    const realtivePath = []
    pageLinks.forEach(element => {
      realtivePath.push(element.slice(2))
    })

    // Construct full links for every persons' calendar page.
    const fullPathLinks = []
    realtivePath.forEach(element => {
      fullPathLinks.push(`${link}${element}`)
    })

    return fullPathLinks
  }
}
