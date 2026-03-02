import express from "express";
import session from 'express-session';
import passport from './config/passport.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from './config/db.js';

// Cargar variables de entorno
dotenv.config();

// Instanciamos el servidor
const app = express();

// Habilitamos pug
app.set('view engine','pug');
app.set('views','./views');

// Carpeta pública
app.use(express.static("public"));

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// 🔐 SESIÓN
app.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_temporal',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// 🔐 PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// RUTAS
app.use("/auth", usuarioRoutes);

// DB
await connectDB();

// SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
});