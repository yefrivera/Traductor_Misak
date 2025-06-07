FROM node:16-alpine

# Crea y establece el directorio de trabajo
WORKDIR /usr/src/app

# Primero copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias de producción
RUN npm ci --only=production

# Copia el resto de los archivos
COPY . .

# Expone el puerto
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]