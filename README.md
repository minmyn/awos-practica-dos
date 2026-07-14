# API de Backend - Proyecto Backend

Este proyecto es una API RESTful desarrollada con **Node.js, Express y TypeScript**, siguiendo una arquitectura modular basada en **Feature-Driven Design** para separar las responsabilidades de negocio de la infraestructura.

## 🚀 Tecnologías
- **Lenguaje:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express
- **Arquitectura:** Modular / Feature-Driven

## 📂 Estructura del Proyecto
El proyecto está organizado por entidades de negocio (`features`), lo que permite escalar y mantener el código de forma aislada:

```text
src/
├── features/         # Lógica de negocio (auth, catalog, products, etc.)
│   ├── [feature]/    # Módulo independiente
│   │   ├── dtos/     # Objetos de transferencia de datos
│   │   ├── entities/ # Definición de entidades de datos
│   │   ├── *.controller.ts
│   │   ├── *.service.ts
│   │   └── *.router.ts
├── infra/            # Configuración de infraestructura (errores, middlewares)
└── index.ts          # Punto de entrada de la aplicación

## 📋 Prerrequisitos
Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- npm (o pnpm/yarn)

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install
   

   