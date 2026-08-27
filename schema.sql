CREATE DATABASE IF NOT EXISTS rule_filter_db;

USE rule_filter_db;

CREATE TABLE IF NOT EXISTS rules (

  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  match_type ENUM('contains', 'startsWith', 'exact') NOT NULL DEFAULT 'contains',
  action_type ENUM('highlight', 'tooltip') NOT NULL DEFAULT 'highlight',
  color VARCHAR(50) NOT NULL DEFAULT '#000',
  tag VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);