## Rutas del proyecto 

### Presentación de las visualizaciones
```bash
📁 proyecto
├── 📁 db
│   └── db.json 
|   └── User.json 
├── 📁 middleware
│   └── protect.js
|   └── session.js
├── 📁 public
│   └── 📁 css
|   └── 📁 js
|   └── 📁 img
├── 📁 routes
│   └── products.js
|   └── books.js
├── 📁 views
│   └── home.ejs
|   └── register.ejs
|   └── login.ejs   
|   └── protect.ejs
|   └── profile.ejs
|   └── products.ejs
|   └── detallProducte.ejs
|   └── edit_products.ejs
|   └── nou_product.ejs
├── server.js
├── request.http
├── package.json
├── user-repositoy.json
└── README.md
```

Como se observa en el anterior arbol esquematico, lo que se vera principalmente en el proyecto es un control de usuarios y mediante uan autentificación JWT y una cookie el usuario puede crear, modificar y eliminar elementos de una base de datos. 

Sin inciar sesión se podrá visusalizar los datos de los libros e inicar sesión o registrarse pero no se podrá acceder a otras rutas del proyecto ya que compreuba la existencia del token. 

Esto se hace mediante la autenticación que se puede ver en la carpeta de middlware. 
Entonces el archivo de protect hace los siguiente:
* El middleware verifica que el usuario tenga un JWT válido en la cookie access_token. Si el token no existe o no es válido → redirige a /login.
Si es válido → decodifica el usuario y lo guarda en req.session.user.
y el archvio de sesión se utiliza de la siguinete forma;

* Session sirve solo para asegurar que req.session exista (por ejemplo, si después otro middleware quiere guardar algo ahí, como req.session.user).

Posteriormente en la ruta se aplica lo siguiente:
```bash 
// Ejemplo de otra ruta protegida simple
app.get('/protected', requireAuth, (req, res) => {
    res.render('protected', { username: req.session.user.username });
});
```
Se utiliza una función para comprobar que exista un token.

Y una vez que se accede a protected ya puede acceder a las siguientes links de administrador. 

Para hacer las comprobaciones del CRUD de los productso se utilizño el Rest Client: Pero no las realiza porque requiere de un token por lo tanto siemrpe envia al formualario de login.

