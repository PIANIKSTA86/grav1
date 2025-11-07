import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    console.log('Testing MySQL connection...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'gravi'
    });

    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Connection successful:', rows);

    const [users] = await connection.execute('SELECT id, nombre, apellido, email, nit FROM usuarios');
    console.log('👥 Users in database:', users);

    const [suscriptores] = await connection.execute('SELECT nombre, nit FROM suscriptores');
    console.log('🏢 Copropiedades in database:', suscriptores);

    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();