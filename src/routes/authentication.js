// Importar módulos y dependencias
const express = require('express'); // Importa Express
const router = express.Router(); // Crea un enrutador para manejar rutas
const passport = require('../lib/passport'); // Importa la configuración de Passport
const { isLoggedIn } = require('../lib/auth'); // Importa middleware de autenticación

// Ruta de registro
router.get('/signup', (req, res) => {
    res.render('auth/signup'); // Renderiza la vista 'signup' para el registro de usuarios
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // Redirige a /profile si el registro es exitoso
    failureRedirect: '/signup', // Redirige a /signup si el registro falla
    failureFlash: true // Habilita mensajes flash para errores
}));

// Ruta de inicio de sesión
router.get('/signin', (req, res) => {
    res.render('auth/signin'); // Renderiza la vista 'signin' para el inicio de sesión
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile', // Redirige a /profile si el inicio de sesión es exitoso
    failureRedirect: '/signin', // Redirige a /signin si el inicio de sesión falla
    failureFlash: true // Habilita mensajes flash para errores
}));

// Ruta del perfil
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile'); // Renderiza la vista 'profile' si el usuario está autenticado
});

// Ruta de cierre de sesión
router.get('/logout', (req, res, next) => {
    req.logOut(req.user, err => { // Cierra la sesión del usuario
        if (err) return next(err); // Maneja errores de cierre de sesión
        res.redirect("/signin"); // Redirige a la página de inicio de sesión
    });
});

module.exports = router; // Exporta el enrutador para usarlo en otros módulos
