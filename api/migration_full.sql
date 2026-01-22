-- Migration Full: Fix missing tables and columns

-- 1. Buat tabel subject_categories (jika belum ada)
CREATE TABLE IF NOT EXISTS `subject_categories` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tambahkan kolom ke tabel subjects (jalankan satu per satu jika error)
-- Abaikan error "Duplicate column name" jika kolom sudah ada

ALTER TABLE `subjects` ADD COLUMN `category_id` INT UNSIGNED DEFAULT NULL;
ALTER TABLE `subjects` ADD COLUMN `sort_order` INT DEFAULT 0;

-- 3. Tambahkan Foreign Key (pastikan category_id dan id tipe datanya sama: INT UNSIGNED)
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_category_id_foreign` 
FOREIGN KEY (`category_id`) REFERENCES `subject_categories` (`id`) ON DELETE SET NULL;
