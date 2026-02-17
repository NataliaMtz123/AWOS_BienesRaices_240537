const fromularioLogin = (req,res)=>{
    res.render("auth/login", {pagina: "Inicia sesión con nosotros :)"});
}

const formularioRegistro=(req,res)=>{
res.render("auth/registro", {pagina: "Registrate con nosotros :)"});
}

export {
    fromularioLogin,
    formularioRegistro
}
