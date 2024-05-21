// Importar módulos y dependencias
const mysql = require('mysql'); // Importa el módulo mysql para interactuar con MySQL
const { promisify } = require('util'); // Importa promisify de util para convertir callbacks en promesas

const { database } = require('./keys'); // Importa la configuración de la base de datos desde el archivo 'keys'

// Crear un pool de conexiones a la base de datos
const pool = mysql.createPool(database);

// Manejo de la conexión al pool
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.'); // Error: la conexión con la base de datos fue cerrada
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections'); // Error: demasiadas conexiones a la base de datos
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused'); // Error: la conexión a la base de datos fue rechazada
    }
  }

  if (connection) connection.release(); // Libera la conexión si existe
  console.log('DB is Connected'); // Mensaje en consola indicando que la base de datos está conectada

  return;
});

// Promisify Pool Queries
pool.query = promisify(pool.query); // Convierte las consultas del pool para usar promesas en lugar de callbacks

module.exports = pool; // Exporta el pool de conexiones para usarlo en otros módulos
