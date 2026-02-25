# Interactiva Lessons 🚀

Una plataforma educativa interactiva diseñada para enseñar conceptos fundamentales de administración de sistemas, específicamente **Bash**, **SSH**, **Gestión de Claves (Keygen)** y servidor web **Apache**, a través de una experiencia gamificada y visual.

## 📖 Descripción

Este proyecto es una aplicación web moderna construida con React que simula un entorno de terminal y guía a los estudiantes a través de lecciones prácticas y exámenes. El objetivo es desmitificar el uso de la línea de comandos, protocolos de seguridad y administración de servidores mediante misiones interactivas y retroalimentación visual inmediata.

## ✨ Características Principales

*   **Simulador de Terminal Integrado**: Una terminal realista en el navegador que soporta comandos básicos de Unix y tareas de administración.
*   **Lecciones Gamificadas y Prácticas**:
    *   **Módulos de Bash (Básico y Avanzado)**: Aprende los fundamentos y técnicas avanzadas de la línea de comandos.
    *   **Módulo de SSH y Configuración**: Domina la conexión a servidores remotos, la autenticación por contraseña y la configuración segura del servicio SSH.
    *   **Módulo de Keygen**: Gestiona la autenticación sin contraseñas mediante claves pública/privada, generación de pares y configuración de `authorized_keys`.
    *   **Módulos de Apache y Examen**: Instala, configura virtual hosts y evalúa tus conocimientos en el manejo del servidor web Apache.
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
    git clone https://github.com/pentarix1996/DojoLeasons.git
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
├── components/          # Componentes reutilizables
│   ├── Layout.jsx       # Estructura principal con Outlet
│   ├── TerminalSimulator.jsx # El núcleo de la simulación
│   ├── ProgressFlow.jsx # Barra de progreso lateral
│   └── ZoomableImage.jsx # Componente para imágenes interactivas
├── pages/               # Páginas de la aplicación y lecciones
│   ├── Home.jsx         # Pantalla de inicio / Dashboard
│   ├── BashBasicClass.jsx   # Lección básica de Bash
│   ├── BashAdvancedClass.jsx # Lección avanzada de Bash
│   ├── SSHClass.jsx         # Lección de conexión SSH
│   ├── ConfigSSHClass.jsx   # Lección de configuración SSH
│   ├── KeygenClass.jsx      # Lección de manejo de claves
│   ├── ApacheBasicClass.jsx # Lección básica de Apache
│   ├── ApacheConfigClass.jsx # Lección de configuración de Apache
│   └── ExamApacheClass.jsx  # Examen práctico de Apache
├── App.jsx              # Configuración de rutas
└── main.jsx             # Punto de entrada
```

## 🤝 Contribución

Si deseas contribuir, por favor abre un Pull Request o reporta un Issue en el repositorio de [DojoLeasons](https://github.com/pentarix1996/DojoLeasons). ¡Toda ayuda es bienvenida para mejorar la educación tecnológica!

---
Hecho con 💜 para el aprendizaje de DevOps y SysAdmin por [@pentarix1996](https://github.com/pentarix1996).
