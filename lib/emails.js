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
};

export { emailRegistro };