import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuarios.js";

const fromularioLogin = (req,res)=>{
    res.render("auth/login", {pagina: "Inicia sesión con nosotros :)"});
}

const formularioRegistro=(req,res)=>{
res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}

const registrarUsuario = async (req,res)=>{
   console.log("Procesando el registro de un nuevo usuario");
   console.log(req.body);

//Validacion de los datos del formulario previo a registro en la BD
//Definir reglas de validacion
await check("nombreUsuario").notEmpty().withMessage("El nombre de la persona no puede estar vacío").run(req);
await check("correoUsuario").notEmpty().withMessage("El correo del usuario no puede estar vacio").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req);
await check("contraseUsuario").notEmpty().withMessage("La contraseña parece estar vacia").isLength({min:8,max:30}).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
await check("confirmarContraseUsuario").equals(req.body.contraseUsuario).withMessage("Ambas contraseñas deben ser iguales").run(req)

//aplicamos las reglas definidas
let resultadoValidacion=validationResult(req);

//validar si hay errores en la recepción de datps, si no mandar a db
if(resultadoValidacion.isEmpty())
    {
const data=
   {
    name: req.body.nombreUsuario,
    email: req.body.correoUsuario,
    password: req.body.contraseUsuario
   }
const usuario=await Usuario.create(data);
res.json(usuario)
}
else
    res.render("auth/registro", { 
    pagina: "Error al al intentar crear tu cuenta",
    errores: resultadoValidacion.array(),
    usuario: {nombreUsuario: req.body.nombreUsuario, 
        correoUsuario: req.body.correoUsuario
    }});

    }
   


export {
    fromularioLogin,
    formularioRegistro,
    registrarUsuario
}
