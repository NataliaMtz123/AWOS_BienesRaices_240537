import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const{
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_DIALECT,
    NODE_ENV
}= process.env;

const sequelize = new Sequelize(
    DB_NAME, 
    DB_USER, 
    DB_PASSWORD, 
    {
        host: DB_HOST,
        port: DB_PORT,
        dialect: DB_DIALECT || "mysql",

        //Buenas practicas actuales
        logging: NODE_ENV === "development" ? console.log : false,
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            //Opciones específicas para MySQL
            charset: "utf8mb4",
        },
        timezone: "-06:00" // Ajusta la zona horaria según tu ubicación (Mexico)
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida correctamente.");
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
        process.exit(1); // Salir con un código de error
    }
};  

export default sequelize;