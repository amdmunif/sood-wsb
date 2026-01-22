-- Migration V2: Add sort_order columns

-- Add sort_order to subject_categories
ALTER TABLE `subject_categories` ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `name`;

-- Add sort_order to subjects (if not exists)
-- Note: schema says category_id already exists
ALTER TABLE `subjects` ADD COLUMN `sort_order` INT DEFAULT 0 AFTER `category_id`;
