// Importar módulos y dependencias
const express = require('express'); // Framework web para Node.js
const morgan = require('morgan'); // Middleware para registrar solicitudes HTTP
const path = require('path'); // Módulo para manejar y transformar rutas de archivos
const { engine } = require('express-handlebars'); // Motor de plantillas Handlebars para Express
const flash = require('connect-flash'); // Middleware para mensajes flash
const session = require('express-session'); // Middleware de manejo de sesiones
const MySQLStore = require('express-mysql-session')(session); // Almacén de sesiones en MySQL
const passport = require('passport'); // Middleware de autenticación

const { database } = require('./keys'); // Importar configuración de la base de datos desde el archivo 'keys'

// Inicialización
const app = express(); // Crear una instancia de Express
require('./lib/passport'); // Importar configuración de Passport

// Configuración
app.set('port', process.env.PORT || 4000); // Establecer el puerto de la aplicación, usar el puerto de entorno o 4000
app.set('views', path.join(__dirname, 'views')); // Establecer la ruta de las vistas

// Configuración del motor de plantillas Handlebars
app.engine('.hbs', engine({
  defaultLayout: 'main', // Diseño predeterminado
  layoutsDir: path.join(app.get('views'), 'layouts'), // Directorio de diseños
  partialsDir: path.join(app.get('views'), 'partials'), // Directorio de parciales
  extname: '.hbs', // Extensión de los archivos de plantilla
  helpers: require('./lib/handlebars') // Helpers para Handlebars
}));
app.set('view engine', '.hbs'); // Establecer Handlebars como el motor de plantillas

// Middleware: Procesar las solicitudes del cliente al servidor
app.use(session({
  secret: 'faztmysqlnodemysql', // Secreto para firmar la sesión
  resave: false, // No volver a guardar la sesión si no se modifica
  saveUninitialized: false, // No guardar una sesión no inicializada
  store: new MySQLStore(database) // Almacenar sesiones en la base de datos MySQL
}));
app.use(flash()); // Usar connect-flash para mensajes flash
app.use(morgan('dev')); // Usar morgan para registrar solicitudes HTTP en modo desarrollo
app.use(express.urlencoded({extended: false})); // Analizar cuerpos de solicitudes URL-encoded
app.use(express.json()); // Analizar cuerpos de solicitudes JSON
app.use(passport.initialize()); // Inicializar Passport
app.use(passport.session()); // Usar sesiones de Passport

// Variables globales
app.use((req, res, next) => {
  app.locals.success = req.flash('success'); // Mensaje flash de éxito
  app.locals.message = req.flash('message'); // Mensaje flash genérico
  app.locals.user = req.user; // Información del usuario autenticado
  next(); // Continuar al siguiente middleware
});

// Rutas
app.use(require('./routes/index')); // Rutas principales
app.use(require('./routes/authentication')); // Rutas de autenticación
app.use('/links', require('./routes/links')); // Rutas de enlaces, con prefijo '/links'

// Archivos públicos
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde el directorio 'public'

// Empezar el servidor
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`); // Mensaje en consola indicando que el servidor está en funcionamiento
});
