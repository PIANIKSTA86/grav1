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

    const [users] = await connection.execute('SELECT id, nombre, email FROM usuarios');
    console.log('👥 Users in database:', users);

    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();