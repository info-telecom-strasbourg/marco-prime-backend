-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `_prisma_migrations` (
	`id` varchar(36) NOT NULL,
	`checksum` varchar(64) NOT NULL,
	`finished_at` datetime(3),
	`migration_name` varchar(255) NOT NULL,
	`logs` text,
	`rolled_back_at` datetime(3),
	`started_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`applied_steps_count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `_prisma_migrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`card_number` bigint NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`balance` decimal(10,2) NOT NULL DEFAULT '0.00',
	`admin` tinyint(1) NOT NULL DEFAULT 0,
	`contributor` tinyint(1) NOT NULL DEFAULT 0,
	`birth_date` date,
	`sector` varchar(100),
	`class` int,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `members_id` PRIMARY KEY(`id`),
	CONSTRAINT `members_card_number_key` UNIQUE(`card_number`),
	CONSTRAINT `members_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`product_id` bigint,
	`member_id` bigint NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`amount` int NOT NULL DEFAULT 1,
	`date` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_types` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	CONSTRAINT `product_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_types_type_key` UNIQUE(`type`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`product_type` bigint NOT NULL,
	`color` varchar(50),
	`available` tinyint(1) NOT NULL DEFAULT 1,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_product_type_fkey` FOREIGN KEY (`product_type`) REFERENCES `product_types`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `members_card_number_idx` ON `members` (`card_number`);--> statement-breakpoint
CREATE INDEX `members_email_idx` ON `members` (`email`);--> statement-breakpoint
CREATE INDEX `orders_date_idx` ON `orders` (`date`);--> statement-breakpoint
CREATE INDEX `orders_member_id_idx` ON `orders` (`member_id`);--> statement-breakpoint
CREATE INDEX `orders_product_id_idx` ON `orders` (`product_id`);--> statement-breakpoint
CREATE INDEX `products_available_idx` ON `products` (`available`);--> statement-breakpoint
CREATE INDEX `products_product_type_idx` ON `products` (`product_type`);
*/