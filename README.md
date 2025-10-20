# APP-REGISTRO-FACTURACION

### Configuracion del proyecto e instalacion de herramientas

1. Crear el proyecto con ionic start (configurar con NG Modules, no con Standalone).

<img width="1009" height="138" alt="image" src="https://github.com/user-attachments/assets/04a880c1-0063-4042-a736-8f1efef68123" />


2. Instalar el capacitor de la cámara

Es necesario instalar PWA elements para utilizar la cámara del dispositivo. Se instala con: npm install @ionic/pwa-elements
Luego se instala:
- npm install @capacitor/camera
- npm install @capacitor/filesystem
- npm install @capacitor/preferences

### Desarrollo de la aplicacion

1. En tabs.page.html se define las pestañas que van a aparecer (Inicio, Balance, Recibos).

<img width="483" height="394" alt="image" src="https://github.com/user-attachments/assets/e683857a-2fb8-484d-95df-c8bebef8883a" />

2. En tab1.page.html se modifica para que aparezcan los gastos realizados.

<img width="622" height="516" alt="image" src="https://github.com/user-attachments/assets/ab0ba8fc-e286-4190-8af8-080566cc6da3" />

3. En tab2.page.html se modifica para que el usuario ingrese un nuevo gasto y la foto de la factura.

<img width="1199" height="506" alt="image" src="https://github.com/user-attachments/assets/582c9bbb-ed89-4ec9-8edb-420469b4327e" />

Se añadieron los campos para que el usuario ingrese la descripción de la factura, el monto y quien realizó el pago.

Luego se añade otra sección para que el usuario tome la foto.

<img width="892" height="440" alt="image" src="https://github.com/user-attachments/assets/db795ee4-70ec-48db-86b7-7552583ce036" />

Se crea un botón para guardar.

### Aplicacion

1. Registro de los datos
   
<img width="897" height="939" alt="image" src="https://github.com/user-attachments/assets/8094bb63-e109-4a32-82e9-ff6ff7cd8185" />

<img width="880" height="555" alt="image" src="https://github.com/user-attachments/assets/ca353e61-32eb-49b6-a33e-3bbc0d966e28" />

2. Ver recibos registrados

<img width="920" height="938" alt="image" src="https://github.com/user-attachments/assets/177a75ec-3596-4482-b2d2-cda3aa0e90ce" />

3. Ver los gastos realizados

<img width="955" height="937" alt="image" src="https://github.com/user-attachments/assets/b529d6ac-c51d-4601-a734-481090d7c2ec" />
