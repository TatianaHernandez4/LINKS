// Importar módulos y dependencias
const express = require('express'); // Importa Express
const router = express.Router(); // Crea un enrutador para manejar rutas

// Ruta para la página de inicio
router.get('/', (req, res) => {
    res.render('index'); // Renderiza la vista 'index'
});

module.exports = router; // Exporta el enrutador para usarlo en otros módulos
