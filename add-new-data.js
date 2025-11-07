import mysql from 'mysql2/promise';

async function addNewData() {
  let connection;
  try {
    console.log('Conectando a MySQL...');
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gravi'
    });

    console.log('Verificando datos existentes...');

    // Verificar suscriptores existentes
    const [existingSuscriptores] = await connection.execute('SELECT id, nombre, nit FROM suscriptores');
    console.log('Suscriptores existentes:', existingSuscriptores);

    // Verificar usuarios existentes
    const [existingUsuarios] = await connection.execute('SELECT id, nombre, email, nit FROM usuarios');
    console.log('Usuarios existentes:', existingUsuarios);

    console.log('Agregando nueva copropiedad...');

    // Intentar insertar nueva copropiedad
    try {
      await connection.execute(`
        INSERT INTO suscriptores (id, nombre, nit, subdominio, email_contacto, direccion, telefono, activo)
        VALUES ('660e8400-e29b-41d4-a716-446655440003', 'Conjunto Residencial Los Alamos', '900987654', 'los-alamos', 'admin@losalamos.com', 'Carrera 45 #12-34, Medellín', '+57 304 567 8901', 1)
      `);
      console.log('✅ Nueva copropiedad agregada');
    } catch (error) {
      console.log('⚠️  Copropiedad ya existe o error:', error.message);
    }

    console.log('Agregando rol para la nueva copropiedad...');

    // Insertar rol para la nueva copropiedad
    try {
      await connection.execute(`
        INSERT INTO roles (id, suscriptor_id, nombre, descripcion)
        VALUES ('660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Administrador', 'Usuario con acceso completo al sistema')
      `);
      console.log('✅ Nuevo rol agregado');
    } catch (error) {
      console.log('⚠️  Rol ya existe o error:', error.message);
    }

    console.log('Agregando nuevo usuario...');

    // Insertar nuevo usuario
    try {
      await connection.execute(`
        INSERT INTO usuarios (id, nombre, apellido, email, nit, password, telefono, rol_id, suscriptor_id, activo)
        VALUES ('660e8400-e29b-41d4-a716-446655440005', 'María', 'González', 'maria@losalamos.com', '1987654321', 'admin456', '+57 305 678 9012', '660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 1)
      `);
      console.log('✅ Nuevo usuario agregado');
    } catch (error) {
      console.log('⚠️  Usuario ya existe o error:', error.message);
    }

    console.log('Verificando datos finales...');

    // Verificar que se agregaron
    const [suscriptores] = await connection.execute('SELECT id, nombre, nit FROM suscriptores');
    console.log('🏢 Copropiedades finales:', suscriptores);

    const [usuarios] = await connection.execute('SELECT id, nombre, apellido, email, nit FROM usuarios');
    console.log('👥 Usuarios finales:', usuarios);

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addNewData();