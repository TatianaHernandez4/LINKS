// Importar Passport y estrategia de autenticación local
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Importar pool de conexiones a la base de datos y funciones de ayuda para encriptación de contraseñas
const pool = require('../database');
const helpers = require('../lib/helpers');

// Configurar estrategia de registro local
passport.use('local-signup', new LocalStrategy({
    usernameField: 'username', // Campo del nombre de usuario en el formulario
    passwordField: 'password', // Campo de la contraseña en el formulario
    passReqToCallback: true // Pasar la solicitud al callback
}, async (req, username, password, done) => {
    // Extraer datos del cuerpo de la solicitud
    const { fullname, fechanaci, correo, fono } = req.body;
    
    // Crear un nuevo usuario con los datos proporcionados
    const newUser = {
        username,
        password,
        fullname,
        fechanaci,
        correo,
        fono
    };
    
    // Encriptar la contraseña antes de guardarla en la base de datos
    newUser.password = await helpers.encryptPassword(password);
    
    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    
    // Asignar el ID generado al nuevo usuario
    newUser.id = result.insertId;
    
    // Devolver el nuevo usuario
    return done(null, newUser);
}));

// Configurar estrategia de inicio de sesión local
passport.use('local-signin', new LocalStrategy({
    usernameField: 'username', // Campo del nombre de usuario en el formulario
    passwordField: 'password', // Campo de la contraseña en el formulario
    passReqToCallback: true // Pasar la solicitud al callback
}, async (req, username, password, done) => {
    console.log(req.body);
    
    // Buscar un usuario con el nombre de usuario proporcionado en la base de datos
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    // Verificar si se encontró un usuario
    if (rows.length > 0) {
        const user = rows[0];
        
        // Verificar si la contraseña proporcionada coincide con la contraseña almacenada
        const validPassword = await helpers.matchPassword(password, user.password);
        
        // Comprobar si la contraseña es válida
        if (validPassword) {
            // Iniciar sesión de usuario
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            // Contraseña incorrecta
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        // El usuario no existe
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

// Serializar usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializar usuario para obtener datos de la sesión
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});

// Exportar configuración de Passport
module.exports = passport;
