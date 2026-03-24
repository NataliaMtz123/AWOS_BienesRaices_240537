import express from 'express'
import { 
    formularioLogin,
    formularioRegistro,
    registrarUsuario,
    formularioRecuperacion,
    paginaConfirmacion,
    resetearPassword,
    formularioActualizacionPassword,
    actualizarPassword,
    guardarPassword,
    formularioCrearPassword   
} from '../controllers/usuarioController.js'
import passport from '../config/passport.js'
import bcrypt from "bcrypt";

const router = express.Router();

// Definir los ENDPOINTS
// GET
router.get("/login", formularioLogin)
router.get("/registro", formularioRegistro)
router.get("/recuperarPassword", formularioRecuperacion)
router.get("/confirma/:token", paginaConfirmacion)
router.get("/actualizarPassword/:token", formularioActualizacionPassword)
router.get("/crearPassword", formularioCrearPassword); 
router.get("/crearPassword/:id", formularioCrearPassword); 

//POST
router.post("/registro", registrarUsuario)
router.post("/recuperarPassword", resetearPassword)
router.post("/actualizarPassword", actualizarPassword)
router.post("/crearPassword", guardarPassword) 
router.post("/crearPassword/:id", guardarPassword);


// ==============================
// AUTENTICACIÓN CON GOOGLE
// ==============================

router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
)

router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/login"
    }),
    async (req, res) => {

        const esOauth = await bcrypt.compare("OAUTH_USER", req.user.password);

        if(esOauth){
            return res.redirect(`/auth/crearPassword/${req.user.id}`);
        }

        res.redirect("/auth/dashboard");
    }
);


// ==============================
// AUTENTICACIÓN CON FACEBOOK
// ==============================

router.get("/facebook",
    passport.authenticate("facebook", {
        scope: ["email"]
    })
)

router.get("/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/auth/login"
    }),
    (req, res) => {

        if(req.user.password === "OAUTH_USER"){
            return res.redirect(`/auth/crearPassword/${req.user.id}`);
        }

        res.redirect("/auth/dashboard");
    }
);


// ==============================
// MIS PROPIEDADES
// ==============================

router.get("/dashboard", (req,res)=>{
    res.render("propiedades/dashboard",{
        user: req.user
    })
})
export default router