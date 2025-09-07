-- Fix security definer view by recreating it without SECURITY DEFINER
DROP VIEW IF EXISTS user_waste_reports;

CREATE VIEW user_waste_reports AS
SELECT * FROM waste_reports;