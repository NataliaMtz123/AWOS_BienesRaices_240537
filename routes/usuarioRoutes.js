import express from 'express'
import passport from 'passport';

import { 
    fromularioLogin, 
    formularioRegistro, 
    registrarUsuario, 
    paginaConfirmacion,
    googleCallback, 
    githubCallback, 
    logout,
    perfilUsuario
} from '../controllers/usuarioController.js'; 

const router = express.Router();

router.get("/login", fromularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrarUsuario);
router.get("/perfil", perfilUsuario);
router.get("/confirmar/:token", paginaConfirmacion);

// 🔵 GOOGLE
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    googleCallback
);

// ⚫ GITHUB 🔥
router.get('/github', (req, res) => {

    const clientID = process.env.GITHUB_CLIENT_ID;
    const redirectURI = encodeURIComponent('http://localhost:40537/auth/github/callback');

    const url = `https://github.com/login/oauth/authorize
    ?client_id=${clientID}
    &redirect_uri=${redirectURI}
    &scope=user:email
    &force_verify=true`;

    res.redirect(url.replace(/\s/g, ''));
});

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    githubCallback
);

router.get('/logout', logout);

export default router;