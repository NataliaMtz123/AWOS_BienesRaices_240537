import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import csurf from "@dr.pogodin/csurf";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Motor de vistas
app.set("view engine", "pug");
app.set("views", "./views");

// Archivos estáticos
app.use(express.static("public"));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookies
app.use(cookieParser());

// 🔐 Sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "PC-BienesRaices_240537_csrf_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// 🔐 Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔐 CSRF
app.use(csurf());

// Token para formularios
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Rutas
app.use("/auth", usuarioRoutes);

// Error CSRF
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).render("templates/mensaje", {
      pagina: "Error de seguridad",
      title: "Error CSRF",
      mensajes: [
        {
          msg: "El formulario ha expirado o no es válido. Por favor, inténtalo de nuevo.",
        },
      ],
    });
  }

  next(err);
});

// DB
await connectDB();

// Servidor
app.listen(process.env.PORT ?? 40537, () => {
  console.log(`🚀 Servidor iniciado en el puerto ${process.env.PORT ?? 40537}`);
});