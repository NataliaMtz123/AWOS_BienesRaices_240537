## Proyecto de Calse: Sistema de Bienes Raíces

---

<p align="justify">
En este proyecto se pondra un ejemplo práctico de la creacion de API's propias asi como
el consumo de API's de Terceros (Gestión de Mapas, Envio de Correos, Autentificación
por Redes Sociales, Gestión de Bases de Datos, Gestión de archivos, Seguridad, 
Control de sesiónes y validaciones. En el contexto real de la compra, venta o renta
de propiedades).
</p>

---

#### Consideraciones

<p align="justify">
El proyecto estará basado en una arquitectura SOA (Service Oriented Architecture), el
Patrón de Diseño MVC (Model, View, Controler) y servicios API REST, deberá
gestionarse debidamente en el uso del control de versiones y ramas progresivas.
</p>

---

## Resultados Obtenidos

---

### Test 1: Interacción Rotativa (Registro, Login y Recuperación)
**Objetivo:** Validar el flujo completo de navegación entre registro, inicio de sesión y recuperación de contraseña.  
**Resultado:** Flujo ejecutado correctamente, permitiendo la navegación sin errores entre las vistas.

#### Login
![general_view](./img/login.png)
#### Registro
![general_view](./img/registro.png)
#### Recuperacion de contraseña
![general_view](./img/recuperarContraseña.png)

---

### Test 2: Registro Exitoso de un Nuevo Usuario
**Objetivo:** Verificar que un usuario pueda registrarse correctamente con datos válidos y confirmar su cuenta por correo.  
**Resultado:** Registro completado exitosamente, correo enviado mediante Mailtrap y cuenta confirmada correctamente.

#### Llenado de datos del usuario
![general_view](./img/registro1.0.png)
#### Mensaje de creación de cuenta
![general_view](./img/registro1.1.png)
#### Confirmacion mediante Mailtrap
![general_view](./img/registro1.3.png)
#### Confirmación de usuario
![general_view](./img/registro1.4.png)

---

### Test 3: Registro Fallido por Formulario mal llenado
**Objetivo:** Validar que el sistema detecte errores en el formulario (contraseñas no coinciden).  
**Resultado:** El sistema bloqueó el registro y mostró mensajes de validación correctamente.

#### Evidencia
![general_view](./img/registro_fallido.png)

---

### Test 4: Registro Fallido por correo duplicado
**Objetivo:** Verificar que el sistema no permita registros con correos ya existentes.  
**Resultado:** El sistema detectó el correo duplicado y mostró un mensaje de error, evitando el registro.

#### Evidencia
![general_view](./img/correoDuplicado.png)

---

### Test 5: Validación de Usuario por Email
**Objetivo:** Comprobar que el usuario pueda validar su cuenta mediante enlace enviado por correo.  
**Resultado:** Validación realizada correctamente mediante Mailtrap.

#### Evidencia
![general_view](./img/validacion.png)

---

### Test 6: Actualización exitosa de contraseña
**Objetivo:** Verificar que un usuario validado pueda cambiar su contraseña correctamente.  
**Resultado:** Contraseña actualizada exitosamente y reflejada en el sistema.

#### Evidencia
![general_view](./img/cambioContraseña.png)
![general_view](./img/cambioContraseña2.png)
![general_view](./img/cambioContraseña3.png)

---

### Test 7: Actualización fallida de contraseña (usuario no validado)
**Objetivo:** Validar que usuarios no confirmados no puedan cambiar su contraseña.  
**Resultado:** El sistema impidió la acción y mostró mensajes de restricción correctamente.

#### Evidencia
![general_view](./img/cambioNoValidado.png)
![general_view](./img/cambioNoValidado2.png)

---

### Test 8: Actualización fallida por token inválido
**Objetivo:** Verificar que el sistema rechace tokens inválidos o expirados.  
**Resultado:** El sistema detectó el token inválido y bloqueó el cambio de contraseña.

#### Evidencia
![general_view](./img/tokenInvalido.png)

---

### Test 9: Login exitoso y acceso a Mis Propiedades
**Objetivo:** Validar que un usuario autenticado acceda correctamente a su panel.  
**Resultado:** Inicio de sesión exitoso y redirección correcta a la vista de “Mis Propiedades”.

#### Evidencia
![general_view](./img/inicioExitoso.png)
![general_view](./img/inicioExitoso2.png)
![general_view](./img/inicioExitoso3.png)

---

### Test 10: Bloqueo de cuenta por intentos fallidos
**Objetivo:** Validar el mecanismo de seguridad ante múltiples intentos fallidos de inicio de sesión.  
**Resultado:** Cuenta bloqueada correctamente después de superar el límite de intentos permitidos.

#### Evidencia
![general_view](./img/intento1.png)
![general_view](./img/intento2.png)
![general_view](./img/intento3.png)
![general_view](./img/intento4.png)
![general_view](./img/intento5.png)
![general_view](./img/intento6.png)
![general_view](./img/intento7.png)
![general_view](./img/intento8.png)
![general_view](./img/intento9.png)

---

### Creado por:
**Ingrid Natalia Martinez Carrasco - 240537**