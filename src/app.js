/**
 * The application's starting point.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */
import validator from 'validator'

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
    console.log(argument)
    console.log('The app ran to completion.')
  } catch (err) {
    console.error(err)
  }
}

wrapper()
