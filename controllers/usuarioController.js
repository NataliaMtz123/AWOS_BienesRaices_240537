import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuarios.js";
import { generarToken } from "../lib/tokens.js";
import { emailRegistro } from "../lib/emails.js";//importacion 
import { emailResetearPassword } from "../lib/emails.js";//importacion
import jwt from "jsonwebtoken";
import { where } from "sequelize";

// =============================
// LOGIN
// =============================
const fromularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Inicia sesión con nosotros :)"
    });
};

// =============================
// REGISTRO (FORM)
// =============================
const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Regístrate con nosotros :)"
    });
};

const formularioActualizarPassword = (req, res) => {
    const { token } = req.params;

    return res.render("auth/actualizarPassword", {
        pagina: "Ingresa tu nueva contraseña",
        token
    });
};

const actualizarPassword = async (req, res) => {
    const { token } = req.params;
    const { passwordUsuario, confirmacionUsuario } = req.body;

    if (!passwordUsuario || passwordUsuario.length < 8) {
        return res.render("auth/actualizarPassword", {
            pagina: "Ingresa tu nueva contraseña",
            token,
            errores: [{ msg: "La contraseña debe tener al menos 8 caracteres." }]
        });
    }

    if (passwordUsuario !== confirmacionUsuario) {
        return res.render("auth/actualizarPassword", {
            pagina: "Ingresa tu nueva contraseña",
            token,
            errores: [{ msg: "Las contraseñas no coinciden." }]
        });
    }

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render("templates/mensaje", {
            title: "Token inválido",
            msg: "El enlace para restablecer la contraseña no es válido o ya expiró."
        });
    }

    usuario.password = passwordUsuario;
    usuario.token = null;
    await usuario.save();

    return res.render("templates/mensaje", {
        title: "Contraseña actualizada",
        msg: "Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión."
    });
};

// =============================
// REGISTRAR USUARIO (CORREGIDO)
// =============================
const registrarUsuario = async (req, res) => {
    // Extraer datos del formulario
    const {
        nombreUsuario,
        correoUsuario,
        contraseUsuario,
        confirmarContraseUsuario    
    } = req.body;

    console.log('1. Datos recibidos:', { nombreUsuario, correoUsuario, contraseUsuario });

    try {
        // VALIDACIONES
        await check("nombreUsuario")
            .notEmpty()
            .withMessage("El nombre no puede estar vacío")
            .run(req);

        await check("correoUsuario")
            .isEmail()
            .withMessage("Correo no válido")
            .run(req);

        await check("contraseUsuario")
            .isLength({ min: 8 })
            .withMessage("La contraseña debe tener mínimo 8 caracteres")
            .run(req);

        await check("confirmarContraseUsuario")
            .equals(contraseUsuario)
            .withMessage("Las contraseñas no coinciden")
            .run(req);

        const resultadoValidacion = validationResult(req);

        // Si hay errores de validación
        if (!resultadoValidacion.isEmpty()) {
            return res.render("auth/registro", {
                pagina: "Regístrate con nosotros :)",
                errores: resultadoValidacion.array(),
                usuario: {
                    nombreUsuario,
                    correoUsuario
                }
            });
        }

        // Verificar si el usuario ya existe
        console.log('2. Buscando usuario con email:', correoUsuario);
        
        const existeUsuario = await Usuario.findOne({
            where: { email: correoUsuario }
        });

        if (existeUsuario) {
            console.log('3. Usuario ya existe');
            return res.render("auth/registro", {
                pagina: "Error al crear tu cuenta",
                errores: [
                    { msg: `Ya existe un usuario asociado al correo: ${correoUsuario}` }
                ]
                
            });
        }

        //const {nombreUsuario:name, correoUsuario:email, contraseUsuario:password}=res.body;
        // Crear usuario (mapeando los nombres correctamente)
        console.log('4. Creando usuario con datos mapeados:', {
            name: nombreUsuario,
            email: correoUsuario,
            password: contraseUsuario,
            token: generarToken()
        });

        const data = {
            name:nombreUsuario,
            email:correoUsuario,
            password:contraseUsuario,
            token: generarToken()
        };

        const usuario = await Usuario.create(data);
        
        console.log('5. Usuario creado exitosamente, ID:', usuario.id);

        //Enviar el correo electronico
        emailRegistro({
    nombre: usuario.name,  // Cambiado de nombreUsuario a nombre
    email: usuario.email,  // Cambiado de correoUsuario a email
    token: usuario.token
});

        // Mensaje de éxito
        return res.render("templates/mensaje", {
            title: "¡Bienvenid@ a Bienes Raíces!",
            msg: `La cuenta asociada al correo ${correoUsuario} ha sido creada exitosamente. Por favor, revisa tu correo para confirmar tu cuenta.`,
            errores: []
        });

    } catch (error) {
        console.error('ERROR COMPLETO:', error);

        // Manejo específico de errores de Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render("auth/registro", {
                pagina: "Error al crear tu cuenta",
                errores: [{ msg: "El correo electrónico ya está registrado" }],
                usuario: {
                    nombreUsuario,
                    correoUsuario
                }
            });
        }

        if (error.name === 'SequelizeValidationError') {
            const errores = error.errors.map(err => ({
                msg: err.message
            }));
            
            return res.render("auth/registro", {
                pagina: "Error al crear tu cuenta",
                errores: errores,
                usuario: {
                    nombreUsuario,
                    correoUsuario
                }
            });
        }

        // Error genérico
        return res.render("auth/registro", {
            pagina: "Error al crear tu cuenta",
            errores: [{ msg: "Hubo un error al registrar el usuario. Por favor, intenta de nuevo." }],
            usuario: {
                nombreUsuario,
                correoUsuario
            }
        });
    }
};

    const paginaConfirmacion = async (req, res) => {
    const {token:tokenCuenta} = req.params
    console.log("Confirmando la cuenta asociada al token:", tokenCuenta);

    //confirmar que el token existe
    const usuarioToken = await(Usuario.findOne({where: { token: tokenCuenta }})) ;
    console.log(usuarioToken);

    if(!usuarioToken){
        res.render("templates/mensaje", {
            title: "Error al confirmar tu cuenta",
            msg: "El token de confirmación es inválido o ha expirado.",
        buttonVisible: false,
        buttonText: null,
        buttonLink: null
        });
    }
    //Actualizar los datos del usaurio
    usuarioToken.token = null;
    usuarioToken.confirmed = true;
    usuarioToken.save();

    res.render("templates/mensaje", {
            title: "Confirmacion exitosa",
            msg: `La cuenta de ${usuarioToken.name}, asociada al correo ${usuarioToken.email}, ha sido confirmada exitosamente.`,
        buttonVisible: true,
        buttonText: "Ingresar a Bienes Raíces - 240537",
        buttonLink: "/auth/login"});
};

// =============================
// PERFIL
// =============================
const perfilUsuario = (req, res) => {
    if (!req.user) {
        return res.redirect("/auth/login");
    }

    res.render("perfil", {
        pagina: "Mi Perfil",
        usuario: req.user
    });
};

// =============================
// GOOGLE CALLBACK
// =============================
const googleCallback = (req, res) => {
    const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    res.cookie("_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.redirect("/auth/perfil");
};

// =============================
// GITHUB CALLBACK
// =============================
const githubCallback = (req, res) => {
    const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    res.cookie("_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.redirect("/auth/perfil");
};

// =============================
// LOGOUT
// =============================
const logout = (req, res, next) => {
    const proveedor = req.user?.proveedor;

    req.logout(err => {
        if (err) return next(err);

        req.session.destroy(() => {
            // borrar sesión
            res.clearCookie("connect.sid");
            // borrar JWT
            res.clearCookie("_token");

            if (proveedor === "github") {
                return res.redirect("https://github.com/logout");
            }

            if (proveedor === "google") {
                return res.redirect("/auth/login");
            }

            return res.redirect("/auth/login");
        });
    });
};

// =============================
// RESET PASSWORD
// =============================
const resetearPassword = async (req, res) => {

    // GET -> mostrar formulario
    if (req.method === "GET") {
        return res.render("auth/recuperarPassword", {
            pagina: "Recuperar contraseña"
        });
    }

    // POST -> procesar formulario
    const { emailUsuario } = req.body;

    console.log(`El usuario con correo: ${emailUsuario} solicita resetear su contraseña`);

    // =============================
    // Validación 1
    // =============================
    const usuario = await Usuario.findOne({
        where: { email: emailUsuario }
    });

    // SELECT email FROM tb_usuarios WHERE email = correoUsuario

    if (!usuario) {
        return res.render("templates/mensaje", {
            title: "Error buscando la cuenta",
            msg: `No existe ninguna cuenta asociada al correo: ${emailUsuario}`,
            buttonVisible: true,
        buttonText: "Inténtalo de nuevo",
        buttonLink: "/auth/recuperarPassword"
        });
    }

    // Si el usuario existe pero no ha confirmado su cuenta
    if (!usuario.confirmed) {
        return res.render("templates/mensaje", {
            title: "Cuenta no validada",
            msg: `La cuenta asociada al correo: ${emailUsuario} no ha sido confirmada. Revisa tu correo para encontrar la liga de validación.`
        });
    }

   else {
        // actualizar el token y guardarlo
        usuario.token = generarToken();
        await usuario.save();

        // Enviar el correo electronico
        await emailResetearPassword({
            nombre: usuario.name,
            email: usuario.email,
            token: usuario.token
        });

        // responder con una vista de correo enviado
        return res.render("templates/mensaje", {
            title: "Revisa tu correo",
            msg: `Hemos enviado un correo a ${usuario.email} con instrucciones para recuperar tu contraseña`,
            buttonVisible: false
        });
    }
};


// =============================
// EXPORTACIONES
// =============================
export {
    fromularioLogin,
    formularioRegistro,
    registrarUsuario,
    googleCallback,
    paginaConfirmacion,
    githubCallback,
    logout,
    perfilUsuario,
    resetearPassword,
    formularioActualizarPassword,
    actualizarPassword
};