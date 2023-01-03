import express from "express";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/cart.js";
import userRouter from "./routes/user.js";
import otherRouter from "./routes/other.js"
import session from "express-session";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoStore from "connect-mongo";
import compression from "compression";
import minimist from "minimist";
import logger from './loggers/Log4jsLogger.js'
import loggerMiddleware from './middlewares/routesLogger.middleware.js'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { UsuariosDao } from "./dao/usuarioDao.js";
import bcrypt from 'bcrypt'

const app = express();

const users = new UsuariosDao()
const __filename = fileURLToPath(import.meta.url);
const ___dirname = path.dirname(__filename);

// ----- PASSPORT ------

passport.use('register', new Strategy({
  passReqToCallback: true
}, async (req, username, password, done) => {
   
    const usuario = await users.findUser(username)
    if (usuario) {
      return done('Este usuario ya existe')
    }
    // BCRYPT pass
    // const saltRounds = 10
    // const savedUser = bcrypt.genSalt(saltRounds, function(err, salt) {
    //   bcrypt.hash(password, salt, async function(err, hash) {
    //       // Store hash in your password DB.
    //     });
    //   }); 

    const user = {
      username,
      password,
    }
    const saveUser = await users.registerUser(user)
    return done(null, user)
}))

passport.use('login', new Strategy({
  passReqToCallback: true
}, async (req, username, password, done) => {
  
  // BCRYPT COMPARE pass
  // console.log(username, password)
  //   const passcrypt = bcrypt.compare(password, password, function(err, result) {
  //     result == true
  // });

  const user = await users.logUser(username, password)
  if (!user) {
    return done(null, false)
  }
  if (user.password != password) {
    return done(null, false)
  }
  return done(null, user)
}))

passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser( async (user,done) => {
  const usuario = await users.findUser(user)
  done(null, usuario)
})

// // Handlebars options
app.set("views", "./src/views/pages");
app.set("view engine", ".hbs");

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: ___dirname + "/views/layouts",
    partialsDir: ___dirname + "/views/partials",
  }));

app.use(
  session({
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      options: {
        userNewParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }, //10 min.
  }));

app.use(loggerMiddleware);
app.use(express.static("public"));
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productRouter);
app.use("/api/carritos", cartRouter);
app.use("/api/usuarios", userRouter);
app.use("/test", otherRouter)

app.use(passport.initialize());
app.use(passport.session());

app.all('*', (req, res) => {
  res.status(404).json({"error":"ruta no existente"})
})

// Leer el puerto por consola o setear default

const options = {
  string: 'lang',
  boolean: ['version'],
  alias: {
    v: 'version',
    p: 'PORT',
  },
  default: {
    PORT: 8080
  }
}

app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(r.route.path)
  }
})


const commandLineArgs = process.argv.slice(2)
const args = minimist(commandLineArgs,options)
const { PORT } = args

const server = app.listen(PORT, () => {
  logger.info(`Escuchando en el puerto ${PORT}`);
});

server.on("error", (err) => logger.error(err));