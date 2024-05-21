// Importar módulos y dependencias
const express = require('express'); // Importa Express
const router = express.Router(); // Crea un enrutador para manejar rutas

const pool = require('../database'); // Importa el pool de conexiones a la base de datos
const { isLoggedIn } = require('../lib/auth'); // Importa middleware de autenticación

// Ruta para mostrar el formulario de agregar enlace
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add'); // Renderiza la vista 'add' de enlaces
});

// Ruta para agregar un nuevo enlace
router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body; // Extrae datos del cuerpo de la solicitud
    const newLink = {
        title, 
        url,
        description,
        user_id: req.user.id // Asigna el ID del usuario autenticado
    };
    await pool.query('INSERT INTO links set ?', [newLink]); // Inserta el nuevo enlace en la base de datos
    req.flash('success', 'Link guardado correctamente'); // Envía mensaje flash de éxito
    res.redirect('/links'); // Redirige a la lista de enlaces
});

// Ruta para listar todos los enlaces del usuario autenticado
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]); // Selecciona enlaces del usuario
    res.render('links/list', { links }); // Renderiza la vista 'list' con los enlaces
});

// Ruta para eliminar un enlace por ID
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
    await pool.query('DELETE FROM links WHERE ID = ?', [id]); // Elimina el enlace de la base de datos
    req.flash('success', 'Link borrado correctamente'); // Envía mensaje flash de éxito
    res.redirect('/links'); // Redirige a la lista de enlaces
});

// Ruta para mostrar el formulario de edición de un enlace por ID
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]); // Selecciona el enlace por ID
    res.render('links/edit', { link: links[0] }); // Renderiza la vista 'edit' con los datos del enlace
});

// Ruta para actualizar un enlace por ID
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params; // Extrae el ID de los parámetros de la solicitud
    const { title, description, url } = req.body; // Extrae datos del cuerpo de la solicitud
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]); // Actualiza el enlace en la base de datos
    req.flash('success', 'Link actualizado correctamente'); // Envía mensaje flash de éxito
    res.redirect('/links'); // Redirige a la lista de enlaces
});

module.exports = router; // Exporta el enrutador para usarlo en otros módulos
