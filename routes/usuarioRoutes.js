import express from 'express'
import { fromularioLogin, formularioRegistro, registrarUsuario } from '../controllers/usuarioController.js'; 
// Creamos el ruteador
const router = express.Router();

// Definimos las rutas necesaria para las peticiones del usuario, son ejemplo de llamado


// Ejemplo de un ENDPOINT GET
router.get("/", (req, res) => {
    console.log("Bienvenid@ al Sistema de Bienes Raices")
    console.log("Procesando una peticion del tipo GET");
    res.json({
        status: 200,
        message: "Solicitud recibida a través del método GET"
    })
})

// Ejemplo de un ENDPOINT POST
router.post("/", (req, res) => {
    console.log("Se ha recibido una petición del tipo POST.")
    res.json({
        status: 400,
        message: "Lo sentimos, no se aceptan peticiones POST."
    })
})

// Ejemplo de un ENDPOINT POST - Simular la creación de un nuevo usuario
router.post("/registro",registrarUsuario);
router.post("/createUser", (req, res) => {
    console.log("Se ha solicitado crear un nuevo usuario.")
    console.log("Procesando una peticion del tipo POST");
    const nuevoUsuario =
    {
        nombre: "Ingrid Natalia Martinez",
        correo: "natalia.martinez@gmail.com"
    }
    res.json({
        status: 200,
        message: `Se ha solicitado la creación de un usuario de nombre: ${nuevoUsuario.nombre} y correo: ${nuevoUsuario.correo}`
    })
})


// Ejemplo de un ENDPOINT PUT - Simular la actualización de los datos de un usuario creado
router.put("/updateUser", (req, res) => {
    console.log("Se ha solicitao la actualización de los datos del usuario, siendo PUT una actualización completa.")
    console.log("Procesando una peticion del tipo PUT");
    const usuario =
    {
        nombre: "Ingrid Natalia Martinez",
        correo: "natalia.martinez@gmail.com"
    }

    const usuarioActualizado =
    {
        nombre: "Berenice Carrasco",
        correo: "berenice.carrasco@gmail.com"
    }
    res.json({
        status: 200,
        message: `Se ha solicitado la actualización completa de los datos del usuario de nombre: ${usuario.nombre} y correo: ${usuario.correo} a  ${usuarioActualizado.nombre} y correo: ${usuarioActualizado.correo}`
    })
})


// Ejemplo de un ENDPOINT PATCH - Simular la actualización una contraseña del usuario
router.patch("/updatePassword/:nuevoPassword", (req, res) => {
    console.log("Se ha solicitao la actualización de los datos de la contraseña, siendo PATCH una actualización parcial.")
    console.log("Procesando una peticion del tipo PATCH");
    const usuario =
    {
        nombre: "Ingrid Natalia Martinez",
        correo: "natalia.martinez@gmail.com",
        password: "abcde"
    }

    const {nuevoPassword} = req.params
    
    res.json({
        status: 200,
        message: `Se ha solicitado la actualización parcial de la contraseña del usuario nombre: 
        ${usuario.nombre} y correo: ${usuario.correo} del password: ${usuario.password} a ${nuevoPassword}`
    })
})

//Ejemplo de un ENDPOINT del tipo DELETE 
router.delete("/deleteProperty/:id", (req,res)=>
{
    console.log("Procesando una petición del tipo DELETE");
    const {id}=req.params;

    res.json({
        status:200,
        message: `Se realizará la eliminacion de la propiedad: ${id}`
    })
})


router.get("/login", fromularioLogin);
router.get("/registro", formularioRegistro);
//router.get("/recuperarPassword", formulariorecuperarPassword);


router.get("/saludo/:nombre", (req, res) => {
    const { nombre } = req.params;
    console.log(`El usuario: ${nombre}`)
    res.status(200).send(`<p>Bienvenido <b>${nombre}</b></p> </h1>`)
})

export default router