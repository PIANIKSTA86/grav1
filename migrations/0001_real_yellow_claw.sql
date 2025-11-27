ALTER TABLE `plan_cuentas` MODIFY COLUMN `suscriptor_id` char(36);--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `es_plantilla` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `naturaleza` varchar(1);--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `categoria_nivel` varchar(20);--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `ruta` varchar(500);--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `ruta_codigo` varchar(500);--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `requiere_presupuesto` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `niif_categoria_id` char(36);--> statement-breakpoint
ALTER TABLE `plan_cuentas` ADD `puc_categoria_id` char(36);