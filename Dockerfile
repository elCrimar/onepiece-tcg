FROM node:18 AS build
WORKDIR /app

# Instalar Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Copiar archivos de dependencias
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install
RUN bun add -g @angular/cli@19

# Copiar el resto del código
COPY . .

# Verificar la estructura antes de la build
RUN ls -la

# Compilar la aplicación
RUN bunx ng build --configuration production

# Verificar la estructura de dist después de la build
RUN ls -la dist/*

FROM nginx:alpine as ngi
# Copiar la aplicación compilada (ajustada la ruta)
COPY --from=build /app/dist/* /usr/share/nginx/html/
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]