# 📸 INSTRUCCIONES PARA SUBIR IMÁGENES

## Imágenes Necesarias

Necesitas subir 4 imágenes con estos nombres exactos:

1. **hero-promo.jpg** - Imagen promocional principal (minivan oscuro)
2. **about-night-drive.jpg** - Interior del coche conduciendo de noche
3. **services-luggage.jpg** - Maletas y carrito de equipaje
4. **hotel-van.jpg** - Minivan en el hotel

## Opción 1: Usar el Script Automático

1. Coloca todas las imágenes en un directorio
2. Descarga el script `subir-imagenes.sh` a ese directorio
3. Ejecuta:
```bash
chmod +x subir-imagenes.sh
./subir-imagenes.sh
```

## Opción 2: Subir Manualmente con SCP

Desde tu computadora local, ejecuta:

```bash
# Navega al directorio donde tienes las imágenes
cd /ruta/a/tus/imagenes

# Sube cada imagen
scp hero-promo.jpg cesar@72.60.136.211:~/transportes-edimburgo/images/
scp about-night-drive.jpg cesar@72.60.136.211:~/transportes-edimburgo/images/
scp services-luggage.jpg cesar@72.60.136.211:~/transportes-edimburgo/images/
scp hotel-van.jpg cesar@72.60.136.211:~/transportes-edimburgo/images/
```

Cuando te pida la contraseña, escribe: `cesar`

## Opción 3: Renombrar Imágenes en el Servidor

Si ya subiste las imágenes con otros nombres:

```bash
# Conectarse al servidor
ssh cesar@72.60.136.211
# Contraseña: cesar

# Ir al directorio de imágenes
cd ~/transportes-edimburgo/images

# Ver qué imágenes tienes
ls -la

# Renombrar según corresponda
mv tu-imagen-1.jpg hero-promo.jpg
mv tu-imagen-2.jpg about-night-drive.jpg
mv tu-imagen-3.jpg services-luggage.jpg
mv tu-imagen-4.jpg hotel-van.jpg
```

## Verificar que las Imágenes se Subieron Correctamente

```bash
ssh cesar@72.60.136.211 'ls -la ~/transportes-edimburgo/images/'
```

Deberías ver las 4 imágenes listadas.

## Nota sobre Formatos

- Acepta: .jpg, .jpeg, .png
- Si tus imágenes son .png, puedes renombrarlas a .jpg o actualizar el HTML
- Dimensiones recomendadas: mínimo 1200x800px para mejor calidad
