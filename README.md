# Transportes Edimburgo - Sitio Web

## Archivos Creados

- `index.html` - Página principal
- `styles.css` - Estilos CSS
- `script.js` - JavaScript para interactividad
- `images/` - Directorio para imágenes

## Imágenes Necesarias

Necesitas subir las siguientes imágenes al directorio `images/`:

1. `airport-van.jpg` - Imagen del minivan en el aeropuerto (usada en hero y sección "Quienes Somos")
2. `hotel-van.jpg` - Imagen del minivan en el hotel (usada en calculadora y reserva)

## Cómo Subir las Imágenes

Puedes usar SCP para subir las imágenes:

```bash
scp airport-van.jpg cesar@72.60.136.211:~/transportes-edimburgo/images/
scp hotel-van.jpg cesar@72.60.136.211:~/transportes-edimburgo/images/
```

O conectarte por SSH y usar un cliente FTP/SFTP.

## Configuración del Servidor Web

Si necesitas servir estos archivos con un servidor web (Apache, Nginx, etc.), asegúrate de:

1. Configurar el DocumentRoot o root del servidor apuntando a `~/transportes-edimburgo/`
2. O crear un enlace simbólico desde el directorio web público

### Ejemplo con Apache:
```bash
sudo ln -s ~/transportes-edimburgo /var/www/html/transportes-edimburgo
```

### Ejemplo con Nginx:
Editar la configuración para que el root apunte a `~/transportes-edimburgo`

## Características del Sitio

- ✅ Diseño responsive (adaptable a móviles)
- ✅ Bilingüe (Español/Inglés)
- ✅ Calculadora de tarifas por km
- ✅ Formulario de reserva
- ✅ Secciones: Quienes Somos, Servicios, Calculadora, Reserva, Contacto
- ✅ Navegación suave entre secciones
- ✅ Diseño moderno y profesional

## Contacto en el Sitio

- Teléfono: +569 8944 8371
- Email: transportesedimburgo@icloud.com
