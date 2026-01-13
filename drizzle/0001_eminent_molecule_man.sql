DROP TABLE `_prisma_migrations`;--> statement-breakpoint
ALTER TABLE `members` DROP INDEX `members_card_number_key`;--> statement-breakpoint
ALTER TABLE `members` DROP INDEX `members_email_key`;--> statement-breakpoint
ALTER TABLE `product_types` DROP INDEX `product_types_type_key`;--> statement-breakpoint
ALTER TABLE `orders` DROP FOREIGN KEY `orders_member_id_fkey`;
--> statement-breakpoint
ALTER TABLE `orders` DROP FOREIGN KEY `orders_product_id_fkey`;
--> statement-breakpoint
ALTER TABLE `products` DROP FOREIGN KEY `products_product_type_fkey`;
--> statement-breakpoint
DROP INDEX `members_card_number_idx` ON `members`;--> statement-breakpoint
DROP INDEX `members_email_idx` ON `members`;--> statement-breakpoint
DROP INDEX `orders_date_idx` ON `orders`;--> statement-breakpoint
DROP INDEX `orders_member_id_idx` ON `orders`;--> statement-breakpoint
DROP INDEX `orders_product_id_idx` ON `orders`;--> statement-breakpoint
DROP INDEX `products_available_idx` ON `products`;--> statement-breakpoint
DROP INDEX `products_product_type_idx` ON `products`;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `last_name` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `first_name` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `card_number` bigint;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `email` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `admin` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `admin` boolean NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `contributor` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `contributor` boolean NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `sector` varchar(255);--> statement-breakpoint
ALTER TABLE `members` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `product_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `member_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `amount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `date` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `product_types` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `name` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `title` varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `price` decimal(10,2) NOT NULL DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `available` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `products` ADD `product_type_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_member_id_members_id_fk` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_product_type_id_product_types_id_fk` FOREIGN KEY (`product_type_id`) REFERENCES `product_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `product_type`;