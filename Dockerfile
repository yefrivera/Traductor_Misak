FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto (por defecto Cloud Run usa 8080)
EXPOSE 8080

# Iniciar la app
CMD [ "node", "server.js" ]
