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
   const data=
   {
    name: req.body.nombreUsuario,
    email: req.body.correoUsuario,
    password: req.body.contraseUsuario
   }
const usuario=await Usuario.create(data);
res.json(usuario)
}

export {
    fromularioLogin,
    formularioRegistro,
    registrarUsuario
}
