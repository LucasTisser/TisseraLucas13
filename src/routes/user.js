import express from "express";
import { UsuariosDao } from '../dao/usuarioDao.js';
import passport from "passport";
import logger from "../loggers/Log4jsLogger.js";

const router = express.Router();
const usuarios = new UsuariosDao()

// GET /api/usuarios/register
router.get('/register', (req, res) => {
  res.render('register')
})

// POST api/usuarios/register
router.post('/register',passport.authenticate('register',{
  failureRedirect:'/api/usuarios/failregister',
  successRedirect: '/api/usuarios/login'
}))

// GET api/usuarios/failregister
router.get('/failregister', (req, res) => {
  res.render('register-error')
})

// GET /api/usuarios/login
router.get("/login", async (req, res) => {
  logger.info()
  res.render('login')
});

// POST /api/usuarios/login
router.post("/login", passport.authenticate('login', {
  failureRedirect: '/api/usuarios/faillogin',
  successRedirect:'/api/usuarios/datos'
}));

// GET /api/usuarios/faillogin
router.get('/faillogin', (req, res) => {
  res.render('login-error', {status: false})
})

// GET /api/usuarios/datos
router.get('/datos', async (req, res) => {

// usar updateCount en usuarios para almacenar 
// el contador de visitas en el usuario logeado

  const user = await usuarios.findUser(req.session.passport.user)

 if(!req.session.contador) {
   req.session.contador = 0
 } 
 req.session.contador++
  res.render('datos',{
    user : user.username,
    contador : req.session.contador,
    status: req.session.login= true
  })
})

// GET /api/usuarios/logout 
router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if(err){return err}
    res.render('home', {status: false})
  })
});

// GET /api/usuarios
router.get("/", async (req, res) => {
  if(!req.session.login){
    res.render("home", { status: req.session.login= false });
  } else {
    res.render("home", { status: req.session.login= true });
  }
});

export default router;