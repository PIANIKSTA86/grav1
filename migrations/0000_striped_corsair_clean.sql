CREATE TABLE `auditoria` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36),
	`usuario_id` char(36),
	`accion` varchar(100) NOT NULL,
	`tabla_afectada` varchar(100),
	`registro_id` char(36),
	`descripcion` varchar(255),
	`datos_antiguos` json,
	`datos_nuevos` json,
	`ip_address` varchar(45),
	`fecha` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `auditoria_id` PRIMARY KEY(`id`)
);
CREATE TABLE `bancos` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`codigo` varchar(50),
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `bancos_id` PRIMARY KEY(`id`)
);
CREATE TABLE `catalog_estado` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`codigo` varchar(60) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`descripcion` text,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `catalog_estado_id` PRIMARY KEY(`id`)
);
CREATE TABLE `catalogo_niif` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`codigo` varchar(20) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`nivel` int NOT NULL,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `catalogo_niif_id` PRIMARY KEY(`id`)
);
CREATE TABLE `catalogo_puc` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`codigo` varchar(20) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`nivel` int NOT NULL,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `catalogo_puc_id` PRIMARY KEY(`id`)
);
CREATE TABLE `centros_costo` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`descripcion` text,
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `centros_costo_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_centros_costo_nombre` UNIQUE(`suscriptor_id`,`nombre`)
);
CREATE TABLE `conceptos_exogena` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`codigo` varchar(20) NOT NULL,
	`descripcion` varchar(255) NOT NULL,
	`formato` varchar(50),
	`tipo` varchar(50),
	`estado` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `conceptos_exogena_id` PRIMARY KEY(`id`)
);
CREATE TABLE `conceptos_factura` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`factura_id` char(36) NOT NULL,
	`concepto` varchar(255) NOT NULL,
	`cantidad` decimal(10,3) NOT NULL DEFAULT '1.000',
	`valor_unitario` decimal(15,2) NOT NULL,
	`valor_total` decimal(15,2) NOT NULL,
	`cuenta_id` char(36) NOT NULL,
	`centro_costo_id` char(36),
	CONSTRAINT `conceptos_factura_id` PRIMARY KEY(`id`)
);
CREATE TABLE `conceptos_ph` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`descripcion` text,
	`tipo_concepto` varchar(100) NOT NULL,
	`valor_base` decimal(15,2) NOT NULL,
	`aplica_por_coeficiente` boolean NOT NULL DEFAULT true,
	`aplica_por_area` boolean NOT NULL DEFAULT false,
	`cuenta_id` char(36),
	`centro_costo_id` char(36),
	`aplica_iva` boolean NOT NULL DEFAULT false,
	`aplica_intereses` boolean NOT NULL DEFAULT false,
	`porcentaje_iva` decimal(5,2) NOT NULL DEFAULT '0.00',
	`periodo_desde` date,
	`periodo_hasta` date,
	`es_constante` boolean NOT NULL DEFAULT true,
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `conceptos_ph_id` PRIMARY KEY(`id`)
);
CREATE TABLE `configuracion_suscriptor` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`categoria` varchar(50) NOT NULL,
	`clave` varchar(100) NOT NULL,
	`valor` text,
	`descripcion` text,
	`tipo` varchar(30) NOT NULL DEFAULT 'texto',
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `configuracion_suscriptor_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_configuracion_clave` UNIQUE(`suscriptor_id`,`categoria`,`clave`)
);
CREATE TABLE `cuentas_bancarias` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`banco_id` char(36),
	`numero_cuenta` varchar(100) NOT NULL,
	`tipo_cuenta` varchar(50),
	`titular` varchar(255),
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `cuentas_bancarias_id` PRIMARY KEY(`id`)
);
CREATE TABLE `documentos_electronicos` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`tipo_documento` varchar(50) NOT NULL,
	`referencia_externa` varchar(255),
	`payload` json,
	`estado_envio` varchar(20) NOT NULL DEFAULT 'pendiente',
	`respuesta` json,
	`fecha_envio` datetime,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `documentos_electronicos_id` PRIMARY KEY(`id`)
);
CREATE TABLE `facturas` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`numero_factura` varchar(50) NOT NULL,
	`tercero_id` char(36) NOT NULL,
	`unidad_id` char(36),
	`periodo_id` char(36) NOT NULL,
	`fecha_factura` date NOT NULL,
	`fecha_vencimiento` date NOT NULL,
	`subtotal` decimal(15,2) NOT NULL,
	`descuentos` decimal(15,2) NOT NULL DEFAULT '0.00',
	`iva` decimal(15,2) NOT NULL DEFAULT '0.00',
	`total` decimal(15,2) NOT NULL,
	`saldo_pendiente` decimal(15,2) NOT NULL,
	`estado` varchar(20) NOT NULL DEFAULT 'pendiente',
	`observaciones` text,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `facturas_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_facturas_numero` UNIQUE(`suscriptor_id`,`numero_factura`)
);
CREATE TABLE `movimiento_detalle` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`movimiento_id` char(36) NOT NULL,
	`cuenta_id` char(36) NOT NULL,
	`tercero_id` char(36),
	`centro_costo_id` char(36),
	`descripcion` text,
	`debito` decimal(18,2) NOT NULL DEFAULT '0.00',
	`credito` decimal(18,2) NOT NULL DEFAULT '0.00',
	`base_gravable` decimal(18,2),
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `movimiento_detalle_id` PRIMARY KEY(`id`)
);
CREATE TABLE `movimientos_contables` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`numero` varchar(50) NOT NULL,
	`tipo` varchar(20) NOT NULL,
	`fecha` date NOT NULL,
	`periodo_id` char(36) NOT NULL,
	`descripcion` text,
	`estado` varchar(20) NOT NULL DEFAULT 'borrador',
	`usuario_creacion_id` char(36) NOT NULL,
	`centro_costo_id` char(36),
	`partida_presupuestal_id` char(36),
	`conciliado` boolean NOT NULL DEFAULT false,
	`fecha_conciliacion` datetime,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `movimientos_contables_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_movimientos_numero` UNIQUE(`suscriptor_id`,`numero`)
);
CREATE TABLE `pagos` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`factura_id` char(36) NOT NULL,
	`fecha_pago` date NOT NULL,
	`valor_pagado` decimal(15,2) NOT NULL,
	`metodo_pago` varchar(50),
	`referencia_pago` varchar(100),
	`observaciones` text,
	`usuario_registro_id` char(36) NOT NULL,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `pagos_id` PRIMARY KEY(`id`)
);
CREATE TABLE `parametros_contables` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`tipo_parametro` varchar(100) NOT NULL,
	`cuenta_id` char(36) NOT NULL,
	`centro_costo_id` char(36),
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `parametros_contables_id` PRIMARY KEY(`id`)
);
CREATE TABLE `partidas_presupuestales` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`tipo` varchar(50),
	`monto_aprobado` decimal(18,2) NOT NULL DEFAULT '0.00',
	`saldo` decimal(18,2) NOT NULL DEFAULT '0.00',
	`estado` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `partidas_presupuestales_id` PRIMARY KEY(`id`)
);
CREATE TABLE `periodos_contables` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`ano` int NOT NULL,
	`mes` int NOT NULL,
	`fecha_inicio` date NOT NULL,
	`fecha_fin` date NOT NULL,
	`estado` varchar(20) NOT NULL DEFAULT 'abierto',
	`fecha_cierre` datetime,
	`usuario_cierre_id` char(36),
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `periodos_contables_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_periodos_ano_mes` UNIQUE(`suscriptor_id`,`ano`,`mes`)
);
CREATE TABLE `plan_cuentas` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`codigo` varchar(20) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`tipo` varchar(20) NOT NULL,
	`nivel` int NOT NULL DEFAULT 1,
	`padre_id` char(36),
	`es_debito` boolean,
	`registra_tercero` boolean NOT NULL DEFAULT false,
	`requiere_centro_costo` boolean NOT NULL DEFAULT false,
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `plan_cuentas_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_plan_cuentas_codigo` UNIQUE(`suscriptor_id`,`codigo`)
);
CREATE TABLE `plan_cuentas_exogena` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`cuenta_id` char(36) NOT NULL,
	`exogena_id` char(36) NOT NULL,
	`formato` varchar(50),
	`observaciones` text,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `plan_cuentas_exogena_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_plan_cuentas_exogena` UNIQUE(`suscriptor_id`,`cuenta_id`,`exogena_id`)
);
CREATE TABLE `prefijos` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`tipo_transaccion_id` char(36) NOT NULL,
	`prefijo` varchar(20) NOT NULL,
	`numeracion_actual` int NOT NULL DEFAULT 1,
	`descripcion` varchar(255),
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `prefijos_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_prefijos_tipo` UNIQUE(`suscriptor_id`,`tipo_transaccion_id`)
);
CREATE TABLE `reservas` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`zona_comun_id` char(36) NOT NULL,
	`unidad_id` char(36) NOT NULL,
	`usuario_solicita_id` char(36) NOT NULL,
	`fecha_reserva` date NOT NULL,
	`hora_inicio` varchar(8) NOT NULL,
	`hora_fin` varchar(8) NOT NULL,
	`estado` varchar(20) NOT NULL DEFAULT 'pendiente',
	`observaciones` text,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `reservas_id` PRIMARY KEY(`id`)
);
CREATE TABLE `roles` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(50) NOT NULL,
	`descripcion` text,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
CREATE TABLE `saldos_cuentas` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`cuenta_id` char(36) NOT NULL,
	`periodo_id` char(36) NOT NULL,
	`saldo_debito` decimal(18,2) NOT NULL DEFAULT '0.00',
	`saldo_credito` decimal(18,2) NOT NULL DEFAULT '0.00',
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `saldos_cuentas_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_saldos_cuentas` UNIQUE(`suscriptor_id`,`cuenta_id`,`periodo_id`)
);
CREATE TABLE `suscriptores` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`nombre` varchar(100) NOT NULL,
	`nit` varchar(20) NOT NULL,
	`subdominio` varchar(50),
	`email_contacto` varchar(255),
	`direccion` varchar(255),
	`telefono` varchar(50),
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `suscriptores_id` PRIMARY KEY(`id`),
	CONSTRAINT `suscriptores_nit_unique` UNIQUE(`nit`)
);
CREATE TABLE `terceros` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`tipo_persona` varchar(10) NOT NULL,
	`tipo_identificacion` varchar(50) NOT NULL,
	`numero_identificacion` varchar(50) NOT NULL,
	`nombre_completo` varchar(255),
	`razon_social` varchar(255),
	`direccion` varchar(255),
	`email` varchar(255),
	`telefono` varchar(50),
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `terceros_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_terceros_identificacion` UNIQUE(`suscriptor_id`,`numero_identificacion`)
);
CREATE TABLE `tipos_comprobantes` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`descripcion` varchar(255),
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `tipos_comprobantes_id` PRIMARY KEY(`id`)
);
CREATE TABLE `tipos_transaccion` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`descripcion` varchar(255),
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `tipos_transaccion_id` PRIMARY KEY(`id`)
);
CREATE TABLE `unidades` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`codigo_unidad` varchar(30) NOT NULL,
	`tipo_unidad` varchar(50),
	`propietario_id` char(36),
	`inquilino_id` char(36),
	`area` decimal(10,2),
	`coeficiente` decimal(5,4),
	`activo` boolean NOT NULL DEFAULT true,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `unidades_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_unidades_codigo` UNIQUE(`suscriptor_id`,`codigo_unidad`)
);
CREATE TABLE `usuarios` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`nombre` varchar(100) NOT NULL,
	`apellido` varchar(100),
	`email` varchar(255) NOT NULL,
	`nit` varchar(20) NOT NULL,
	`password` varchar(255) NOT NULL,
	`telefono` varchar(50),
	`rol_id` char(36),
	`suscriptor_id` char(36),
	`activo` boolean NOT NULL DEFAULT true,
	`ultimo_login` datetime,
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `usuarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `usuarios_email_unique` UNIQUE(`email`)
);
CREATE TABLE `zonas_comunes` (
	`id` char(36) NOT NULL DEFAULT (UUID()),
	`suscriptor_id` char(36) NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`descripcion` varchar(255),
	`capacidad_maxima` int,
	`estado` varchar(20) NOT NULL DEFAULT 'disponible',
	`fecha_creacion` datetime NOT NULL DEFAULT NOW(),
	`fecha_actualizacion` datetime NOT NULL DEFAULT NOW(),
	CONSTRAINT `zonas_comunes_id` PRIMARY KEY(`id`)
);
ALTER TABLE `auditoria` ADD CONSTRAINT `auditoria_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `auditoria` ADD CONSTRAINT `auditoria_usuario_id_usuarios_id_fk` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `bancos` ADD CONSTRAINT `bancos_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `centros_costo` ADD CONSTRAINT `centros_costo_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `conceptos_exogena` ADD CONSTRAINT `conceptos_exogena_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `conceptos_factura` ADD CONSTRAINT `conceptos_factura_factura_id_facturas_id_fk` FOREIGN KEY (`factura_id`) REFERENCES `facturas`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `conceptos_factura` ADD CONSTRAINT `conceptos_factura_cuenta_id_plan_cuentas_id_fk` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `conceptos_factura` ADD CONSTRAINT `conceptos_factura_centro_costo_id_centros_costo_id_fk` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `conceptos_ph` ADD CONSTRAINT `conceptos_ph_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `conceptos_ph` ADD CONSTRAINT `conceptos_ph_cuenta_id_plan_cuentas_id_fk` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `conceptos_ph` ADD CONSTRAINT `conceptos_ph_centro_costo_id_centros_costo_id_fk` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `configuracion_suscriptor` ADD CONSTRAINT `configuracion_suscriptor_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `cuentas_bancarias` ADD CONSTRAINT `cuentas_bancarias_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `cuentas_bancarias` ADD CONSTRAINT `cuentas_bancarias_banco_id_bancos_id_fk` FOREIGN KEY (`banco_id`) REFERENCES `bancos`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `documentos_electronicos` ADD CONSTRAINT `documentos_electronicos_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `facturas` ADD CONSTRAINT `facturas_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `facturas` ADD CONSTRAINT `facturas_tercero_id_terceros_id_fk` FOREIGN KEY (`tercero_id`) REFERENCES `terceros`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `facturas` ADD CONSTRAINT `facturas_unidad_id_unidades_id_fk` FOREIGN KEY (`unidad_id`) REFERENCES `unidades`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `facturas` ADD CONSTRAINT `facturas_periodo_id_periodos_contables_id_fk` FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contables`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `movimiento_detalle` ADD CONSTRAINT `movimiento_detalle_movimiento_id_movimientos_contables_id_fk` FOREIGN KEY (`movimiento_id`) REFERENCES `movimientos_contables`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `movimiento_detalle` ADD CONSTRAINT `movimiento_detalle_cuenta_id_plan_cuentas_id_fk` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `movimiento_detalle` ADD CONSTRAINT `movimiento_detalle_tercero_id_terceros_id_fk` FOREIGN KEY (`tercero_id`) REFERENCES `terceros`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `movimiento_detalle` ADD CONSTRAINT `movimiento_detalle_centro_costo_id_centros_costo_id_fk` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `movimientos_contables` ADD CONSTRAINT `movimientos_contables_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `movimientos_contables` ADD CONSTRAINT `movimientos_contables_periodo_id_periodos_contables_id_fk` FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contables`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `movimientos_contables` ADD CONSTRAINT `movimientos_contables_usuario_creacion_id_usuarios_id_fk` FOREIGN KEY (`usuario_creacion_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `movimientos_contables` ADD CONSTRAINT `movimientos_contables_centro_costo_id_centros_costo_id_fk` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `movimientos_contables` ADD CONSTRAINT `movimientos_contables_partida_presupuestal_id_partidas_presupuestales_id_fk` FOREIGN KEY (`partida_presupuestal_id`) REFERENCES `partidas_presupuestales`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `pagos` ADD CONSTRAINT `pagos_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `pagos` ADD CONSTRAINT `pagos_factura_id_facturas_id_fk` FOREIGN KEY (`factura_id`) REFERENCES `facturas`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `pagos` ADD CONSTRAINT `pagos_usuario_registro_id_usuarios_id_fk` FOREIGN KEY (`usuario_registro_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `parametros_contables` ADD CONSTRAINT `parametros_contables_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `parametros_contables` ADD CONSTRAINT `parametros_contables_cuenta_id_plan_cuentas_id_fk` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `parametros_contables` ADD CONSTRAINT `parametros_contables_centro_costo_id_centros_costo_id_fk` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `partidas_presupuestales` ADD CONSTRAINT `partidas_presupuestales_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `periodos_contables` ADD CONSTRAINT `periodos_contables_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `periodos_contables` ADD CONSTRAINT `periodos_contables_usuario_cierre_id_usuarios_id_fk` FOREIGN KEY (`usuario_cierre_id`) REFERENCES `usuarios`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `plan_cuentas` ADD CONSTRAINT `plan_cuentas_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `plan_cuentas` ADD CONSTRAINT `plan_cuentas_padre_id_plan_cuentas_id_fk` FOREIGN KEY (`padre_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `plan_cuentas_exogena` ADD CONSTRAINT `plan_cuentas_exogena_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `plan_cuentas_exogena` ADD CONSTRAINT `plan_cuentas_exogena_cuenta_id_plan_cuentas_id_fk` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `plan_cuentas_exogena` ADD CONSTRAINT `plan_cuentas_exogena_exogena_id_conceptos_exogena_id_fk` FOREIGN KEY (`exogena_id`) REFERENCES `conceptos_exogena`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `prefijos` ADD CONSTRAINT `prefijos_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `prefijos` ADD CONSTRAINT `prefijos_tipo_transaccion_id_tipos_transaccion_id_fk` FOREIGN KEY (`tipo_transaccion_id`) REFERENCES `tipos_transaccion`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `reservas` ADD CONSTRAINT `reservas_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `reservas` ADD CONSTRAINT `reservas_zona_comun_id_zonas_comunes_id_fk` FOREIGN KEY (`zona_comun_id`) REFERENCES `zonas_comunes`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `reservas` ADD CONSTRAINT `reservas_unidad_id_unidades_id_fk` FOREIGN KEY (`unidad_id`) REFERENCES `unidades`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `reservas` ADD CONSTRAINT `reservas_usuario_solicita_id_usuarios_id_fk` FOREIGN KEY (`usuario_solicita_id`) REFERENCES `usuarios`(`id`) ON DELETE restrict ON UPDATE no action;ALTER TABLE `roles` ADD CONSTRAINT `roles_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `saldos_cuentas` ADD CONSTRAINT `saldos_cuentas_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `saldos_cuentas` ADD CONSTRAINT `saldos_cuentas_cuenta_id_plan_cuentas_id_fk` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `saldos_cuentas` ADD CONSTRAINT `saldos_cuentas_periodo_id_periodos_contables_id_fk` FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contables`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `terceros` ADD CONSTRAINT `terceros_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `tipos_comprobantes` ADD CONSTRAINT `tipos_comprobantes_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `tipos_transaccion` ADD CONSTRAINT `tipos_transaccion_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `unidades` ADD CONSTRAINT `unidades_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `unidades` ADD CONSTRAINT `unidades_propietario_id_terceros_id_fk` FOREIGN KEY (`propietario_id`) REFERENCES `terceros`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `unidades` ADD CONSTRAINT `unidades_inquilino_id_terceros_id_fk` FOREIGN KEY (`inquilino_id`) REFERENCES `terceros`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_roles_id_fk` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE set null ON UPDATE no action;ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;ALTER TABLE `zonas_comunes` ADD CONSTRAINT `zonas_comunes_suscriptor_id_suscriptores_id_fk` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores`(`id`) ON DELETE cascade ON UPDATE no action;CREATE INDEX `idx_auditoria_suscriptor` ON `auditoria` (`suscriptor_id`);CREATE INDEX `idx_auditoria_fecha` ON `auditoria` (`fecha`);CREATE INDEX `idx_bancos_suscriptor` ON `bancos` (`suscriptor_id`);CREATE INDEX `idx_catalog_estado_codigo` ON `catalog_estado` (`codigo`);CREATE INDEX `idx_catalogo_niif_codigo` ON `catalogo_niif` (`codigo`);CREATE INDEX `idx_catalogo_puc_codigo` ON `catalogo_puc` (`codigo`);CREATE INDEX `idx_centros_costo_suscriptor` ON `centros_costo` (`suscriptor_id`);CREATE INDEX `idx_conceptos_exogena_suscriptor` ON `conceptos_exogena` (`suscriptor_id`);CREATE INDEX `idx_conceptos_factura` ON `conceptos_factura` (`factura_id`);CREATE INDEX `idx_conceptos_ph_suscriptor` ON `conceptos_ph` (`suscriptor_id`);CREATE INDEX `idx_configuracion_suscriptor` ON `configuracion_suscriptor` (`suscriptor_id`);CREATE INDEX `idx_cuentas_bancarias_suscriptor` ON `cuentas_bancarias` (`suscriptor_id`);CREATE INDEX `idx_cuentas_bancarias_banco` ON `cuentas_bancarias` (`banco_id`);CREATE INDEX `idx_documentos_electronicos_suscriptor` ON `documentos_electronicos` (`suscriptor_id`);CREATE INDEX `idx_documentos_electronicos_estado` ON `documentos_electronicos` (`estado_envio`);CREATE INDEX `idx_facturas_suscriptor` ON `facturas` (`suscriptor_id`);CREATE INDEX `idx_detalle_movimiento` ON `movimiento_detalle` (`movimiento_id`);CREATE INDEX `idx_movimientos_suscriptor` ON `movimientos_contables` (`suscriptor_id`);CREATE INDEX `idx_pagos_factura` ON `pagos` (`factura_id`);CREATE INDEX `idx_parametros_contables_suscriptor` ON `parametros_contables` (`suscriptor_id`);CREATE INDEX `idx_parametros_contables_tipo` ON `parametros_contables` (`tipo_parametro`);CREATE INDEX `idx_partidas_presupuestales_suscriptor` ON `partidas_presupuestales` (`suscriptor_id`);CREATE INDEX `idx_periodos_suscriptor` ON `periodos_contables` (`suscriptor_id`);CREATE INDEX `idx_plan_cuentas_suscriptor` ON `plan_cuentas` (`suscriptor_id`);CREATE INDEX `idx_reservas_zona_fecha` ON `reservas` (`zona_comun_id`,`fecha_reserva`);CREATE INDEX `idx_roles_suscriptor` ON `roles` (`suscriptor_id`);CREATE INDEX `idx_saldos_cuentas_suscriptor` ON `saldos_cuentas` (`suscriptor_id`);CREATE INDEX `idx_saldos_cuentas_cuenta` ON `saldos_cuentas` (`cuenta_id`);CREATE INDEX `idx_saldos_cuentas_periodo` ON `saldos_cuentas` (`periodo_id`);CREATE INDEX `idx_suscriptores_nit` ON `suscriptores` (`nit`);CREATE INDEX `idx_suscriptores_subdominio` ON `suscriptores` (`subdominio`);CREATE INDEX `idx_terceros_suscriptor` ON `terceros` (`suscriptor_id`);CREATE INDEX `idx_tipos_comprobantes_suscriptor` ON `tipos_comprobantes` (`suscriptor_id`);CREATE INDEX `idx_tipos_transaccion_suscriptor` ON `tipos_transaccion` (`suscriptor_id`);CREATE INDEX `idx_unidades_suscriptor` ON `unidades` (`suscriptor_id`);CREATE INDEX `idx_usuarios_email` ON `usuarios` (`email`);CREATE INDEX `idx_usuarios_nit` ON `usuarios` (`nit`);CREATE INDEX `idx_usuarios_suscriptor` ON `usuarios` (`suscriptor_id`);CREATE INDEX `idx_zonas_comunes_suscriptor` ON `zonas_comunes` (`suscriptor_id`);