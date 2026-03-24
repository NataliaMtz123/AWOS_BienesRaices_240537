import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    await transport.sendMail({
        from: 'BieneRaices-240537.com',
        to: email,
        subject: 'Bienvenid@ a la Plataforma de Bienes Raíces - Confirma tu cuenta',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #fff0f6; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #ffb6c1;">
                    
                    <h2 style="color: #e91e63; text-align: center;">
                        💖 Bienvenido ${nombre}
                    </h2>

                    <p style="color: #555; text-align: center;">
                        Comprueba tu cuenta en <strong>bienesraices_240537.com</strong>
                    </p>

                    <hr style="border: none; border-top: 1px solid #ffc0cb;">

                    <p style="text-align: center; color: #555;">
                        Tu cuenta ya está lista, solo debes confirmarla en el siguiente botón:
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="http://localhost:${process.env.PORT}/auth/confirma/${token}" 
                           style="background-color: #e91e63; color: white; padding: 12px 25px; 
                                  text-decoration: none; border-radius: 25px; font-weight: bold;">
                            Confirmar Cuenta
                        </a>
                    </div>

                    <p style="font-size: 12px; color: #888; text-align: center;">
                        Si no fuiste tú quien creó esta cuenta, ignora este correo.
                    </p>

                </div>
            </div>
        `
    });
};

const emailResetearPassword = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    await transport.sendMail({
        from: 'BieneRaices-240537.com',
        to: email,
        subject: 'Solicitud de restauración de contraseña - BienesRaices-240537.com',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #fff0f6; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #ffb6c1;">
                    
                    <h2 style="color: #d81b60; text-align: center;">
                        🔐 Recuperar contraseña
                    </h2>

                    <p style="color: #555; text-align: center;">
                        Hola ${nombre}, recibimos tu solicitud para restaurar tu contraseña.
                    </p>

                    <hr style="border: none; border-top: 1px solid #ffc0cb;">

                    <p style="text-align: center; color: #555;">
                        Haz clic en el botón para continuar:
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="http://localhost:${process.env.PORT}/auth/actualizarPassword/${token}" 
                           style="background-color: #d81b60; color: white; padding: 12px 25px; 
                                  text-decoration: none; border-radius: 25px; font-weight: bold;">
                            Restablecer contraseña
                        </a>
                    </div>

                    <p style="font-size: 12px; color: #888; text-align: center;">
                        Si no solicitaste este cambio, ignora este correo.
                    </p>

                </div>
            </div>
        `
    });
};

// NUEVA FUNCIÓN PARA DESBLOQUEO DE CUENTA
const emailDesbloqueoCuenta = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, codigoDesbloqueo } = datos;

    await transport.sendMail({
        from: 'BienesRaices-240537.com',
        to: email,
        subject: 'Desbloqueo de cuenta - BienesRaíces',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #fff0f6; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; border: 2px solid #ffb6c1;">
                    
                    <h2 style="color: #e91e63; text-align: center;">
                        🔒 Cuenta bloqueada
                    </h2>

                    <p style="color: #555; text-align: center;">
                        Hola ${nombre}, tu cuenta ha sido bloqueada por 5 intentos fallidos de inicio de sesión.
                    </p>

                    <hr style="border: none; border-top: 1px solid #ffc0cb;">

                    <p style="text-align: center; color: #555;">
                        Para desbloquear tu cuenta, utiliza el siguiente código:
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #e91e63;">
                            ${codigoDesbloqueo}
                        </div>
                    </div>

                    <p style="text-align: center; color: #555;">
                        O haz clic en el siguiente botón:
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="http://localhost:${process.env.PORT}/auth/desbloquear/${codigoDesbloqueo}" 
                           style="background-color: #e91e63; color: white; padding: 12px 25px; 
                                  text-decoration: none; border-radius: 25px; font-weight: bold;">
                            Desbloquear cuenta
                        </a>
                    </div>

                    <p style="font-size: 12px; color: #888; text-align: center;">
                        Este código expirará en 10 minutos.<br>
                        Si no intentaste iniciar sesión, ignora este correo.
                    </p>

                </div>
            </div>
        `
    });
};

export { emailRegistro, emailResetearPassword, emailDesbloqueoCuenta };