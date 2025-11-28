ALTER TABLE `plan_cuentas` MODIFY COLUMN `id` binary(16) NOT NULL DEFAULT UNHEX(REPLACE(UUID(), '-', ''));--> statement-breakpoint
ALTER TABLE `plan_cuentas` MODIFY COLUMN `suscriptor_id` char(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `plan_cuentas` DROP COLUMN `es_debito`;