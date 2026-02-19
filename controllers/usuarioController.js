const fromularioLogin = (req,res)=>{
    res.render("auth/login", {pagina: "Inicia sesión con nosotros :)"});
}

const formularioRegistro=(req,res)=>{
res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}
const formulariorecuperarPassword=(req,res)=>{
res.render("auth/recuperarPassword", {pagina: "Recuperar contraseña :)"});
}


export {
    fromularioLogin,
    formularioRegistro,
    formulariorecuperarPassword
}
