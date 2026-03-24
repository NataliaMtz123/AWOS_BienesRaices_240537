import {check, validationResult } from 'express-validator'
import Usuario from '../models/Usuarios.js'
import {generarToken,generarJWT} from '../lib/tokens.js'
import {emailRegistro, emailResetearPassword, emailDesbloqueoCuenta} from '../lib/emails.js'
import bcrypt from "bcrypt";
import { Op } from 'sequelize';

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Inicia sesión",
        usuario: {}
    });
}

const formularioRegistro = (req,res) =>
{
    res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}

const registrarUsuario = async(req,res) =>
{
    console.log("Intentando registrar a un Usuario Nuevo con los datos del formulario:");
    const {nombreUsuario:name, emailUsuario: email, passwordUsuario:password, confirmacionUsuario: confirmPassword} = req.body 

    // Validación de los datos del formulario previo a registro en la BD
    await check('nombreUsuario').notEmpty().withMessage("El nombre de la persona no puede ser vacío").run(req);
    await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    await check('passwordUsuario').notEmpty().withMessage("La contraseña parece estar vacía").isLength({ min: 8 , max:30}).withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres").run(req);
    await check('confirmacionUsuario').equals(password).withMessage("Ambas contraseñas deben ser iguales").run(req);

    let resultadoValidacion = validationResult(req);

    const existeUsuario = await Usuario.findOne({where: {email}})
  
    if(existeUsuario)
    {  
        return res.render("auth/registro", { 
            pagina: "Registrate con nosotros :) ", 
            errores: [{msg:` Ya existe un usuario asociado al correo: ${email}`}],
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    if(!resultadoValidacion.isEmpty())
    {
        return res.render("auth/registro", { 
            pagina: "Error al interar crear una cuenta.", 
            errores: resultadoValidacion.array(), 
            usuario: { nombreUsuario: name, emailUsuario: email }
        });
    }

    const data = {
        name, 
        email, 
        password,
        token: generarToken()
    }
    const usuario = await Usuario.create(data);

    //Enviar el correo electrónico
    emailRegistro({
        nombre: usuario.name,
        email: usuario.email,
        token: usuario.token
    })

    res.render("templates/mensaje",{
        title: "¡Bienvenid@ a BienesRaíces!",
        msg: `La cuenta asociada al correo: ${email}, se ha creado exitosamente, te pedimos confirmar tu a través del correo electrónico que te hemos enviado. `
    })
}

const paginaConfirmacion = async(req, res) =>
{
     const {token:tokenCuenta} = req.params
     console.log("Confirmando la cuenta asociada al token: ", tokenCuenta);
     
     const usuarioToken = await(Usuario.findOne({where:{token:tokenCuenta }}))
     console.log(usuarioToken);

     if(!usuarioToken)
     {
        res.render("templates/mensaje",{
            title: "Error al confirmar la cuenta",
            msg: `El código de verificación no es válido, por favor intentalo de nuevo.`,
            buttonVisibility: false,
            buttonText: null,
            buttonURL: null});
     }
     else {
     usuarioToken.token=null;
     usuarioToken.confirmed=true;
     await usuarioToken.save();
    
     res.render("templates/mensaje",{
            title: "Confirmación exitosa",
            msg: `La cuenta de: ${usuarioToken.name}, asociada al correo electrónico: ${usuarioToken.email} se ha confirmado, ahora ya puedes ingresar a la plataforma.`,
            buttonVisibility: true,
            buttonText: "Ingresar a BienesRaices",
            buttonURL: "/auth/login"});
    }
}

const formularioRecuperacion = (req,res) =>
{
    res.render("auth/recuperarPassword", {pagina: "Te ayudamos a restaurar tu contraseña"});
}

const formularioActualizacionPassword = async(req,res) =>
{
    const {token}=req.params;
    console.log(`El usuario con token:${token} esta intentando actualizar su contraseña `);

    const usuarioSolicitante = await Usuario.findOne({where:{token}});
    
    if(!usuarioSolicitante) {
        return res.render("templates/mensaje", {
            title: "Error",
            msg: "Token inválido o expirado",
            buttonVisibility: true,
            buttonText: "Recuperar contraseña",
            buttonURL: "/auth/recuperarPassword"
        });
    }
    
    console.log(`El usuario dueño del token es: ${usuarioSolicitante.email}`);
    
    res.render("auth/resetearPassword", {
        pagina: "Ingresa tu nueva contraseña",
        email: usuarioSolicitante.email,
        token: usuarioSolicitante.token
    });
}

const resetearPassword = async(req, res) =>
{
    const {emailUsuario:usuarioSolicitante} = req.body
    console.log(`El usuario con correo: ${usuarioSolicitante} esta solicitando un reseteo de contraseña.`)

    const {emailUsuario: email} = req.body 

     await check('emailUsuario').notEmpty().withMessage("El correo electrónico no puede ser vacío").isEmail().withMessage("El correo electrónico no tiene un formato adecuado").run(req)
    
     let resultadoValidacion = validationResult(req);

     if(!resultadoValidacion.isEmpty())
     {
         return res.render("auth/recuperarPassword", { 
            pagina: "Error, correo inválido", 
            errores: resultadoValidacion.array(), 
            usuario: { emailUsuario: email  }});
     }

    const usuario = await Usuario.findOne({where: { email: usuarioSolicitante}});
    
    if(!usuario)
    {
        return res.render("templates/mensaje",{
            title: "Error, buscando la cuenta",
            msg: `No se ha encontrado ninguna cuenta asociada al correo: ${usuarioSolicitante}`,
            buttonVisibility: true,
            buttonText: "Intentalo de nuevo",
            buttonURL: "/auth/recuperarPassword"
        });
    }
    
    if (!usuario.confirmed)         
    {
        return res.render("templates/mensaje",{
            title: "Error, la cuenta no esta confirmada",
            msg: `La cuenta asociada al correo: ${usuarioSolicitante}, no ha sido validada a través de la liga segura enviada al correo electrónico.`,
            buttonVisibility: true,
            buttonText: "Intentalo de nuevo",
            buttonURL: "/auth/recuperarPassword"
        });
    }

    // Actualizar el token
    usuario.token = generarToken();
    await usuario.save();
    
    // Enviar el token por correo   
    emailResetearPassword({
        nombre: usuario.name,
        email: usuario.email,
        token: usuario.token
    })

    // Responder con una vista de correo enviada
    res.render("templates/mensaje",{
        title: "Correo para la Restauración de Contraseñas",
        msg: `Un paso más, te hemos enviado un correo electrónico con la liga segura para la restauración de tu contraseña.`,
        buttonVisibility: false
    });
}

const actualizarPassword = async (req, res) => {
    console.log("DATOS DEL FORMULARIO:", req.body);

    const email = (req.body.emailSolicitante || '').trim();
    const token = (req.body.token || '').trim();
    const password = (req.body.passwordUsuario || '').trim();

    console.log(`Actualizando contraseña para: ${email} (token: ${token})`);

    await check('passwordUsuario')
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8, max: 30 })
        .withMessage("Debe tener entre 8 y 30 caracteres")
        .run(req);

    await check('confirmacionUsuario')
        .equals(password)
        .withMessage("Las contraseñas no coinciden")
        .run(req);

    let resultadoValidacion = validationResult(req);

    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/resetearPassword", {
            pagina: "Error al actualizar la contraseña",
            errores: resultadoValidacion.array(),
            email: email,
            token: token
        });
    }

    if (!token) {
        return res.render("auth/resetearPassword", {
            pagina: "Error",
            errores: [{ msg: "Token inválido" }],
            email: email
        });
    }

    const usuario = await Usuario.findOne({ where: { email, token } });

    if (!usuario) {
        return res.render("auth/resetearPassword", {
            pagina: "Error",
            errores: [{ msg: "Usuario o token no encontrado" }],
            email: email
        });
    }

    usuario.password = password;
    usuario.token = null;
    await usuario.save();

    return res.render("templates/mensaje", {
        title: "Contraseña actualizada",
        msg: "Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión.",
        buttonVisibility: true,
        buttonText: "Iniciar sesión",
        buttonURL: "/auth/login"
    });
};

const formularioCrearPassword = async (req,res)=>{
    const {id} = req.params;
    let usuario = null;
    if(id){
        usuario = await Usuario.findByPk(id);
    }
    res.render("auth/crearPassword",{
        pagina:"Crear contraseña",
        email: usuario ? usuario.email : null,
        id: id
    })
}

const guardarPassword = async (req,res)=>{
    const {id} = req.params;
    const {password, password2} = req.body;
    if(password !== password2){
        return res.render("auth/crearPassword",{
            pagina:"Crea tu contraseña",
            error:"Las contraseñas no coinciden"
        });
    }
    const usuario = await Usuario.findByPk(id);
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    await usuario.save();
    res.redirect("/auth/dashboard");
}

const autenticarUsuario = async (req,res) => {
    const email = (req.body.emailUsuario || '').trim();
    const password = (req.body.passwordUsuario || '').trim();

    await check('emailUsuario')
        .notEmpty().withMessage("El correo electrónico no puede ser vacío")
        .isEmail().withMessage("Formato inválido")
        .run(req);

    await check('passwordUsuario')
        .notEmpty().withMessage("La contraseña no puede estar vacía")
        .isLength({ min: 8 , max:30})
        .withMessage("Debe tener entre 8 y 30 caracteres")
        .run(req);

    let resultadoValidacion = validationResult(req);

    if(!resultadoValidacion.isEmpty()){
        return res.render("auth/login", {
            pagina: "Error",
            errores: resultadoValidacion.array(),
            usuario:{ emailUsuario: email }
        });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.render("auth/login", { 
            pagina: "Error",
            errores:[{msg:`No existe usuario con: ${email}`}],
            usuario:{ emailUsuario: email }
        }); 
    }

    // VERIFICAR SI LA CUENTA ESTÁ BLOQUEADA
    if (usuario.accountLocked) {
        const tiempoBloqueo = 30 * 60 * 1000;
        
        if (usuario.lastFailedAttempt && 
            (Date.now() - new Date(usuario.lastFailedAttempt).getTime()) > tiempoBloqueo) {
            usuario.accountLocked = false;
            usuario.loginAttempts = 0;
            usuario.unlockCode = null;
            usuario.unlockCodeExpiration = null;
            await usuario.save();
        } else {
            return res.render("auth/login", {
                pagina: "Cuenta Bloqueada",
                errores: [{ 
                    msg: '❌ Tu cuenta ha sido bloqueada por 5 intentos fallidos. Revisa tu correo para desbloquearla o espera 30 minutos.' 
                }],
                usuario: { emailUsuario: email },
                cuentaBloqueada: true,
                emailBloqueado: email
            });
        }
    }

    if (!usuario.confirmed) {
        return res.render("auth/login",{
            pagina: "Error",
            errores:[{msg:`La cuenta con correo ${email} no está confirmada`}],
            usuario:{ emailUsuario: email }
        });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if(!passwordValido){
        usuario.loginAttempts += 1;
        usuario.lastFailedAttempt = new Date();
        
        if (usuario.loginAttempts >= 5) {
            usuario.accountLocked = true;
            const codigoDesbloqueo = Math.floor(100000 + Math.random() * 900000).toString();
            usuario.unlockCode = codigoDesbloqueo;
            usuario.unlockCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);
            await usuario.save();
            
            await emailDesbloqueoCuenta({
                nombre: usuario.name,
                email: usuario.email,
                codigoDesbloqueo: codigoDesbloqueo
            });
            
            return res.render("auth/login", {
                pagina: "Cuenta Bloqueada",
                errores: [{ 
                    msg: '⚠️ Tu cuenta ha sido bloqueada por 5 intentos fallidos. Se ha enviado un código de desbloqueo a tu correo.' 
                }],
                usuario: { emailUsuario: email },
                cuentaBloqueada: true,
                emailBloqueado: email
            });
        }
        
        await usuario.save();
        
        const intentosRestantes = 5 - usuario.loginAttempts;
        return res.render("auth/login", {
            pagina: "Error",
            errores: [{ 
                msg: `❌ Contraseña incorrecta. Te quedan ${intentosRestantes} intento${intentosRestantes !== 1 ? 's' : ''} antes de que tu cuenta sea bloqueada.` 
            }],
            usuario: { emailUsuario: email }
        });
    }

    // LOGIN EXITOSO
    usuario.loginAttempts = 0;
    usuario.accountLocked = false;
    usuario.unlockCode = null;
    usuario.unlockCodeExpiration = null;
    usuario.lastLogin = new Date();
    await usuario.save();

    const token = generarJWT(usuario.id);
    console.log(token);
    
    res.render("main/mis-propiedades", {
        pagina: "Menu Principal del Usuario",
        header_superior: true
    });
};

// NUEVA FUNCIÓN: Mostrar pantalla de desbloqueo
const mostrarDesbloqueo = async (req, res) => {
    const { codigo } = req.params;
    
    res.render("auth/desbloqueo", {
        pagina: "Desbloquear cuenta",
        csrfToken: req.csrfToken ? req.csrfToken() : null,
        codigoUrl: codigo || null
    });
};

// NUEVA FUNCIÓN: Desbloquear cuenta
const desbloquearCuenta = async (req, res) => {
    const { email, codigoDesbloqueo } = req.body;
    
    await check('email').notEmpty().withMessage("El correo es requerido").isEmail().withMessage("Email inválido").run(req);
    await check('codigoDesbloqueo').notEmpty().withMessage("El código es requerido").run(req);
    
    let resultadoValidacion = validationResult(req);
    
    if (!resultadoValidacion.isEmpty()) {
        return res.render("auth/desbloqueo", {
            pagina: "Error",
            errores: resultadoValidacion.array(),
            csrfToken: req.csrfToken ? req.csrfToken() : null
        });
    }
    
    try {
        const usuario = await Usuario.findOne({ 
            where: { 
                email: email.trim(),
                accountLocked: true,
                unlockCode: codigoDesbloqueo.trim(),
                unlockCodeExpiration: { [Op.gt]: new Date() }
            } 
        });
        
        if (!usuario) {
            return res.render("auth/desbloqueo", {
                pagina: "Error",
                errores: [{ msg: '❌ Código inválido o expirado. Solicita un nuevo desbloqueo.' }],
                csrfToken: req.csrfToken ? req.csrfToken() : null,
                email: email
            });
        }
        
        usuario.accountLocked = false;
        usuario.loginAttempts = 0;
        usuario.unlockCode = null;
        usuario.unlockCodeExpiration = null;
        await usuario.save();
        
        res.render("auth/login", {
            pagina: "Cuenta desbloqueada",
            exito: '✅ ¡Cuenta desbloqueada exitosamente! Ahora puedes iniciar sesión.',
            csrfToken: req.csrfToken ? req.csrfToken() : null
        });
        
    } catch (error) {
        console.error('Error al desbloquear:', error);
        res.render("auth/desbloqueo", {
            pagina: "Error",
            errores: [{ msg: 'Error al procesar el desbloqueo' }],
            csrfToken: req.csrfToken ? req.csrfToken() : null
        });
    }
};

// NUEVA FUNCIÓN: Reenviar código de desbloqueo
const reenviarCodigoDesbloqueo = async (req, res) => {
    const { email } = req.body;
    
    try {
        const usuario = await Usuario.findOne({ 
            where: { 
                email: email.trim(), 
                accountLocked: true 
            } 
        });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado o cuenta no bloqueada' });
        }
        
        const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
        usuario.unlockCode = nuevoCodigo;
        usuario.unlockCodeExpiration = new Date(Date.now() + 10 * 60 * 1000);
        await usuario.save();
        
        await emailDesbloqueoCuenta({
            nombre: usuario.name,
            email: usuario.email,
            codigoDesbloqueo: nuevoCodigo
        });
        
        res.json({ mensaje: '✅ Se ha enviado un nuevo código de desbloqueo a tu correo' });
        
    } catch (error) {
        console.error('Error al reenviar código:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};

// Al final de tu archivo usuarioController.js
export {
    formularioLogin,
    autenticarUsuario,
    guardarPassword,
    actualizarPassword,
    formularioRegistro,
    registrarUsuario,
    formularioRecuperacion,
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword,
    formularioCrearPassword,
    mostrarDesbloqueo,      // ← NUEVA
    desbloquearCuenta,      // ← NUEVA
    reenviarCodigoDesbloqueo // ← NUEVA
}