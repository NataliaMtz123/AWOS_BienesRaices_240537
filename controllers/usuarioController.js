import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuarios.js";
import jwt from 'jsonwebtoken';

const fromularioLogin = (req,res)=>{
    res.render("auth/login", {pagina: "Inicia sesión con nosotros :)"});
}

const formularioRegistro=(req,res)=>{
    res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}

const registrarUsuario = async (req,res)=>{
   await check("nombreUsuario").notEmpty().withMessage("El nombre no puede estar vacío").run(req);
   await check("correoUsuario").isEmail().withMessage("Correo no válido").run(req);
   await check("contraseUsuario").isLength({min:8,max:30}).withMessage("Mínimo 8 caracteres").run(req);
   await check("confirmarContraseUsuario")
        .equals(req.body.contraseUsuario)
        .withMessage("Las contraseñas no coinciden")
        .run(req);

   let resultadoValidacion = validationResult(req);

   if(!resultadoValidacion.isEmpty()){
        return res.render("auth/registro", { 
            pagina: "Error al crear tu cuenta",
            errores: resultadoValidacion.array(),
            usuario: {
                nombreUsuario: req.body.nombreUsuario,
                correoUsuario: req.body.correoUsuario
            }
        });
   }

   const usuario = await Usuario.create({
        name: req.body.nombreUsuario,
        email: req.body.correoUsuario,
        password: req.body.contraseUsuario
   });

   res.json(usuario);
};

// PERFIL
const perfilUsuario = (req, res) => {
    if (!req.user) return res.redirect('/auth/login');

    res.render('perfil', {
        pagina: 'Mi Perfil',
        usuario: req.user
    });
};

// GOOGLE CALLBACK
const googleCallback = (req, res) => {

    const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.redirect('/auth/perfil');
};

// GITHUB CALLBACK
const githubCallback = (req, res) => {

    const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.redirect('/auth/perfil');
};

// LOGOUT 🔥
const logout = (req, res, next) => {

    const proveedor = req.user?.proveedor;

    req.logout(err => {
        if (err) return next(err);

        req.session.destroy(() => {

            // 🔥 BORRAR COOKIE DE SESIÓN
            res.clearCookie('connect.sid');

            // 🔥 BORRAR TU JWT
            res.clearCookie('_token');

            if (proveedor === 'github') {
                return res.redirect('https://github.com/logout');
            }

            if (proveedor === 'google') {
                //return res.redirect('https://accounts.google.com/Logout');
                return res.redirect('/auth/login');
            }

            return res.redirect('/auth/login');
        });
    });
};
    

export {
    fromularioLogin,
    formularioRegistro,
    registrarUsuario,
    googleCallback,
    githubCallback,
    logout,
    perfilUsuario
}