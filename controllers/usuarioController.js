import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuarios.js";
import { generarToken } from "../lib/tokens.js";
import jwt from "jsonwebtoken";

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
                ],
                usuario: {
                    nombreUsuario,
                    correoUsuario
                }
            });
        }

        // Crear usuario (mapeando los nombres correctamente)
        console.log('4. Creando usuario con datos mapeados:', {
            name: nombreUsuario,
            email: correoUsuario,
            password: contraseUsuario,
            token: generarToken()
        });

        const data = {
            name: nombreUsuario,
            email: correoUsuario,
            password: contraseUsuario,
            token: generarToken()
        };

        const usuario = await Usuario.create(data);
        
        console.log('5. Usuario creado exitosamente, ID:', usuario.id);

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
// EXPORTACIONES
// =============================
export {
    fromularioLogin,
    formularioRegistro,
    registrarUsuario,
    googleCallback,
    githubCallback,
    logout,
    perfilUsuario
};