# Usa la imagen base de Node.js
FROM node:16-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación y instala serve
RUN npm run build && \
    npm install -g serve

# Expone el puerto 3001
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build", "-l", "3001"]
