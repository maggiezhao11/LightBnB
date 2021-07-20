SELECT properties.*, AVG(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city LIKE '%ancouv%' 
/* incase to include possible answer from user made by typo or other places north/south, 
use this % % syntax to include more possible answers other than city = 'Vancouver'  */
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
