# UCEShop Campus - Microservices Architecture

Una mini-tienda para vender artículos institucionales de la Universidad Central del Ecuador con arquitectura de microservicios.

## Arquitectura

El sistema está compuesto por **tres microservicios**:

- **customer-service** (Puerto 3001): Gestiona clientes `/customers`
- **product-service** (Puerto 3002): Gestiona catálogo de productos `/products`
- **order-service** (Puerto 3003): Crea pedidos `/orders` validando cliente y producto por HTTP

### Base de Datos

- **PostgreSQL** con un solo contenedor
- **Una base de datos**: `uceshop`
- **Tres esquemas lógicos**: `customers`, `products`, `orders`
- Cada servicio se conecta al mismo DB pero usa su esquema específico

## Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose
- Node.js 20+ (para desarrollo local)

### Ejecutar con Docker Compose

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd uce-shop
   ```

2. **Configurar variables de entorno**
   ```bash
   # El archivo .env ya está incluido con configuración predeterminada
   # Modifique si es necesario
   ```

3. **Construir y ejecutar los servicios**
   ```bash
   # Construir imágenes y levantar servicios
   docker-compose up --build

   # Ejecutar en segundo plano
   docker-compose up -d --build
   ```

4. **Verificar servicios activos**
   ```bash
   docker-compose ps
   ```

### Desarrollo Local

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar PostgreSQL**
   ```bash
   docker-compose up postgres -d
   ```

3. **Ejecutar servicios individuales**
   ```bash
   # Customer Service
   npm run start:dev customer-service

   # Product Service  
   npm run start:dev product-service

   # Order Service
   npm run start:dev order-service
   ```

## Health Checks

Todos los servicios exponen endpoint de salud:

```bash
# Customer Service
curl http://localhost:3001/actuator/health

# Product Service
curl http://localhost:3002/actuator/health

# Order Service
curl http://localhost:3003/actuator/health
```

## Pruebas de API

### Customer Service (Puerto 3001)

#### 1. Crear un cliente
```bash
curl -X POST http://localhost:3001/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García",
    "email": "ana.garcia@uce.edu.ec",
    "phone": "+593987654324",
    "address": "Av. Universitaria 456, Quito"
  }'
```

#### 2. Obtener todos los clientes
```bash
curl http://localhost:3001/customers
```

#### 3. Obtener un cliente por ID
```bash
curl http://localhost:3001/customers/1
```

#### 4. Actualizar un cliente
```bash
curl -X PUT http://localhost:3001/customers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García Actualizado",
    "phone": "+593987654325"
  }'
```

#### 5. Eliminar un cliente
```bash
curl -X DELETE http://localhost:3001/customers/4
```

### Product Service (Puerto 3002)

#### 1. Crear un producto
```bash
curl -X POST http://localhost:3002/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lápiz UCE",
    "description": "Lápiz con logo de UCE",
    "price": 1.25,
    "stock": 500,
    "category": "Útiles Escolares"
  }'
```

#### 2. Obtener todos los productos
```bash
curl http://localhost:3002/products
```

#### 3. Obtener productos por categoría
```bash
curl "http://localhost:3002/products?category=Libros"
```

#### 4. Obtener un producto por ID
```bash
curl http://localhost:3002/products/1
```

#### 5. Verificar stock disponible
```bash
curl http://localhost:3002/products/1/stock/5
```

#### 6. Actualizar un producto
```bash
curl -X PUT http://localhost:3002/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 27.00,
    "stock": 95
  }'
```

#### 7. Eliminar un producto
```bash
curl -X DELETE http://localhost:3002/products/6
```

### Order Service (Puerto 3003)

#### 1. Crear un pedido
```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "productId": 1,
    "quantity": 2
  }'
```

#### 2. Obtener todos los pedidos
```bash
curl http://localhost:3003/orders
```

#### 3. Obtener pedidos de un cliente específico
```bash
curl "http://localhost:3003/orders?customerId=1"
```

#### 4. Obtener un pedido por ID
```bash
curl http://localhost:3003/orders/1
```

#### 5. Obtener resumen completo del pedido
```bash
curl http://localhost:3003/orders/1/summary
```

## Colección de Postman

### Variables de Entorno Postman
Crea un entorno con las siguientes variables:

```json
{
  "customer_service_url": "http://localhost:3001",
  "product_service_url": "http://localhost:3002", 
  "order_service_url": "http://localhost:3003"
}
```

### Requests Postman

#### Customer Service

1. **POST** `{{customer_service_url}}/customers`
   ```json
   {
     "name": "Luis Morales",
     "email": "luis.morales@uce.edu.ec",
     "phone": "+593987654326",
     "address": "Calle García Moreno 789, Quito"
   }
   ```

2. **GET** `{{customer_service_url}}/customers`

3. **GET** `{{customer_service_url}}/customers/1`

4. **PUT** `{{customer_service_url}}/customers/1`
   ```json
   {
     "phone": "+593987654327"
   }
   ```

5. **GET** `{{customer_service_url}}/actuator/health`

#### Product Service

1. **POST** `{{product_service_url}}/products`
   ```json
   {
     "name": "Agenda UCE 2024",
     "description": "Agenda universitaria con calendario académico",
     "price": 15.75,
     "stock": 80,
     "category": "Útiles Escolares"
   }
   ```

2. **GET** `{{product_service_url}}/products`

3. **GET** `{{product_service_url}}/products?category=Libros`

4. **GET** `{{product_service_url}}/products/1/stock/3`

5. **GET** `{{product_service_url}}/actuator/health`

#### Order Service

1. **POST** `{{order_service_url}}/orders`
   ```json
   {
     "customerId": 1,
     "productId": 2,
     "quantity": 3
   }
   ```

2. **GET** `{{order_service_url}}/orders`

3. **GET** `{{order_service_url}}/orders/1/summary`

4. **GET** `{{order_service_url}}/actuator/health`

## Casos de Error para Testear

### 1. Cliente inexistente en pedido
```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 999,
    "productId": 1,
    "quantity": 1
  }'
```
**Respuesta esperada**: `404 Not Found` - Customer not found

### 2. Producto inexistente en pedido
```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "productId": 999,
    "quantity": 1
  }'
```
**Respuesta esperada**: `404 Not Found` - Product not found

### 3. Stock insuficiente
```bash
curl -X POST http://localhost:3003/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "productId": 1,
    "quantity": 1000
  }'
```
**Respuesta esperada**: `400 Bad Request` - Insufficient stock

### 4. Email duplicado en cliente
```bash
curl -X POST http://localhost:3001/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Duplicado",
    "email": "juan.perez@uce.edu.ec"
  }'
```
**Respuesta esperada**: `409 Conflict` - Customer with this email already exists

## Estructura del Proyecto

```
uce-shop/
├── apps/
│   ├── customer-service/
│   │   ├── src/
│   │   │   ├── dto/customer.dto.ts
│   │   │   ├── entities/customer.entity.ts
│   │   │   ├── customer-service.controller.ts
│   │   │   ├── customer-service.service.ts
│   │   │   ├── customer-service.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile
│   ├── product-service/
│   │   ├── src/
│   │   │   ├── dto/product.dto.ts
│   │   │   ├── entities/product.entity.ts 
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile
│   └── order-service/
│       ├── src/
│       │   ├── dto/order.dto.ts
│       │   ├── entities/order.entity.ts
│       │   ├── order-service.controller.ts
│       │   ├── order-service.service.ts
│       │   ├── order-service.module.ts
│       │   └── main.ts
│       └── Dockerfile
├── db/
│   └── init/
│       └── 01_init.sql
├── docker-compose.yml
├── .env
├── .dockerignore
└── README.md
```

## Endpoints Disponibles

### Customer Service (:3001)
- `GET /customers` - Lista todos los clientes
- `POST /customers` - Crea un nuevo cliente  
- `GET /customers/:id` - Obtiene cliente por ID
- `PUT /customers/:id` - Actualiza cliente
- `DELETE /customers/:id` - Elimina cliente
- `GET /actuator/health` - Health check

### Product Service (:3002)
- `GET /products` - Lista todos los productos
- `GET /products?category=:category` - Productos por categoría
- `POST /products` - Crea un nuevo producto
- `GET /products/:id` - Obtiene producto por ID  
- `PUT /products/:id` - Actualiza producto
- `DELETE /products/:id` - Elimina producto
- `GET /products/:id/stock/:quantity` - Verifica stock disponible
- `GET /actuator/health` - Health check

### Order Service (:3003)
- `GET /orders` - Lista todos los pedidos
- `GET /orders?customerId=:id` - Pedidos de un cliente
- `POST /orders` - Crea un nuevo pedido (valida cliente y producto)
- `GET /orders/:id` - Obtiene pedido por ID
- `GET /orders/:id/summary` - Resumen completo del pedido
- `GET /actuator/health` - Health check

## Configuración

### Variables de Entorno (.env)

```bash
# Database Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=uceshop_user
POSTGRES_PASSWORD=uceshop_password
POSTGRES_DB=uceshop

# Service Ports
CUSTOMER_SERVICE_PORT=3001
PRODUCT_SERVICE_PORT=3002
ORDER_SERVICE_PORT=3003

# Service URLs (internal communication)
CUSTOMER_SERVICE_URL=http://customer-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
```

## Comandos Docker Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico  
docker-compose logs customer-service

# Reiniciar un servicio
docker-compose restart order-service

# Detener todos los servicios
docker-compose down

# Eliminar volúmenes (resetear DB)
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up --build customer-service
```

## Datos de Prueba

La base de datos se inicializa automáticamente con datos de ejemplo:

### Clientes
- Juan Pérez (juan.perez@uce.edu.ec)
- María González (maria.gonzalez@uce.edu.ec)
- Carlos Rodríguez (carlos.rodriguez@uce.edu.ec)

### Productos
- Libro UCE - Matemáticas I ($25.50)
- Cuaderno UCE Universitario ($3.75)
- Sudadera UCE Azul ($45.99)
- Libro UCE - Física General ($32.00)
- Cuaderno UCE Premium ($5.25)

## Solución de Problemas

1. **Servicios no se conectan a la DB**
   - Verificar que PostgreSQL esté ejecutándose
   - Revisar variables de entorno en `.env`

2. **Error en comunicación HTTP entre servicios**
   - Verificar que todos los servicios estén activos
   - Comprobar URLs de servicios en variables de entorno

3. **Puerto ya en uso**
   - Modificar puertos en `.env`
   - Verificar que no haya otros servicios corriendo

4. **Rebuilding después de cambios**
   ```bash
   docker-compose down
   docker-compose up --build
   ```