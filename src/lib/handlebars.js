// Importar la función 'format' de la biblioteca 'timeago.js'
const { format } = require('timeago.js');

// Objeto helpers para almacenar las funciones de ayuda
const helpers = {};

// Función para formatear una marca de tiempo usando timeago.js
helpers.timeago = (timestamp) => {
    // Llamar a la función 'format' de timeago.js y pasar la marca de tiempo
    return format(timestamp);
};

// Exportar el objeto helpers que contiene la función de ayuda para formatear marcas de tiempo
module.exports = helpers;
