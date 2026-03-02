import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const Usuario = db.define("Usuario", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },  

    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre del usuario es obligatorio."
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: "El correo electrónico ya está registrado en el sistema."
        },
        validate: {
            isEmail: {
                msg: "Debe proporcionar un email válido."
            },
            notEmpty: {
                msg: "El email no puede estar vacío."
            }   
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false, // Cambiado a false porque siempre debe tener un valor
        validate: {
            notEmpty: {
                msg: "La contraseña NO puede estar vacia."
            },
            len:{
                args: [8,100],
                msg: "La contraseña debe tener al menos 8 caracteres."
            }
        }
    },
    // 🆕 NUEVOS CAMPOS PARA AUTENTICACIÓN SOCIAL
    proveedor: {
        type: DataTypes.ENUM('local', 'google', 'github'),
        defaultValue: 'local',
        field: "proveedor"
    },
    proveedorId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "proveedor_id"
    },
    fotoPerfil: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "foto_perfil"
    },
    emailVerificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "email_verificado"
    },
    // Tus campos existentes (sin cambios)
    confirmed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "confirmed"
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "token"
    },
    tokenExpiracion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "token_expiracion"
    },
    regStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "reg_status"
    },
    ultimoAcceso: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ultimo_acceso"
    }
},{
    tableName: "tb_usuarios",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    hooks: {
        //Hash de contraseña antes de crear
        beforeCreate: async(usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },

        //Hash de contraseña antes de actualizar
        beforeUpdate: async(usuario) => {
            if (usuario.changed("password")) {
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

export default Usuario;