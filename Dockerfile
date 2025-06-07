# Usa la imagen oficial de Node.js
FROM node:16-alpine

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que usa tu aplicación
EXPOSE 8080

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]