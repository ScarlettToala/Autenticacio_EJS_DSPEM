
/*Sirve solo para asegurar que req.session exista (por ejemplo, si después otro middleware quiere guardar algo ahí, como req.session.user).*/
export default function sessionMiddleware(req, res, next) {
    if (!req.session ) {
        req.session = {};
    }
    next();
}
