FROM node:22.16.0-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.12.4 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV development

EXPOSE 5050

CMD ["pnpm", "start:dev"]
