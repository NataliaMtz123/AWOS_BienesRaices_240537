## Proyecto de Calse: Sistema de Bienes Raíces

---
<p align="justify">
En este proyecto se pondra un ejemplo práctico de la creacion de API's propias asi como
el consumo de API's de Terceros (Gestión de Mapas, Envio de Correos, Autentificación
por Redes Sociales, Gestión de Bases de Datos, Gestión de archivos, Seguridad, 
Control de sesiónes y validaciones. En el contexto real de la compra, venta o renta
de propiedades).</p>

---

#### Consideraciones

<p align="justify">
El proyecto estará basado en una arquitectura SOA (Service Oriented Architecture), el
Patrón de Diseño MVC (Model, View, Controler) y servicios API REST, deberá
gestionarse debidamente en el uso del control de versiones y ramas progresivas.</p>

---



## Tabla de Fases

| No. | Descripcion                                      | Ponderación | Estatus        |
|-----|--------------------------------------------------|-------------|----------------|
| 1.  | Configuración inicial del Proyecto (NodeJs) | 2 | ✅ Finalizado. |  
| 2.  | Routing y Requests (Peticiones) | 5 | ✅ Finalizado. |  
| 3.  |  Layouts, Templete Engines y Tailwind CSS (Frontend)| 5 | ✅ Finalizado.  |  
| 4.  | Creación de páginas de Login y Creación de Uusarios | 6 | ✅ Finalizado. |  
| 5.  | ORM's y Bases de datos | 7 | ✅ Finalizado. |  
| 6.  | Inertando Registros en la Tabla Uusarios |  20|  ✅ Finalizado.|  
| 7.  | Implemnetación de la Funcionalidad (Feature) Recuperación de Contraseña (Password Recovery) | 20 | ✅ Finalizado. |  
| 8.  | Autentificación de Usuarios (auth) |  8|  ✅ Finalizado.|
| 9.  | Definición de clase Propiedades (property) | ❌ |  ❌| 
| 10.  | Operaciones CRUD (Create, Read, Update, Delete) de las Propiedades| ❌ | ❌ | 
| 11.  |  Proteccion de Rutas y Validación de Tokes de Sesión (JWT)|❌  |  ❌| 
| 12.  | Añadir Imágenes a las propiedades (Gestión de Archivos)  |  ❌|  ❌| 
| 13.  |  Elaboración Panel de Administración (Dashboard) | ❌ |  ❌| 
| 14.  |  Formulario de Edición de propiedades | ❌ |❌  | 
| 15.  |  Formulario de Eliminación de propiedades | ❌ | ❌ | 
| 16.  | Página de consulta de propiedad |❌ | ❌ | 
| 17.  | Implementación de paginador |  ❌|❌  | 
| 18.  | Creando la página inicial (index) | ❌ | ❌ | 
| 19.  | Creando las páginas de Categorías y Páginas de Error (404) | ❌ |  ❌| 
| 20.  | Envio de Email por un formulario de contacto | ❌ | ❌ | 
| 21.  | Cambiar el Estatus de una propiedad | ❌ | ❌ | 
| 22.  |  barras de Navegación y Cierre de Sesión |  ❌| ❌ | 
| 23.  | Publicación del API y el Frontend |  ❌| ❌ | 



## Resultados Obtenidos

- Test 1: Interacción Rotativa (Registro, Login y Recuperación)
### Login
![general_view](./img/login.png)
### Registro
![general_view](./img/registro.png)
### Recuperacion de contraseña
![general_view](./img/recuperarContraseña.png)


- Test 2: Registro Exitoso de un Nuevo Usuario
### Llenado de datos del usuario
![general_view](./img/registro1.0.png)
### Mensaje de que el usaurio se a creado y toca confirmar la cuenta
![general_view](./img/registro1.1.png)
### Confirmacion mediante Mailtrap del correo
![general_view](./img/registro1.3.png)
### Mensaje de que el usaurio confirmo la cuenta
![general_view](./img/registro1.4.png)

- Test 3: Registro Fallido de un Nuevo Usuario por Formulario mal llenado
### Evidencia del registro fallido, ingresando contraseñas diferentes
![general_view](./img/registro_fallido.png)

- Test 4: Registro Fallido por correo duplicado
### Mensaje de error de correo duplicado, lo que genera un error de registro
![general_view](./img/correoDuplicado.png)

- Test 5: Validación de Usuario por Email
### Validacion de usuario en Maildrap
![general_view](./img/validacion.png)

- Test 6: Actualización exitosa de contraseña de un usuario validado
### Actualizacion de la contraseña del usuario
![general_view](./img/cambioContraseña.png)
![general_view](./img/cambioContraseña2.png)
![general_view](./img/cambioContraseña3.png)

- Test 7: Actualización fallida de contraseña de un usuario no validado
### Actualizacion de contraseña de una cuenta no validada
![general_view](./img/cambioNoValidado.png)
![general_view](./img/cambioNoValidado2.png)

- Test 8: Actualización fallida de contraseña de un usuario por errores de formulario y token inválido.
### Token invalido, ya caducaducado del usuario que solicito el cambio de contraseña
![general_view](./img/tokenInvalido.png)

- Test 9: Logeo Exitoso del Usuario monstrar página de Mis Propiedades
### Inicio de sesion de un usuario ya registrado
![general_view](./img/inicioExitoso.png)
![general_view](./img/inicioExitoso2.png)
![general_view](./img/inicioExitoso3.png)

- Test 10: Bloqueo de cuenta por exceso de intentos fallidos (5 intentos).
### Bloqueo del usuario con correo ber@gmail.com
![general_view](./img/intento1.png)
![general_view](./img/intento2.png)
![general_view](./img/intento3.png)
![general_view](./img/intento4.png)
![general_view](./img/intento5.png)
![general_view](./img/intento6.png)
![general_view](./img/intento7.png)
![general_view](./img/intento8.png)
![general_view](./img/intento9.png)


### Creado por:
Ingrid Natalia Martinez Carrasco - 240537
