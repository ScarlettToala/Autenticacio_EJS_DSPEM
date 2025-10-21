import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config.js';

/*Busca el token en la cookie(access_token)*/

export default function sessionMiddleware(req, res, next) {
 const token = req.cookies.access_token
    req.session = { user: null }
    try {
        //si existe intenta verificar con jwt.verify si no eixste el user = null
        const data = jwt.verify(token, SECRET_JWT_KEY)
        req.session.user = data
    } catch (error) {
        req.session.user = null
    }
    next() //en caso de que no exista

    //Aquí la sesión está “simulada” usando JWT + cookie. 
}
