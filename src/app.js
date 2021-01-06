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
    // console.log(movieSuggestions)
    // console.log('Scraping showtimes...OK')

    console.log('\nSuggestions\n===========')
    console.log('')
  } catch (err) {
    console.error(err)
  }
}

wrapper()
