/**
 * A module for scraping links from a html page.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import fetch from 'node-fetch'
import jsdom from 'jsdom'
const { JSDOM } = jsdom

/**
 * The scraper class.
 *
 *
 * @exports
 * @class Scraper
 */
export class Scraper {
  /**
   * Scraping for links on a page.
   *
   * @param {string} url - The url of the page to scrape.
   * @returns {string[]} - All URLs found on the page.
   * @memberof Scraper
   */
  async findLinksFromPage (url) {
    // Fetch url to get the content.
    const text = await this._getPageText(url)

    // Convert plain text to a workable DOM.
    const dom = new JSDOM(text)

    // Create node list with all http and https links.
    const foundLinks = dom.window.document.querySelectorAll('a[href^="http"], a[href^="https"]')

    const links = []

    for (let i = 0; i < foundLinks.length; i++) {
      links.push(foundLinks[i].href)
    }

    return links
  }

  /**
   * Fetch and get the text of a page.
   *
   * @param {string} url - The url page to get its text from.
   * @returns {string} - The text.
   * @memberof Scraper
   */
  async _getPageText (url) {
    // Fetch the requested url.
    const response = await fetch(url)
    // Convert the response to plain text.
    return response.text()
  }
}
