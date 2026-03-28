-- Teacher App Database
-- Run this file to set up the database quickly

CREATE DATABASE IF NOT EXISTS teacher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teacher_db;

-- auth_user table
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- teachers table
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) UNSIGNED NOT NULL,
  `university_name` VARCHAR(255) NOT NULL,
  `gender` ENUM('male','female','other') NOT NULL,
  `year_joined` YEAR NOT NULL,
  `bio` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_teacher_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
