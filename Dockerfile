FROM node:16-alpine

# Instala herramientas útiles para diagnóstico
RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copia archivos de dependencias primero
COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --only=production

# Copia el resto de la aplicación
COPY . .

# Expone el puerto correcto
EXPOSE 8080

# Health check para Cloud Run
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1

# Usa node directamente
CMD ["node", "server.js"]