
# Stage 1: build stage
FROM node:22-alpine as build-stage
# make the 'app' folder the current working directory
WORKDIR /app
# config node options
ENV NODE_OPTIONS=--max_old_space_size=8192
# config pnpm, install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install pnpm@9.x -g && \
    pnpm install --frozen-lockfile
# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . ./
# build the project
RUN pnpm build
RUN echo "build successful  🎉 🎉 🎉"


# Stage 2: production stage
FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
RUN echo "deploy to nginx successful  🎉 🎉 🎉"