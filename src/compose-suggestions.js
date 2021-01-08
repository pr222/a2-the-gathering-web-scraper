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
 * @returns {object[]} - Suggested combination of movies and tables.
 */
export function composeSuggestion (movies, tables) {
  const suggestions = []

  for (const movie of movies) {
    // Add 2h for matching when to book a table.
    const movieDuration = `${parseInt(movie.time.slice(0, 2)) + 2}`

    // Cross-check information for each movie with table options.
    for (const table of tables) {
      if (movie.day === table.day) {
        if (movieDuration === table.tableStart) {
          // Create a suggestion-object with final information.
          const suggestion = {
            movieTitle: movie.title,
            movieTime: movie.time,
            tableStart: table.tableStart,
            tableEnd: table.tableEnd
          }

          // Check and add day to suggestion.
          if (movie.day === '05') {
            suggestion.day = 'Friday'
          } else if (movie.day === '06') {
            suggestion.day = 'Saturday'
          } else if (movie.day === '07') {
            suggestion.day = 'Sunday'
          }

          suggestions.push(suggestion)
        }
      }
    }
  }

  return suggestions
}
