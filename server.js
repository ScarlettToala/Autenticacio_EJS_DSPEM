import express from 'express';
import methodOverride from 'method-override';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/products.js';
import bookRoutes from './routes/books.js';
import { PORT, SECRET_JWT_KEY } from './config.js';
import { UserRepository } from './user-repository.js';
import sessionMiddleware from './middleware/session.js';
import requireAuth from './middleware/protect.js';

const app = express();

/* --- MIDDLEWARES GLOBALES --- */
app.use(express.json());                       // Para datos JSON
app.use(cookieParser());                       // Para leer cookies
app.use(express.static("public"));             // Archivos estáticos (CSS, imágenes, etc.)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(sessionMiddleware);                    // 👈 Verifica el token en cada petición

/* --- CONFIGURACIÓN DE VISTAS --- */
app.set('view engine', 'ejs');
app.set('views', './views');

/* --- RUTAS PROTEGIDAS --- */

// Proteger toda la sección de productos
app.use('/products', requireAuth, productRoutes);

// Ruta protegida para el perfil
app.get('/profile', requireAuth, (req, res) => {
    res.render('profile', {
        username: req.session.user.username,
        id: req.session.user.id
    });
});

// Ejemplo de otra ruta protegida simple
app.get('/protected', requireAuth, (req, res) => {
    res.render('protected', { username: req.session.user.username });
});


/* --- RUTAS PÚBLICAS --- */

// 📚 Libros sin protección
app.use('/book', bookRoutes);

// Página principal (accesible con o sin sesión)
app.get('/', (req, res) => {
    const { user } = req.session;
    res.render('home', { username: user ? user.username : null });
});

// Login y registro
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

/* --- AUTENTICACIÓN --- */
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserRepository.login({ username, password });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            { expiresIn: '1h' }
        );

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        })
            .redirect('/protected'); //  redirige al perfil tras login
    } catch (error) {
        res.status(401).send(error.message);
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await UserRepository.create({ username, password });
        res.redirect('/login');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/* --- LOGOUT --- */
app.get('/logout', (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    req.session = { user: null }; 
    res.redirect('/');
});



/* --- INICIO DEL SERVIDOR --- */
app.listen(PORT, () => {
    console.log(`✅ Server running on: http://localhost:${PORT}`);
});
