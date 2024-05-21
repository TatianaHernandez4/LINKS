// Importar bcrypt para la encriptación de contraseñas
const bcrypt = require('bcryptjs');

// Objeto helpers para almacenar las funciones de ayuda
const helpers = {};

// Función asincrónica para encriptar una contraseña
helpers.encryptPassword = async (password) => {
    // Generar un "salt" para la encriptación con 10 rondas
    const salt = await bcrypt.genSalt(10);
    // Encriptar la contraseña utilizando el salt generado
    const hash = await bcrypt.hash(password, salt);
    // Devolver la contraseña encriptada
    return hash;
};

// Función asincrónica para comparar una contraseña con una contraseña encriptada almacenada
helpers.matchPassword = async (password, savedPassword) => {
    try {
        // Comparar la contraseña proporcionada con la contraseña encriptada almacenada
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error); // Manejar errores de comparación de contraseñas
        return false; // Devolver falso si hay un error
    }
};

// Exportar el objeto helpers que contiene las funciones de ayuda
module.exports = helpers;
