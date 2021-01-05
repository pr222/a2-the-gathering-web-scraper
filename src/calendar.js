/**
 * A calendar module for finding available days.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import { Scraper } from './scraper.js'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

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
  constructor () {
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
    console.log(fullPathLinks)
    const potentialDays = [0, 0, 0]

    for (const index in fullPathLinks) {
      const page = await scraper.getPageText(fullPathLinks[index])
      // Convert plain text to a workable DOM.
      const dom = new JSDOM(page)

      const options = Array.from(dom.window.document.querySelectorAll('td'), option => option.textContent)

      console.log(options)

      for (const index in options) {
        if (options[index].match(/ok/i)) {
          potentialDays[index] += 1
          console.log('Match!' + index + ' ' + options[index])
        }
      }

      console.log(potentialDays)
    }

    return fullPathLinks
  }
}
