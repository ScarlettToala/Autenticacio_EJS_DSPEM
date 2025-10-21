export default function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next(); // si hay usuario, deja pasar a la ruta
}
