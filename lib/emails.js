import nodemailer from "nodemailer";

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
        from: "BienesRaices-240537.com",
        to: email, 
        subject: "Bienvenid@ a la plataforma de Bienes Raíces - Confirma tu cuenta",
        html: `
        <p>Hola! ${nombre}, comprueba tu cuenta en bienesraices_240537.com</p>
        <hr>
        <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
        <a href="http://localhost:${process.env.PORT}/auth/confirmar/${token}">Confirmar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });
}

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
        from: "BienesRaices-240537.com",
        to: email, 
        subject: "Solicitud de restauración de contraseña - Bienes Raíces - 240537",
        html: `
        <p>Hola! ${nombre}, hemos recibido una solicitud para restablecer tu contraseña.</p>
        <hr>
        <p>Por favor accede al siguiente enlace para realizar la actualización:</p>
        <a href="http://localhost:${process.env.PORT}/auth/actualizarPassword/${token}">Restablecer Contraseña</a>
        <p>En caso de que no hayas solicitado este cambio, puedes ignorar este correo electrónico.</p>
        `
    });
};



export { emailRegistro, emailResetearPassword };