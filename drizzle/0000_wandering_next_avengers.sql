CREATE TABLE IF NOT EXISTS `registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`organization` text,
	`role` text,
	`country` text,
	`phone` text,
	`linkedin` text,
	`portfolio` text,
	`availability` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
