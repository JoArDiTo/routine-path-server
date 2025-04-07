-- This SQL file is used to create the database and tables for the application.
CREATE DATABASE IF NOT EXISTS "routinepathdb";

CREATE TABLE "users" (
  id varchar(36) PRIMARY KEY,
  firstname varchar(255),
  lastname varchar(255),
  email varchar(255),
  password text
);

CREATE TABLE "goals" (
  id varchar(36) PRIMARY KEY,
  user_id varchar(36),
  title varchar(255),
  description text,
  deadline date,
  status varchar(20),
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE steps (
  id varchar(36) PRIMARY KEY,
  goal_id varchar(36),
  title varchar(255),
  is_completed boolean DEFAULT false,
  created_at timestamp
);

ALTER TABLE "goals" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "steps" ADD FOREIGN KEY ("goal_id") REFERENCES "goals" ("id") ON DELETE CASCADE;