# 🚀 INSTRUCCIONES PARA USAR VITE

## ✅ Migración Completada

El proyecto ha sido migrado exitosamente a Vite. Ahora tienes:

- ⚡ Desarrollo ultra rápido con HMR
- 📦 Build optimizado para producción
- 🎯 Mejor organización del código
- 🔥 Hot Module Replacement activo

## 📁 Estructura del Proyecto

```
transportes-edimburgo/
├── index.html          # Punto de entrada
├── vite.config.js      # Configuración de Vite
├── package.json        # Dependencias
├── src/
│   ├── styles.css      # Estilos CSS
│   └── script.js       # JavaScript
├── public/
│   └── images/         # Imágenes estáticas
└── dist/               # Build de producción (se genera)
```

## 🎮 Comandos Disponibles

### Desarrollo (Recomendado)
```bash
npm run dev
```
- Inicia servidor en http://localhost:3000
- HMR activo (cambios instantáneos)
- Recarga automática

### Build de Producción
```bash
npm run build
```
- Genera carpeta `dist/` optimizada
- Minifica CSS y JS
- Optimiza imágenes
- Lista para desplegar

### Preview de Producción
```bash
npm run preview
```
- Sirve la versión de producción localmente
- Útil para probar antes de desplegar

## 🚀 Iniciar el Servidor

### Opción 1: Manual
```bash
cd ~/transportes-edimburgo
npm run dev
```

### Opción 2: Con Script
```bash
cd ~/transportes-edimburgo
./start-vite.sh
```

### Opción 3: En Segundo Plano
```bash
cd ~/transportes-edimburgo
nohup npm run dev > vite.log 2>&1 &
```

## 📍 Acceder al Sitio

Una vez iniciado, accede a:
```
http://72.60.136.211:3000
```

## 🔧 Solución de Problemas

### Si el servidor no inicia:
```bash
# Verificar que Vite está instalado
npm list vite

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ver logs
cat vite.log
```

### Si hay errores de rutas:
- Las imágenes deben estar en `public/images/`
- Los CSS/JS deben estar en `src/`
- Las rutas en HTML deben ser `/src/` y `/images/`

### Detener el servidor:
```bash
pkill -f vite
```

## 📊 Ventajas de Vite vs Express

| Característica | Express (Antes) | Vite (Ahora) |
|---------------|-----------------|--------------|
| Velocidad Dev | Normal | ⚡ Ultra rápido |
| HMR | No | ✅ Sí |
| Build | Manual | ✅ Automático |
| Optimización | Manual | ✅ Automática |
| Hot Reload | Lento | ⚡ Instantáneo |

## 🎯 Próximos Pasos

1. El servidor ya está corriendo en modo desarrollo
2. Puedes hacer cambios y verlos instantáneamente
3. Para producción, ejecuta `npm run build`
4. El sitio funciona igual que antes, pero más rápido

## 📝 Notas

- El servidor anterior (Express) ya no es necesario
- Vite maneja todo automáticamente
- Los cambios se reflejan instantáneamente
- El build de producción está optimizado
