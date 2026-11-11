# blog.local — Contenedor Express + TypeScript (Clase 19 GSW)

Reverse proxy con Apache: Apache (puerto 80) → blog.local (puerto 3000).

## Rutas
- GET /saludo?nombre=X
- GET /info
- GET /cotizacion
- GET /articulos
- GET /health
- GET /articulos/:id
- POST /articulos        { titulo, contenido, autor }
- PUT  /articulos/:id
- DELETE /articulos/:id

## Local
    npm install
    npm run build
    npm start

## Paso 2: Construir la imagen de Docker
Abre la terminal de macOS en la carpeta de tu proyecto (con Docker Desktop abierto) **y ejecuta:**

```Bash
docker build -t blog-local .
```
**Verifica que la imagen se creó correctamente:**
```Bash
docker images blog-local
```

## Paso 3: Ejecutar el contenedor nodo1
Ejecuta la imagen asignando el puerto local 9100 al puerto interno 9000 del contenedor:

```Bash
docker run -d --name nodo1 -p 9100:9000 blog-local
```

Verifica que el contenedor esté corriendo y revisa sus registros:   
```Bash
docker ps
docker logs nodo1
```

comandos vistos en clase 33 
```
docker compose exec nodo1 wget -qO- http://nodo2:9000/health
```
---
```
docker compose exec nodo1 wget -qO- http://172.28.0.13:9000/health
```
---
```
docker ps --format "{{.Names}}  {{.Ports}}"
```