import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from '././config/db.js';

//Instanciamos el Servidor que alojara la WebApp
const app = express();

//Habilitamos pug
app.set('view engine','pug')
app.set('views','./views')

// Definimos la carpeta Pública
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

//Importamos sus rutas (ruteo)
app.get("/", usuarioRoutes);
//app.use("/", usuarioRoutes);
app.use("/auth", usuarioRoutes);
await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El Servidor está iniciado en el puerto ${PORT}`)
})

