/*
Este middleware verifica que el usuario tenga un JWT válido en la cookie access_token.

Si el token no existe o no es válido → redirige a /login.

Si es válido → decodifica el usuario y lo guarda en req.session.user.
*/

// middleware/protect.js
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config.js';

export default function requireAuth(req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY);
        req.session.user = { id: decoded.id, username: decoded.username };
        next();
    } catch (error) {
        return res.status(401).redirect('/login');
    }
}

