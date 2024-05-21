// Exporta un objeto con la configuración de la base de datos
module.exports = {
    
    // Configuración de la base de datos
    database: {
        host: 'localhost',     // Dirección del servidor de la base de datos (en este caso, el servidor local)
        user: 'root',          // Usuario de la base de datos (por defecto, el usuario administrador es 'root')
        password: '',          // Contraseña del usuario de la base de datos (vacío por defecto, aunque esto no es seguro en producción)
        database: 'database_links' // Nombre de la base de datos a la que se conectará
    }
};
