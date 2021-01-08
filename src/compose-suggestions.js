/**
 * A module for composing a list of suggestions
 * for a moive night ending dining at a restaurant.
 *
 * @author Pauliina Raitaniemi <pr222ja@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Compose suggestions for outing.
 *
 * @exports
 * @param {object[]} movies - movies to watch.
 * @param {object[]} tables - available dining times.
 * @returns {string} - Suggested combination of movies and tables.
 */
export function composeSuggestion (movies, tables) {
  let day, movieTitle, movieTime, tableStart, tableEnd
  console.log(movies)
  console.log(tables)
  const suggestions = []

  for (const movie of movies) {
    console.log(movie.time)
    const movieDuration = `${parseInt(movie.time.slice(0, 2)) + 2}`
    console.log(movieDuration)
    console.log('-------------------------------------')
    // Handle information for each movie.
    for (const table of tables) {
      if (movie.day === table.day) {
        if (movieDuration === table.tableStart) {
          console.log('MATCH!')
          console.log(movie)
          console.log(table)
        }
      }
    }
  }

  return `* On ${day}, "${movieTitle}" begins at ${movieTime}:00, and there is a free table to book between ${tableStart}:00-${tableEnd}:00.`
}
