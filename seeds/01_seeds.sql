DELETE FROM users;
DELETE FROM properties;
DELETE FROM reservations;
DELETE FROM property_reviews;

INSERT INTO users (id, name, email, password)
VALUES (1, 'Amy', 'amy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Bob', 'bob@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Cindy', 'cindy@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, 
  parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 1, 'Cozy Place', 'description',' https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 
'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 93061, 4, 4, 4, 'CANADA', '123 Dundas', 'Toronto', 
'Ontario', 'M5V2V6', TRUE),
(2, 2, 'Blank corner', 'description',' https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 
'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 85234, 2, 2, 2, 'CANADA', '456 Queen', 'Toronto', 
'Ontario', 'M2J2K8', TRUE),
(3, 3, 'Habit mix', 'description',' https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 
'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 46058, 1, 1, 1, 'CANADA', '789 King', 'Toronto', 
'Ontario', 'M3M4j6', TRUE);


INSERT INTO reservations (id, guest_id, property_id, start_date, end_date)
VALUES (1, 1, 1, '2018-09-11', '2018-09-26'),
(2, 2, 2, '2019-01-04', '2019-02-01'),
(3, 3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 1, 4, 'place is very clean.'),
(2, 2, 2, 2, 3, 'far away from the subway.'),
(3, 3, 3, 3, 5, 'John is very nice and introduce alot of local stuff to us, easy check-in and great location.');
