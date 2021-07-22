const properties = require('./json/properties.json');
const users = require('./json/users.json');
const pool = require('./connection');
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'vagrant',
//   password: '123',
//   host: 'localhost',
//   database: 'lightbnb'
// });

// pool.connect();

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
  return pool.query('SELECT * FROM users WHERE users.email = $1;', [email])
  .then((response) => {
    console.log(response.rows);
    return response.rows[0];
  })
  .catch(err => {
    console.log('error is here!')
    console.error(err)
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  //return Promise.resolve(users[id]);
  return pool.query('SELECT * FROM users WHERE users.id = $1;', [id])
  .then((response) => {
    return response.rows[0];
  })
  .catch(err => {
    console.error(err)
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  console.log('user:', user)
  return pool.query('INSERT INTO users (name, email, password ) VALUES ($1, $2, $3::TEXT) RETURNING *', [user.name, user.email, user.password])
  .then((response) => {
    return response.rows[0];
  })
  .catch(e => console.error(e.message))
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  //return getAllProperties(null, 2);
  return pool
  .query(`SELECT title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, AVG(rating) FROM properties
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews ON reservations.id = property_reviews.reservation_id
  WHERE reservations.guest_id = $2 
  GROUP BY properties.id
  LIMIT $1`, [limit, guest_id])
  .then((result) => {
    console.log(result.rows);
    return(result.rows);
  })
  .catch((err) => {
    console.log(err.message);
  });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);

  const queryParams = [];
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  let where = 0; 
  if (options.city) {
    let lowerCity = (options.city).toLowerCase();
    queryParams.push(`%${lowerCity}%`);
    queryString += `WHERE LOWER(city) LIKE $${queryParams.length} `; 
    // use LOWER and toLowerCase in order to make no case sensitive while user inputting city name.
    where = 1;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);
    if (where === 1) {
      queryString += `AND cost_per_night BETWEEN  $${queryParams.length - 1} * 100 AND $${queryParams.length} * 100`;
    } else {
      queryString += `WHERE cost_per_night BETWEEN  $${queryParams.length - 1} * 100 AND $${queryParams.length} * 100`;   
      where = 1;  
    }
  }
  
  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  console.log("property: ", property);
  return pool
  .query(`INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
    cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city,
    province, post_code) 
  VALUES ($1, $2, $3::TEXT, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 ) RETURNING *`, 
  [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code])
  .then((response) => {
    return response.rows[0];
  })
  .catch(e => console.error(e.message))
}
exports.addProperty = addProperty;
