-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2025 a las 18:52:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gravi`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_clonar_plan_cuentas_para_tenant` (IN `p_suscriptor_id` BINARY(16))   BEGIN
  -- Tabla temporal mapeo old_id -> new_id
  CREATE TEMPORARY TABLE temp_mapeo (
    old_id BINARY(16),
    new_id BINARY(16)
  ) ENGINE=MEMORY;

  -- 1) Insertar clones (sin resolver padre_id)
  INSERT INTO plan_cuentas (
    id, suscriptor_id, codigo, nombre, tipo, naturaleza,
    nivel, padre_id, registra_tercero,
    requiere_centro_costo, requiere_presupuesto,
    niif_categoria_id, puc_categoria_id,
    activo, es_plantilla
  )
  SELECT
    UNHEX(REPLACE(UUID(),'-','')),
    p_suscriptor_id,
    codigo,
    nombre,
    tipo,
    naturaleza,
    nivel,
    padre_id,
    registra_tercero,
    requiere_centro_costo,
    requiere_presupuesto,
    niif_categoria_id,
    puc_categoria_id,
    activo,
    0
  FROM plan_cuentas
  WHERE es_plantilla = 1
  ORDER BY LENGTH(codigo), codigo; -- ensure parents likely inserted before children by simple heuristic

  -- 2) Mapear viejo->nuevo por codigo y nuevo suscriptor
  INSERT INTO temp_mapeo (old_id, new_id)
  SELECT t.id AS old_id, p.id AS new_id
  FROM plan_cuentas t
  JOIN plan_cuentas p ON t.codigo = p.codigo AND p.suscriptor_id = p_suscriptor_id
  WHERE t.es_plantilla = 1;

  -- 3) Resolver padre_id para los registros clonados
  UPDATE plan_cuentas pc
  JOIN temp_mapeo child ON pc.id = child.new_id
  LEFT JOIN temp_mapeo parent_map ON pc.padre_id = parent_map.old_id
  SET pc.padre_id = parent_map.new_id
  WHERE pc.suscriptor_id = p_suscriptor_id;

  -- 4) Reconstruir rutas y niveles
  CALL sp_reconstruir_rutas_plan_cuentas(p_suscriptor_id);

  DROP TEMPORARY TABLE IF EXISTS temp_mapeo;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reconstruir_rutas_plan_cuentas` (IN `p_suscriptor_id` BINARY(16))   BEGIN
  -- Inicializa
  UPDATE plan_cuentas
  SET ruta = NULL, ruta_codigo = NULL, nivel = NULL
  WHERE suscriptor_id = p_suscriptor_id;

  -- Nivel raíz: padre_id IS NULL
  UPDATE plan_cuentas
  SET nivel = 1,
      ruta = HEX(id),                           -- usando HEX para debug legible; posprod puedes cambiar a id-like
      ruta_codigo = codigo
  WHERE padre_id IS NULL
    AND suscriptor_id = p_suscriptor_id;

  -- Bucle para niveles (hasta 20 niveles)
  SET @i = 1;
  WHILE @i <= 20 DO
    UPDATE plan_cuentas hijo
    JOIN plan_cuentas padre ON hijo.padre_id = padre.id
    SET
      hijo.nivel = padre.nivel + 1,
      hijo.ruta = CONCAT(padre.ruta, '/', HEX(hijo.id)),
      hijo.ruta_codigo = CONCAT(padre.ruta_codigo, '.', hijo.codigo)
    WHERE hijo.padre_id IS NOT NULL
      AND hijo.suscriptor_id = p_suscriptor_id
      AND (hijo.ruta IS NULL OR padre.ruta IS NOT NULL);

    SET @i = @i + 1;
  END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) DEFAULT NULL,
  `usuario_id` binary(16) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `accion_tipo` enum('insert','update','delete','login','logout','sistema','otros') DEFAULT NULL,
  `tabla_afectada` varchar(100) DEFAULT NULL,
  `registro_id` binary(16) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `datos_antiguos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_antiguos`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_nuevos`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `origen_app` varchar(50) DEFAULT NULL,
  `correlacion_id` varchar(100) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bitácora de acciones importantes en el sistema';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bancos`
--

CREATE TABLE `bancos` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_niif`
--

CREATE TABLE `catalogo_niif` (
  `id` binary(16) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `nivel` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_puc`
--

CREATE TABLE `catalogo_puc` (
  `id` binary(16) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `nivel` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo_puc`
--

INSERT INTO `catalogo_puc` (`id`, `codigo`, `nombre`, `nivel`, `fecha_creacion`) VALUES
(0x4678a698c56211f09a7402702e945e1b, '1', 'ACTIVO', 1, '2025-11-19 16:10:32'),
(0x467cb1e6c56211f09a7402702e945e1b, '11', 'DISPONIBLE', 2, '2025-11-19 16:10:32'),
(0x467f1c21c56211f09a7402702e945e1b, '1105', 'CAJA GENERAL', 3, '2025-11-19 16:10:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalog_estado`
--

CREATE TABLE `catalog_estado` (
  `id` binary(16) NOT NULL,
  `codigo` varchar(60) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalog_estado`
--

INSERT INTO `catalog_estado` (`id`, `codigo`, `nombre`, `descripcion`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(0x50039c25c23d11f0a6a6db2e5625b726, 'factura_pendiente', 'Pendiente', NULL, '2025-11-15 16:08:23', '2025-11-15 16:08:23'),
(0x50089993c23d11f0a6a6db2e5625b726, 'factura_pagada', 'Pagada', NULL, '2025-11-15 16:08:24', '2025-11-15 16:08:24'),
(0x500ac218c23d11f0a6a6db2e5625b726, 'factura_vencida', 'Vencida', NULL, '2025-11-15 16:08:24', '2025-11-15 16:08:24'),
(0x500cc9dfc23d11f0a6a6db2e5625b726, 'factura_anulada', 'Anulada', NULL, '2025-11-15 16:08:24', '2025-11-15 16:08:24'),
(0x60e111acc23d11f0a6a6db2e5625b726, 'periodo_abierto', 'Abierto', NULL, '2025-11-15 16:08:52', '2025-11-15 16:08:52'),
(0x60e6131ec23d11f0a6a6db2e5625b726, 'periodo_cerrado', 'Cerrado', NULL, '2025-11-15 16:08:52', '2025-11-15 16:08:52'),
(0x60e87c17c23d11f0a6a6db2e5625b726, 'periodo_bloqueado', 'Bloqueado', NULL, '2025-11-15 16:08:52', '2025-11-15 16:08:52'),
(0x60eac994c23d11f0a6a6db2e5625b726, 'mov_borrador', 'Borrador', NULL, '2025-11-15 16:08:52', '2025-11-15 16:08:52'),
(0x60ed6fbcc23d11f0a6a6db2e5625b726, 'mov_contabilizado', 'Contabilizado', NULL, '2025-11-15 16:08:52', '2025-11-15 16:08:52'),
(0x60ef9d71c23d11f0a6a6db2e5625b726, 'mov_anulado', 'Anulado', NULL, '2025-11-15 16:08:52', '2025-11-15 16:08:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros_costo`
--

CREATE TABLE `centros_costo` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Centros de costo para distribuir gastos';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conceptos_exogena`
--

CREATE TABLE `conceptos_exogena` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `formato` varchar(50) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Definiciones para reportes de información exogena';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conceptos_factura`
--

CREATE TABLE `conceptos_factura` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `factura_id` binary(16) NOT NULL,
  `concepto` varchar(255) NOT NULL,
  `cantidad` decimal(10,3) NOT NULL DEFAULT 1.000,
  `valor_unitario` decimal(15,2) NOT NULL,
  `valor_total` decimal(15,2) NOT NULL,
  `cuenta_id` binary(16) NOT NULL,
  `centro_costo_id` binary(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Detalle de las líneas de cada factura';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conceptos_ph`
--

CREATE TABLE `conceptos_ph` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo_concepto` varchar(100) NOT NULL,
  `valor_base` decimal(15,2) NOT NULL,
  `aplica_por_coeficiente` tinyint(1) NOT NULL DEFAULT 1,
  `aplica_por_area` tinyint(1) NOT NULL DEFAULT 0,
  `cuenta_id` binary(16) DEFAULT NULL,
  `centro_costo_id` binary(16) DEFAULT NULL,
  `aplica_iva` tinyint(1) NOT NULL DEFAULT 0,
  `aplica_intereses` tinyint(1) NOT NULL DEFAULT 0,
  `porcentaje_iva` decimal(5,2) NOT NULL DEFAULT 0.00,
  `periodo_desde` date DEFAULT NULL,
  `periodo_hasta` date DEFAULT NULL,
  `es_constante` tinyint(1) NOT NULL DEFAULT 1,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Plantillas para la generación de conceptos de factura';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_suscriptor`
--

CREATE TABLE `configuracion_suscriptor` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `clave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` varchar(30) NOT NULL DEFAULT 'texto',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Configuraciones y preferencias específicas de cada suscriptor';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas_bancarias`
--

CREATE TABLE `cuentas_bancarias` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `banco_id` binary(16) DEFAULT NULL,
  `numero_cuenta` varchar(100) NOT NULL,
  `tipo_cuenta` varchar(50) DEFAULT NULL,
  `titular` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos_electronicos`
--

CREATE TABLE `documentos_electronicos` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `tipo_documento` varchar(50) NOT NULL,
  `referencia_externa` varchar(255) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `estado_envio` enum('pendiente','enviado','aceptado','rechazado','error') NOT NULL DEFAULT 'pendiente',
  `respuesta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`respuesta`)),
  `fecha_envio` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `numero_factura` varchar(50) NOT NULL,
  `prefijo_id` binary(16) DEFAULT NULL,
  `tipo_documento` enum('factura','nota_credito','nota_debito','otro') NOT NULL DEFAULT 'factura',
  `tercero_id` binary(16) NOT NULL,
  `usuario_emision_id` binary(16) DEFAULT NULL,
  `origen_generacion` varchar(50) DEFAULT NULL,
  `unidad_id` binary(16) DEFAULT NULL,
  `periodo_id` binary(16) NOT NULL,
  `fecha_factura` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `descuentos` decimal(15,2) NOT NULL DEFAULT 0.00,
  `iva` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total` decimal(15,2) NOT NULL,
  `saldo_pendiente` decimal(15,2) NOT NULL,
  `estado` enum('pendiente','pagada','vencida','anulada') NOT NULL DEFAULT 'pendiente',
  `estado_id` binary(16) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Facturas de cobro a propietarios';

--
-- Disparadores `facturas`
--
DELIMITER $$
CREATE TRIGGER `trg_aud_fact_delete` AFTER DELETE ON `facturas` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    OLD.suscriptor_id,
    NULL,
    'Eliminación de factura',
    'delete',
    'facturas',
    OLD.id,
    CONCAT('Eliminación factura ', OLD.numero_factura),
    JSON_OBJECT('numero_factura', OLD.numero_factura, 'total', OLD.total, 'tercero_id', HEX(OLD.tercero_id)),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_fact_insert` AFTER INSERT ON `facturas` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    NEW.suscriptor_id,
    NEW.usuario_emision_id,
    'Creación de factura',
    'insert',
    'facturas',
    NEW.id,
    CONCAT('Factura ', NEW.numero_factura, ' creada'),
    JSON_OBJECT('numero_factura', NEW.numero_factura, 'total', NEW.total, 'tercero_id', HEX(NEW.tercero_id)),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_fact_update` AFTER UPDATE ON `facturas` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    NEW.suscriptor_id,
    NEW.usuario_emision_id,
    'Actualización de factura',
    'update',
    'facturas',
    NEW.id,
    CONCAT('Actualización factura ', NEW.numero_factura),
    JSON_OBJECT('estado_old', OLD.estado, 'total_old', OLD.total),
    JSON_OBJECT('estado_new', NEW.estado, 'total_new', NEW.total),
    'sistema'
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_contables`
--

CREATE TABLE `movimientos_contables` (
  `seq` bigint(20) UNSIGNED NOT NULL,
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `numero` varchar(50) NOT NULL,
  `tipo` enum('venta','compra','ingreso','egreso','nota','apertura','cierre') NOT NULL,
  `fecha` date NOT NULL,
  `periodo_id` binary(16) NOT NULL,
  `tipo_comprobante_id` binary(16) DEFAULT NULL,
  `origen_transaccion` varchar(50) DEFAULT NULL,
  `referencia_origen` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('borrador','contabilizado','anulado') NOT NULL DEFAULT 'borrador',
  `estado_id` binary(16) DEFAULT NULL,
  `usuario_creacion_id` binary(16) NOT NULL,
  `centro_costo_id` binary(16) DEFAULT NULL,
  `partida_presupuestal_id` binary(16) DEFAULT NULL,
  `conciliado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_conciliacion` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Cabecera de los comprobantes de contabilidad';

--
-- Disparadores `movimientos_contables`
--
DELIMITER $$
CREATE TRIGGER `trg_aud_mov_delete` AFTER DELETE ON `movimientos_contables` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    OLD.suscriptor_id,
    NULL,
    'Eliminación movimiento contable',
    'delete',
    'movimientos_contables',
    OLD.id,
    CONCAT('Eliminación movimiento ', OLD.numero),
    JSON_OBJECT('numero', OLD.numero, 'tipo', OLD.tipo, 'fecha', CAST(OLD.fecha AS CHAR)),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_mov_insert` AFTER INSERT ON `movimientos_contables` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    NEW.suscriptor_id,
    NEW.usuario_creacion_id,
    'Creación de movimiento contable',
    'insert',
    'movimientos_contables',
    NEW.id,
    CONCAT('Movimiento ', NEW.numero, ' creado'),
    JSON_OBJECT(
      'numero', NEW.numero,
      'tipo', NEW.tipo,
      'fecha', CAST(NEW.fecha AS CHAR),
      'periodo_id', HEX(NEW.periodo_id)
    ),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_mov_update` AFTER UPDATE ON `movimientos_contables` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    NEW.suscriptor_id,
    NEW.usuario_creacion_id,
    'Actualización de movimiento contable',
    'update',
    'movimientos_contables',
    NEW.id,
    CONCAT('Actualización movimiento ', NEW.numero),
    JSON_OBJECT('numero', OLD.numero, 'tipo', OLD.tipo, 'fecha', CAST(OLD.fecha AS CHAR)),
    JSON_OBJECT('numero', NEW.numero, 'tipo', NEW.tipo, 'fecha', CAST(NEW.fecha AS CHAR)),
    'sistema'
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento_detalle`
--

CREATE TABLE `movimiento_detalle` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `movimiento_id` binary(16) NOT NULL,
  `cuenta_id` binary(16) NOT NULL,
  `tercero_id` binary(16) DEFAULT NULL,
  `centro_costo_id` binary(16) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `debito` decimal(18,2) NOT NULL DEFAULT 0.00,
  `credito` decimal(18,2) NOT NULL DEFAULT 0.00,
  `base_gravable` decimal(18,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Detalle de los comprobantes (partida doble)';

--
-- Disparadores `movimiento_detalle`
--
DELIMITER $$
CREATE TRIGGER `trg_aud_md_delete` AFTER DELETE ON `movimiento_detalle` FOR EACH ROW BEGIN
  DECLARE v_sus BINARY(16);
  DECLARE v_per BINARY(16);

  SELECT suscriptor_id, periodo_id INTO v_sus, v_per FROM movimientos_contables WHERE id = OLD.movimiento_id LIMIT 1;

  -- restar del saldo
  UPDATE saldos_cuentas
  SET saldo_debito = saldo_debito - OLD.debito,
      saldo_credito = saldo_credito - OLD.credito,
      fecha_actualizacion = CURRENT_TIMESTAMP
  WHERE suscriptor_id = v_sus AND cuenta_id = OLD.cuenta_id AND periodo_id = v_per;

  -- auditoría: eliminación
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    v_sus,
    NULL,
    'Eliminación de detalle contable',
    'delete',
    'movimiento_detalle',
    OLD.id,
    CONCAT('Eliminación línea contable en movimiento ', HEX(OLD.movimiento_id)),
    JSON_OBJECT(
      'movimiento_id', HEX(OLD.movimiento_id),
      'cuenta_id', HEX(OLD.cuenta_id),
      'debito', OLD.debito,
      'credito', OLD.credito,
      'descripcion', IFNULL(OLD.descripcion,'')
    ),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_md_insert` AFTER INSERT ON `movimiento_detalle` FOR EACH ROW BEGIN
  DECLARE v_sus BINARY(16);
  DECLARE v_per BINARY(16);

  -- obtener suscriptor y periodo desde el movimiento padre
  SELECT suscriptor_id, periodo_id INTO v_sus, v_per
    FROM movimientos_contables WHERE id = NEW.movimiento_id LIMIT 1;

  -- actualizar/insertar saldo en saldos_cuentas
  INSERT INTO saldos_cuentas (id, suscriptor_id, cuenta_id, periodo_id, saldo_debito, saldo_credito, fecha_actualizacion)
    VALUES (UNHEX(REPLACE(UUID(),'-','')), v_sus, NEW.cuenta_id, v_per, NEW.debito, NEW.credito, CURRENT_TIMESTAMP)
  ON DUPLICATE KEY UPDATE
    saldo_debito = saldo_debito + NEW.debito,
    saldo_credito = saldo_credito + NEW.credito,
    fecha_actualizacion = CURRENT_TIMESTAMP();

  -- registrar auditoría (datos_nuevos como JSON textual)
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    v_sus,
    NULL,
    'Inserción de detalle contable',
    'insert',
    'movimiento_detalle',
    NEW.id,
    CONCAT('Línea contable en movimiento ', HEX(NEW.movimiento_id)),
    JSON_OBJECT(
      'movimiento_id', HEX(NEW.movimiento_id),
      'cuenta_id', HEX(NEW.cuenta_id),
      'debito', NEW.debito,
      'credito', NEW.credito,
      'descripcion', IFNULL(NEW.descripcion,'')
    ),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_md_update` AFTER UPDATE ON `movimiento_detalle` FOR EACH ROW BEGIN
  DECLARE v_sus_old BINARY(16);
  DECLARE v_per_old BINARY(16);
  DECLARE v_sus_new BINARY(16);
  DECLARE v_per_new BINARY(16);

  SELECT suscriptor_id, periodo_id INTO v_sus_old, v_per_old FROM movimientos_contables WHERE id = OLD.movimiento_id LIMIT 1;
  SELECT suscriptor_id, periodo_id INTO v_sus_new, v_per_new FROM movimientos_contables WHERE id = NEW.movimiento_id LIMIT 1;

  -- restar valores antiguos
  UPDATE saldos_cuentas
  SET saldo_debito = saldo_debito - OLD.debito,
      saldo_credito = saldo_credito - OLD.credito,
      fecha_actualizacion = CURRENT_TIMESTAMP
  WHERE suscriptor_id = v_sus_old AND cuenta_id = OLD.cuenta_id AND periodo_id = v_per_old;

  -- sumar valores nuevos
  INSERT INTO saldos_cuentas (id, suscriptor_id, cuenta_id, periodo_id, saldo_debito, saldo_credito, fecha_actualizacion)
    VALUES (UNHEX(REPLACE(UUID(),'-','')), v_sus_new, NEW.cuenta_id, v_per_new, NEW.debito, NEW.credito, CURRENT_TIMESTAMP)
  ON DUPLICATE KEY UPDATE
    saldo_debito = saldo_debito + NEW.debito,
    saldo_credito = saldo_credito + NEW.credito,
    fecha_actualizacion = CURRENT_TIMESTAMP();

  -- auditoría: datos antiguos y nuevos
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    v_sus_new,
    NULL,
    'Actualización de detalle contable',
    'update',
    'movimiento_detalle',
    NEW.id,
    CONCAT('Actualización línea contable en movimiento ', HEX(NEW.movimiento_id)),
    JSON_OBJECT(
      'movimiento_id', HEX(OLD.movimiento_id),
      'cuenta_id', HEX(OLD.cuenta_id),
      'debito', OLD.debito,
      'credito', OLD.credito,
      'descripcion', IFNULL(OLD.descripcion,'')
    ),
    JSON_OBJECT(
      'movimiento_id', HEX(NEW.movimiento_id),
      'cuenta_id', HEX(NEW.cuenta_id),
      'debito', NEW.debito,
      'credito', NEW.credito,
      'descripcion', IFNULL(NEW.descripcion,'')
    ),
    'sistema'
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `factura_id` binary(16) NOT NULL,
  `fecha_pago` date NOT NULL,
  `valor_pagado` decimal(15,2) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `cuenta_bancaria_id` binary(16) DEFAULT NULL,
  `referencia_pago` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `usuario_registro_id` binary(16) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Registro de pagos realizados a las facturas';

--
-- Disparadores `pagos`
--
DELIMITER $$
CREATE TRIGGER `trg_aud_pagos_delete` AFTER DELETE ON `pagos` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    OLD.suscriptor_id,
    NULL,
    'Eliminación de pago',
    'delete',
    'pagos',
    OLD.id,
    CONCAT('Eliminación pago ', HEX(OLD.id)),
    JSON_OBJECT('factura_id', HEX(OLD.factura_id), 'valor_pagado', OLD.valor_pagado, 'fecha_pago', CAST(OLD.fecha_pago AS CHAR)),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_pagos_insert` AFTER INSERT ON `pagos` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    NEW.suscriptor_id,
    NEW.usuario_registro_id,
    'Registro de pago',
    'insert',
    'pagos',
    NEW.id,
    CONCAT('Pago registrado para factura ', HEX(NEW.factura_id)),
    JSON_OBJECT('factura_id', HEX(NEW.factura_id), 'valor_pagado', NEW.valor_pagado, 'fecha_pago', CAST(NEW.fecha_pago AS CHAR)),
    'sistema'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_aud_pagos_update` AFTER UPDATE ON `pagos` FOR EACH ROW BEGIN
  INSERT INTO auditoria (id, suscriptor_id, usuario_id, accion, accion_tipo, tabla_afectada, registro_id, descripcion, datos_antiguos, datos_nuevos, origen_app)
  VALUES (
    UNHEX(REPLACE(UUID(),'-','')),
    NEW.suscriptor_id,
    NEW.usuario_registro_id,
    'Actualización de pago',
    'update',
    'pagos',
    NEW.id,
    CONCAT('Actualización de pago ', HEX(NEW.id)),
    JSON_OBJECT('valor_old', OLD.valor_pagado, 'fecha_old', CAST(OLD.fecha_pago AS CHAR)),
    JSON_OBJECT('valor_new', NEW.valor_pagado, 'fecha_new', CAST(NEW.fecha_pago AS CHAR)),
    'sistema'
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parametros_contables`
--

CREATE TABLE `parametros_contables` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `tipo_parametro` varchar(100) NOT NULL,
  `cuenta_id` binary(16) NOT NULL,
  `centro_costo_id` binary(16) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidas_presupuestales`
--

CREATE TABLE `partidas_presupuestales` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `monto_aprobado` decimal(18,2) NOT NULL DEFAULT 0.00,
  `saldo` decimal(18,2) NOT NULL DEFAULT 0.00,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Partidas para control presupuestal';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodos_contables`
--

CREATE TABLE `periodos_contables` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ano` int(11) NOT NULL,
  `mes` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('abierto','cerrado','bloqueado') NOT NULL DEFAULT 'abierto',
  `estado_id` binary(16) DEFAULT NULL,
  `fecha_cierre` timestamp NULL DEFAULT NULL,
  `usuario_cierre_id` binary(16) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Períodos fiscales (mensuales) por suscriptor';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_cuentas`
--

CREATE TABLE `plan_cuentas` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `es_plantilla` tinyint(1) NOT NULL DEFAULT 0,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('activo','pasivo','patrimonio','ingreso','gasto','costo','orden') NOT NULL,
  `naturaleza` enum('D','C') DEFAULT NULL,
  `nivel` int(11) NOT NULL DEFAULT 1,
  `categoria_nivel` enum('clase','grupo','cuenta','subcuenta','auxiliar') NOT NULL DEFAULT 'auxiliar',
  `ruta` varchar(255) DEFAULT NULL,
  `ruta_codigo` varchar(255) DEFAULT NULL,
  `padre_id` binary(16) DEFAULT NULL,
  `registra_tercero` tinyint(1) NOT NULL DEFAULT 0,
  `requiere_centro_costo` tinyint(1) NOT NULL DEFAULT 0,
  `requiere_presupuesto` tinyint(1) NOT NULL DEFAULT 0,
  `niif_categoria_id` binary(16) DEFAULT NULL,
  `puc_categoria_id` binary(16) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Plan de cuentas contables por suscriptor';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_cuentas_exogena`
--

CREATE TABLE `plan_cuentas_exogena` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `cuenta_id` binary(16) NOT NULL,
  `exogena_id` binary(16) NOT NULL,
  `formato` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Relación entre cuentas y formatos exogena';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prefijos`
--

CREATE TABLE `prefijos` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `tipo_transaccion_id` binary(16) NOT NULL,
  `prefijo` varchar(20) NOT NULL,
  `numeracion_actual` int(11) NOT NULL DEFAULT 1,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Prefijos y numeración para documentos';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `zona_comun_id` binary(16) NOT NULL,
  `unidad_id` binary(16) NOT NULL,
  `usuario_solicita_id` binary(16) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('pendiente','aprobada','cancelada','cumplida') NOT NULL DEFAULT 'pendiente',
  `observaciones` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Reservas de las zonas comunes';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Roles de usuario por suscriptor';

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `suscriptor_id`, `nombre`, `descripcion`, `fecha_creacion`) VALUES
(0x35353065383430302d653239622d3431, 0x35353065383430302d653239622d3431, 'Administrador', 'Usuario con acceso completo al sistema', '2025-11-07 00:17:09'),
(0x36363065383430302d653239622d3431, 0x36363065383430302d653239622d3431, 'Administrador', 'Usuario con acceso completo al sistema', '2025-11-07 17:24:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saldos_cuentas`
--

CREATE TABLE `saldos_cuentas` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `cuenta_id` binary(16) NOT NULL,
  `periodo_id` binary(16) NOT NULL,
  `saldo_debito` decimal(18,2) NOT NULL DEFAULT 0.00,
  `saldo_credito` decimal(18,2) NOT NULL DEFAULT 0.00,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscriptores`
--

CREATE TABLE `suscriptores` (
  `id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `subdominio` varchar(50) DEFAULT NULL,
  `email_contacto` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla principal de clientes (copropiedades) del SaaS';

--
-- Volcado de datos para la tabla `suscriptores`
--

INSERT INTO `suscriptores` (`id`, `nombre`, `nit`, `subdominio`, `email_contacto`, `direccion`, `telefono`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(0x35353065383430302d653239622d3431, 'Edificio Torres del Parque', '900123456', 'torres-del-parque', 'admin@torresdelparque.com', 'Calle 123 #45-67, Cali', '+57 301 234 5678', 1, '2025-11-07 00:17:09', '2025-11-07 00:25:08'),
(0x36363065383430302d653239622d3431, 'Conjunto Residencial Los Alamos', '900987654', 'los-alamos', 'admin@losalamos.com', 'Carrera 45 #12-34, Medellín', '+57 304 567 8901', 1, '2025-11-07 17:24:04', '2025-11-07 17:25:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terceros`
--

CREATE TABLE `terceros` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `tipo_persona` enum('natural','juridica') NOT NULL,
  `tipo_identificacion` varchar(50) NOT NULL,
  `numero_identificacion` varchar(50) NOT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Proveedores, propietarios y otros terceros por suscriptor';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_comprobantes`
--

CREATE TABLE `tipos_comprobantes` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tipos de comprobantes contables (Ej: Factura, Nota Crédito)';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_transaccion`
--

CREATE TABLE `tipos_transaccion` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tipos de transacción para numeración de documentos';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades`
--

CREATE TABLE `unidades` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `codigo_unidad` varchar(30) NOT NULL,
  `tipo_unidad` varchar(50) DEFAULT NULL,
  `propietario_id` binary(16) DEFAULT NULL,
  `inquilino_id` binary(16) DEFAULT NULL,
  `area` decimal(10,2) DEFAULT NULL,
  `coeficiente` decimal(5,4) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Unidades inmobiliarias de cada copropiedad';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `idioma_preferido` varchar(10) DEFAULT NULL,
  `rol_id` binary(16) DEFAULT NULL,
  `suscriptor_id` binary(16) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `intentos_fallidos` int(11) NOT NULL DEFAULT 0,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `ultimo_login` timestamp NULL DEFAULT NULL,
  `ultimo_cambio_password` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Usuarios del sistema y de los suscriptores';

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `nit`, `password`, `telefono`, `idioma_preferido`, `rol_id`, `suscriptor_id`, `activo`, `intentos_fallidos`, `bloqueado`, `ultimo_login`, `ultimo_cambio_password`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(0x35353065383430302d653239622d3431, 'Admin', 'Sistema', 'admin@gravi.com', '1234567890', 'admin123', '+57 300 123 4567', NULL, 0x35353065383430302d653239622d3431, 0x35353065383430302d653239622d3431, 1, 0, 0, NULL, NULL, '2025-11-07 00:17:09', '2025-11-07 00:38:15'),
(0x36363065383430302d653239622d3431, 'María', 'González', 'maria@losalamos.com', '1987654321', 'admin456', '+57 305 678 9012', NULL, 0x36363065383430302d653239622d3431, 0x36363065383430302d653239622d3431, 1, 0, 0, NULL, NULL, '2025-11-07 17:24:04', '2025-11-07 17:24:04');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_facturas_resumen`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_facturas_resumen` (
`id` binary(16)
,`suscriptor_id` binary(16)
,`numero_factura` varchar(50)
,`prefijo_id` binary(16)
,`tipo_documento` enum('factura','nota_credito','nota_debito','otro')
,`tercero_id` binary(16)
,`unidad_id` binary(16)
,`periodo_id` binary(16)
,`fecha_factura` date
,`fecha_vencimiento` date
,`total` decimal(15,2)
,`saldo_pendiente` decimal(15,2)
,`estado` enum('pendiente','pagada','vencida','anulada')
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zonas_comunes`
--

CREATE TABLE `zonas_comunes` (
  `id` binary(16) NOT NULL,
  `suscriptor_id` binary(16) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `capacidad_maxima` int(11) DEFAULT NULL,
  `estado` enum('disponible','no_disponible','en_mantenimiento') NOT NULL DEFAULT 'disponible',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Zonas comunes disponibles para reserva';

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_facturas_resumen`
--
DROP TABLE IF EXISTS `vw_facturas_resumen`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_facturas_resumen`  AS SELECT `f`.`id` AS `id`, `f`.`suscriptor_id` AS `suscriptor_id`, `f`.`numero_factura` AS `numero_factura`, `f`.`prefijo_id` AS `prefijo_id`, `f`.`tipo_documento` AS `tipo_documento`, `f`.`tercero_id` AS `tercero_id`, `f`.`unidad_id` AS `unidad_id`, `f`.`periodo_id` AS `periodo_id`, `f`.`fecha_factura` AS `fecha_factura`, `f`.`fecha_vencimiento` AS `fecha_vencimiento`, `f`.`total` AS `total`, `f`.`saldo_pendiente` AS `saldo_pendiente`, `f`.`estado` AS `estado` FROM `facturas` AS `f` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_auditoria_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_auditoria_fecha` (`fecha`),
  ADD KEY `idx_auditoria_accion_tipo` (`accion_tipo`),
  ADD KEY `idx_auditoria_correlacion` (`correlacion_id`),
  ADD KEY `idx_aud_tabla_fecha` (`tabla_afectada`,`fecha`),
  ADD KEY `idx_aud_suscriptor_fecha` (`suscriptor_id`,`fecha`);

--
-- Indices de la tabla `bancos`
--
ALTER TABLE `bancos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_bancos_suscriptor_nombre` (`suscriptor_id`,`nombre`);

--
-- Indices de la tabla `catalogo_niif`
--
ALTER TABLE `catalogo_niif`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `catalogo_puc`
--
ALTER TABLE `catalogo_puc`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `catalog_estado`
--
ALTER TABLE `catalog_estado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `centros_costo`
--
ALTER TABLE `centros_costo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_centros_costo_nombre` (`suscriptor_id`,`nombre`),
  ADD KEY `idx_centros_costo_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `conceptos_exogena`
--
ALTER TABLE `conceptos_exogena`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conceptos_exogena_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `conceptos_factura`
--
ALTER TABLE `conceptos_factura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cuenta_id` (`cuenta_id`),
  ADD KEY `centro_costo_id` (`centro_costo_id`),
  ADD KEY `idx_conceptos_factura` (`factura_id`),
  ADD KEY `idx_cf_sus` (`suscriptor_id`);

--
-- Indices de la tabla `conceptos_ph`
--
ALTER TABLE `conceptos_ph`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cuenta_id` (`cuenta_id`),
  ADD KEY `centro_costo_id` (`centro_costo_id`),
  ADD KEY `idx_conceptos_ph_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `configuracion_suscriptor`
--
ALTER TABLE `configuracion_suscriptor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_configuracion_clave` (`suscriptor_id`,`categoria`,`clave`),
  ADD KEY `idx_configuracion_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `cuentas_bancarias`
--
ALTER TABLE `cuentas_bancarias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_cuentas_banco_numero` (`suscriptor_id`,`numero_cuenta`),
  ADD KEY `banco_id` (`banco_id`);

--
-- Indices de la tabla `documentos_electronicos`
--
ALTER TABLE `documentos_electronicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `suscriptor_id` (`suscriptor_id`),
  ADD KEY `idx_doc_electronicos_estado` (`estado_envio`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_facturas_numero` (`suscriptor_id`,`numero_factura`),
  ADD KEY `unidad_id` (`unidad_id`),
  ADD KEY `idx_facturas_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_facturas_tercero_estado` (`tercero_id`,`estado`),
  ADD KEY `idx_facturas_prefijo` (`prefijo_id`),
  ADD KEY `idx_facturas_periodo_estado` (`periodo_id`,`estado`),
  ADD KEY `fk_fact_estado` (`estado_id`);

--
-- Indices de la tabla `movimientos_contables`
--
ALTER TABLE `movimientos_contables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_movimientos_numero` (`suscriptor_id`,`numero`),
  ADD UNIQUE KEY `seq` (`seq`),
  ADD KEY `usuario_creacion_id` (`usuario_creacion_id`),
  ADD KEY `centro_costo_id` (`centro_costo_id`),
  ADD KEY `partida_presupuestal_id` (`partida_presupuestal_id`),
  ADD KEY `idx_movimientos_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_movimientos_periodo_estado` (`periodo_id`,`estado`),
  ADD KEY `idx_movimientos_origen` (`origen_transaccion`),
  ADD KEY `idx_movimientos_suscriptor_periodo` (`suscriptor_id`,`periodo_id`),
  ADD KEY `fk_mov_estado` (`estado_id`);

--
-- Indices de la tabla `movimiento_detalle`
--
ALTER TABLE `movimiento_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cuenta_id` (`cuenta_id`),
  ADD KEY `tercero_id` (`tercero_id`),
  ADD KEY `centro_costo_id` (`centro_costo_id`),
  ADD KEY `idx_detalle_movimiento` (`movimiento_id`),
  ADD KEY `idx_detalle_movimiento_mov` (`movimiento_id`,`orden`),
  ADD KEY `idx_md_sus` (`suscriptor_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `suscriptor_id` (`suscriptor_id`),
  ADD KEY `idx_pagos_factura` (`factura_id`),
  ADD KEY `idx_pagos_fecha` (`fecha_pago`),
  ADD KEY `idx_pagos_usuario` (`usuario_registro_id`),
  ADD KEY `idx_pagos_factura_valor` (`factura_id`,`valor_pagado`);

--
-- Indices de la tabla `parametros_contables`
--
ALTER TABLE `parametros_contables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_parametros_tipo` (`suscriptor_id`,`tipo_parametro`),
  ADD KEY `cuenta_id` (`cuenta_id`),
  ADD KEY `centro_costo_id` (`centro_costo_id`);

--
-- Indices de la tabla `partidas_presupuestales`
--
ALTER TABLE `partidas_presupuestales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_partidas_presupuestales_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `periodos_contables`
--
ALTER TABLE `periodos_contables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_periodos_ano_mes` (`suscriptor_id`,`ano`,`mes`),
  ADD KEY `usuario_cierre_id` (`usuario_cierre_id`),
  ADD KEY `idx_periodos_suscriptor` (`suscriptor_id`),
  ADD KEY `fk_per_estado` (`estado_id`);

--
-- Indices de la tabla `plan_cuentas`
--
ALTER TABLE `plan_cuentas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_plan_cuentas_codigo` (`suscriptor_id`,`codigo`),
  ADD KEY `padre_id` (`padre_id`),
  ADD KEY `idx_pc_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_pc_ruta` (`ruta`),
  ADD KEY `idx_pc_plantilla` (`es_plantilla`);

--
-- Indices de la tabla `plan_cuentas_exogena`
--
ALTER TABLE `plan_cuentas_exogena`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_plan_cuentas_exogena` (`suscriptor_id`,`cuenta_id`,`exogena_id`),
  ADD KEY `cuenta_id` (`cuenta_id`),
  ADD KEY `exogena_id` (`exogena_id`);

--
-- Indices de la tabla `prefijos`
--
ALTER TABLE `prefijos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_prefijos_tipo` (`suscriptor_id`,`tipo_transaccion_id`),
  ADD KEY `tipo_transaccion_id` (`tipo_transaccion_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unidad_id` (`unidad_id`),
  ADD KEY `usuario_solicita_id` (`usuario_solicita_id`),
  ADD KEY `idx_reservas_zona_fecha` (`zona_comun_id`,`fecha_reserva`),
  ADD KEY `idx_reservas_suscriptor_estado` (`suscriptor_id`,`estado`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_roles_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `saldos_cuentas`
--
ALTER TABLE `saldos_cuentas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_saldo` (`suscriptor_id`,`cuenta_id`,`periodo_id`),
  ADD KEY `cuenta_id` (`cuenta_id`),
  ADD KEY `periodo_id` (`periodo_id`);

--
-- Indices de la tabla `suscriptores`
--
ALTER TABLE `suscriptores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nit` (`nit`),
  ADD UNIQUE KEY `subdominio` (`subdominio`),
  ADD KEY `idx_suscriptores_nit` (`nit`),
  ADD KEY `idx_suscriptores_subdominio` (`subdominio`);

--
-- Indices de la tabla `terceros`
--
ALTER TABLE `terceros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_terceros_identificacion` (`suscriptor_id`,`numero_identificacion`),
  ADD KEY `idx_terceros_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_terceros_numero_ident` (`suscriptor_id`,`numero_identificacion`);

--
-- Indices de la tabla `tipos_comprobantes`
--
ALTER TABLE `tipos_comprobantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipos_comprobantes_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `tipos_transaccion`
--
ALTER TABLE `tipos_transaccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipos_transaccion_suscriptor` (`suscriptor_id`);

--
-- Indices de la tabla `unidades`
--
ALTER TABLE `unidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_unidades_codigo` (`suscriptor_id`,`codigo_unidad`),
  ADD KEY `inquilino_id` (`inquilino_id`),
  ADD KEY `idx_unidades_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_unidades_propietario` (`propietario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `rol_id` (`rol_id`),
  ADD KEY `idx_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_suscriptor` (`suscriptor_id`),
  ADD KEY `idx_usuarios_bloqueado` (`bloqueado`),
  ADD KEY `idx_usuarios_ultimo_login` (`ultimo_login`);

--
-- Indices de la tabla `zonas_comunes`
--
ALTER TABLE `zonas_comunes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_zonas_comunes_suscriptor` (`suscriptor_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `movimientos_contables`
--
ALTER TABLE `movimientos_contables`
  MODIFY `seq` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `auditoria_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `bancos`
--
ALTER TABLE `bancos`
  ADD CONSTRAINT `bancos_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `centros_costo`
--
ALTER TABLE `centros_costo`
  ADD CONSTRAINT `centros_costo_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conceptos_exogena`
--
ALTER TABLE `conceptos_exogena`
  ADD CONSTRAINT `conceptos_exogena_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conceptos_factura`
--
ALTER TABLE `conceptos_factura`
  ADD CONSTRAINT `conceptos_factura_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conceptos_factura_ibfk_2` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas` (`id`),
  ADD CONSTRAINT `conceptos_factura_ibfk_3` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cf_sus` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`);

--
-- Filtros para la tabla `conceptos_ph`
--
ALTER TABLE `conceptos_ph`
  ADD CONSTRAINT `conceptos_ph_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conceptos_ph_ibfk_2` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conceptos_ph_ibfk_3` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `configuracion_suscriptor`
--
ALTER TABLE `configuracion_suscriptor`
  ADD CONSTRAINT `configuracion_suscriptor_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cuentas_bancarias`
--
ALTER TABLE `cuentas_bancarias`
  ADD CONSTRAINT `cuentas_bancarias_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cuentas_bancarias_ibfk_2` FOREIGN KEY (`banco_id`) REFERENCES `bancos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `documentos_electronicos`
--
ALTER TABLE `documentos_electronicos`
  ADD CONSTRAINT `documentos_electronicos_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`tercero_id`) REFERENCES `terceros` (`id`),
  ADD CONSTRAINT `facturas_ibfk_3` FOREIGN KEY (`unidad_id`) REFERENCES `unidades` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `facturas_ibfk_4` FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contables` (`id`),
  ADD CONSTRAINT `fk_fact_estado` FOREIGN KEY (`estado_id`) REFERENCES `catalog_estado` (`id`);

--
-- Filtros para la tabla `movimientos_contables`
--
ALTER TABLE `movimientos_contables`
  ADD CONSTRAINT `fk_mov_estado` FOREIGN KEY (`estado_id`) REFERENCES `catalog_estado` (`id`),
  ADD CONSTRAINT `movimientos_contables_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `movimientos_contables_ibfk_2` FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contables` (`id`),
  ADD CONSTRAINT `movimientos_contables_ibfk_3` FOREIGN KEY (`usuario_creacion_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `movimientos_contables_ibfk_4` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `movimientos_contables_ibfk_5` FOREIGN KEY (`partida_presupuestal_id`) REFERENCES `partidas_presupuestales` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `movimiento_detalle`
--
ALTER TABLE `movimiento_detalle`
  ADD CONSTRAINT `fk_md_sus` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`),
  ADD CONSTRAINT `movimiento_detalle_ibfk_1` FOREIGN KEY (`movimiento_id`) REFERENCES `movimientos_contables` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `movimiento_detalle_ibfk_2` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas` (`id`),
  ADD CONSTRAINT `movimiento_detalle_ibfk_3` FOREIGN KEY (`tercero_id`) REFERENCES `terceros` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `movimiento_detalle_ibfk_4` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_3` FOREIGN KEY (`usuario_registro_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `parametros_contables`
--
ALTER TABLE `parametros_contables`
  ADD CONSTRAINT `parametros_contables_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parametros_contables_ibfk_2` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas` (`id`),
  ADD CONSTRAINT `parametros_contables_ibfk_3` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costo` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `partidas_presupuestales`
--
ALTER TABLE `partidas_presupuestales`
  ADD CONSTRAINT `partidas_presupuestales_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `periodos_contables`
--
ALTER TABLE `periodos_contables`
  ADD CONSTRAINT `fk_per_estado` FOREIGN KEY (`estado_id`) REFERENCES `catalog_estado` (`id`),
  ADD CONSTRAINT `periodos_contables_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `periodos_contables_ibfk_2` FOREIGN KEY (`usuario_cierre_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `plan_cuentas`
--
ALTER TABLE `plan_cuentas`
  ADD CONSTRAINT `plan_cuentas_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plan_cuentas_ibfk_2` FOREIGN KEY (`padre_id`) REFERENCES `plan_cuentas` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `plan_cuentas_exogena`
--
ALTER TABLE `plan_cuentas_exogena`
  ADD CONSTRAINT `plan_cuentas_exogena_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plan_cuentas_exogena_ibfk_2` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plan_cuentas_exogena_ibfk_3` FOREIGN KEY (`exogena_id`) REFERENCES `conceptos_exogena` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `prefijos`
--
ALTER TABLE `prefijos`
  ADD CONSTRAINT `prefijos_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prefijos_ibfk_2` FOREIGN KEY (`tipo_transaccion_id`) REFERENCES `tipos_transaccion` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`zona_comun_id`) REFERENCES `zonas_comunes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`unidad_id`) REFERENCES `unidades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_4` FOREIGN KEY (`usuario_solicita_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `saldos_cuentas`
--
ALTER TABLE `saldos_cuentas`
  ADD CONSTRAINT `saldos_cuentas_ibfk_1` FOREIGN KEY (`cuenta_id`) REFERENCES `plan_cuentas` (`id`),
  ADD CONSTRAINT `saldos_cuentas_ibfk_2` FOREIGN KEY (`periodo_id`) REFERENCES `periodos_contables` (`id`);

--
-- Filtros para la tabla `terceros`
--
ALTER TABLE `terceros`
  ADD CONSTRAINT `terceros_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tipos_comprobantes`
--
ALTER TABLE `tipos_comprobantes`
  ADD CONSTRAINT `tipos_comprobantes_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tipos_transaccion`
--
ALTER TABLE `tipos_transaccion`
  ADD CONSTRAINT `tipos_transaccion_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `unidades`
--
ALTER TABLE `unidades`
  ADD CONSTRAINT `unidades_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `unidades_ibfk_2` FOREIGN KEY (`propietario_id`) REFERENCES `terceros` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `unidades_ibfk_3` FOREIGN KEY (`inquilino_id`) REFERENCES `terceros` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `zonas_comunes`
--
ALTER TABLE `zonas_comunes`
  ADD CONSTRAINT `zonas_comunes_ibfk_1` FOREIGN KEY (`suscriptor_id`) REFERENCES `suscriptores` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
