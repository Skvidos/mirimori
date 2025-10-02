CREATE DATABASE mirimori CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mirimori;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending','accepted','blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);

CREATE TABLE anime (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_jp VARCHAR(255),
  title_en VARCHAR(255),
  alt_titles TEXT,
  description TEXT,
  type ENUM('TV','Movie','OVA','ONA','Special') DEFAULT 'TV',
  episodes_total INT,
  episode_duration INT,
  release_date DATE,
  studio VARCHAR(255),
  source VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE manga (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_jp VARCHAR(255),
  title_en VARCHAR(255),
  alt_titles TEXT,
  description TEXT,
  type ENUM('Manga','LightNovel','Manhwa','Manhua') DEFAULT 'Manga',
  chapters_total INT,
  volumes_total INT,
  release_date DATE,
  author VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('anime','manga') NOT NULL,
  item_id INT NOT NULL,
  status ENUM('watching','completed','planned','dropped','on_hold') NOT NULL,
  progress INT DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('anime','manga','character') NOT NULL,
  item_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('anime','manga') NOT NULL,
  item_id INT NOT NULL,
  rating TINYINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);

CREATE TABLE anime_characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  anime_id INT NOT NULL,
  character_id INT NOT NULL,
  role ENUM('main','support') DEFAULT 'support',
  FOREIGN KEY (anime_id) REFERENCES anime(id),
  FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE TABLE authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role ENUM('author','artist','director','studio') DEFAULT 'author'
);

CREATE TABLE item_authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_type ENUM('anime','manga') NOT NULL,
  item_id INT NOT NULL,
  author_id INT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watched (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  anime_id INT NOT NULL,
  status ENUM('watching','completed','on_hold','dropped','plan_to_watch') DEFAULT 'plan_to_watch',
  episodes_watched INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (anime_id) REFERENCES anime(id)
);



