module.exports = {
    // Función middleware para verificar si el usuario está autenticado
    isLoggedIn(req, res, next) {
        // Comprueba si el usuario está autenticado utilizando el método `isAuthenticated()` proporcionado por Passport
        if (req.isAuthenticated()) {
            // Si el usuario está autenticado, pasa al siguiente middleware
            return next();
        }
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        return res.redirect('/signin');
    }
};
