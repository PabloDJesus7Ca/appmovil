# 🌌 CieloObs — Observador del Cielo RD

Aplicación móvil para registrar fenómenos visibles en el cielo, desarrollada con **Expo SDK 52 + React Native**.

---

## 🚀 Crear el proyecto desde cero

Ejecuta estos comandos **en orden**:

```bash
# 1. Crear el proyecto con Expo
npx create-expo-app@latest cielo-obs --template blank

# 2. Entrar a la carpeta
cd cielo-obs

# 3. Instalar navegación (react-navigation)
npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack

# 4. Instalar almacenamiento local SQLite
npx expo install expo-sqlite

# 5. Instalar cámara y ubicación
npx expo install expo-camera
npx expo install expo-location
npx expo install expo-image-picker
npx expo install expo-av

# 6. Instalar íconos incluidos en Expo
npx expo install @expo/vector-icons

# 7. Arrancar la app
npx expo start
```

---

## 📁 Estructura del Proyecto

```
cielo-obs/
├── assets/
│   ├── icon.png          ← 📸 COLOCA TU ÍCONO AQUÍ (1024x1024 px)
│   ├── splash.png        ← 🖼️  COLOCA TU SPLASH AQUÍ (1284x2778 px)
│   └── adaptive-icon.png ← 🤖 ÍCONO ANDROID (1024x1024 px)
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js         — Lista de observaciones
│   │   ├── NewObservationScreen.js — Formulario nueva obs.
│   │   ├── DetailScreen.js       — Detalle de una obs.
│   │   └── AboutScreen.js        — Perfil del observador
│   └── components/
│       └── ObservationCard.js    — Tarjeta de observación
├── App.js                        — Punto de entrada + navegación
├── app.json                      — Configuración Expo
└── README.md
```

---

## ▶️ Iniciar la app

```bash
npx expo start
```

Luego escanea el QR con la app **Expo Go** en tu celular.

---

## 📦 Dependencias utilizadas

| Paquete | Para qué sirve |
|---|---|
| `expo` SDK 52 | Base del proyecto |
| `@react-navigation/native` | Navegación entre pantallas |
| `@react-navigation/native-stack` | Stack de pantallas |
| `expo-sqlite` | Base de datos local (offline) |
| `expo-camera` | Cámara para fotos |
| `expo-location` | GPS del dispositivo |
| `expo-image-picker` | Seleccionar fotos de galería |
| `expo-av` | Reproducir notas de voz |
| `@expo/vector-icons` | Íconos (Ionicons) |

---

## 🛠️ Versiones recomendadas

- Node.js: 18+
- Expo SDK: 52
- React: 18.3.x
- React Native: 0.76.x
# appmovil
