/**
 * The application's starting point.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import validator from 'validator'
import { Scraper } from './scraper.js'
import { Calendar } from './calendar.js'
import { Movies } from './movies.js'
import { Restaurant } from './restaurant.js'
import { composeSuggestion } from './compose-suggestions.js'

/**
 * Wrapper for running the main application asyncronously.
 */
const wrapper = async () => {
  try {
    // Only use the first custom user-provided commando line
    // starting argument, skipping the two first standard ones.
    const [argument] = process.argv.slice(2)

    // Make sure the argument is an URL in the first place.
    if (!validator.isURL(argument)) {
      throw new Error('The provided argument was not an URL.')
    }

    // Create a new scarper and scrape the links on starting page.
    const scraper = new Scraper()
    const links = await scraper.findLinksFromPage(argument)
    console.log('Scraping links...OK')

    // Create a calendar to check for available days.
    const calendar = new Calendar()
    const availableDays = await calendar.checkForDays(links[0])
    console.log('Scraping available days...OK')

    // Check movies.
    const movies = new Movies()
    const movieSuggestions = await movies.findMovies(links[1], availableDays)
    console.log('Scraping showtimes...OK')

    // Find suitable tables in restaurant after the movies.
    const tables = new Restaurant()
    const tableSuggestions = await tables.findTables(links[2], movieSuggestions)
    console.log('Scraping possible reservations...OK')

    // Compose suggestions out of scraped information.
    const suggestion = composeSuggestion(movieSuggestions, tableSuggestions)

    console.log('\nSuggestions\n===========')
    console.log(suggestion)
  } catch (err) {
    console.error(err)
  }
}

wrapper()
