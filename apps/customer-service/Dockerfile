# Dockerfile del Customer Service
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copiar archivos de package (etapa desarrollo)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar el customer service
RUN npm run build customer-service

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copiar archivos de package (etapa producción)
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar aplicación compilada
COPY --from=development /usr/src/app/dist/apps/customer-service ./dist

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

# Exponer puerto
EXPOSE 3001

# Verificación de salud
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/main.js --healthcheck || exit 1

# Iniciar el servicio
CMD ["node", "dist/main.js"]