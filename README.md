# Interactiva Lessons 🚀

Una plataforma educativa interactiva diseñada para enseñar conceptos fundamentales de administración de sistemas, específicamente **SSH** y **Gestión de Claves (Keygen)**, a través de una experiencia gamificada y visual.

## 📖 Descripción

Este proyecto es una aplicación web moderna construida con React que simula un entorno de terminal y guía a los estudiantes a través de lecciones prácticas. El objetivo es desmitificar el uso de la línea de comandos y protocolos de seguridad mediante misiones interactivas y retroalimentación visual inmediata.

## ✨ Características Principales

*   **Simulador de Terminal Integrado**: Una terminal realista en el navegador que soporta comandos básicos de Unix (`ls`, `cd`, `mkdir`, `cat`, `ssh`, `ssh-keygen`, etc.).
*   **Lecciones Gamificadas**:
    *   **Clase SSH**: Aprende a conectarte a servidores remotos, entender la autenticación por contraseña y navegar por el sistema de archivos.
    *   **Clase Keygen**: Domina la autenticación sin contraseñas mediante claves pública/privada, generación de pares de claves y configuración de `authorized_keys`.
*   **Feedback Visual Inmediato**: Indicadores de éxito/error, barras de progreso y reacciones de la interfaz a las acciones del usuario.
*   **Modo Historia**: Narrativa envolvente que pone al usuario en el rol de un operador que debe cumplir misiones críticas.
*   **Interfaz Moderna**: Diseño atractivo con modo oscuro, animaciones fluidas (Framer Motion) y componentes responsivos.

## 🛠️ Tecnologías Utilizadas

*   **Core**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Iconos**: [Lucide React](https://lucide.dev/)
*   **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
*   **Enrutamiento**: [React Router v7](https://reactrouter.com/)

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio** (o descargar los archivos):
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd interactiva_lessons
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador**:
    La aplicación estará disponible generalmente en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── Layout.jsx      # Estructura principal con Outlet
│   ├── TerminalSimulator.jsx # El núcleo de la simulación
│   ├── ProgressFlow.jsx # Barra de progreso lateral
│   └── ZoomableImage.jsx # Componente para imágenes interactivas
├── pages/              # Páginas principales de la aplicación
│   ├── Home.jsx        # Pantalla de inicio / Dashboard
│   ├── SSHClass.jsx    # Módulo de lección de SSH
│   └── KeygenClass.jsx # Módulo de lección de Keygen
├── App.jsx             # Configuración de rutas
└── main.jsx            # Punto de entrada
```

## 🤝 Contribución

Si deseas contribuir, por favor abre un Pull Request o reporta un Issue. ¡Toda ayuda es bienvenida para mejorar la educación tecnológica!

---
Hecho con 💜 para el aprendizaje de DevOps y SysAdmin.
