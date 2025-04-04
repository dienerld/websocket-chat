FROM node:20-slim as builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=development



RUN apt-get update && apt-get install -y curl git && \
  apt-get clean && apt-get autoclean && apt-get autoremove -y && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm && npm cache clean --force

RUN mkdir -p $PNPM_HOME && \
  pnpm config set store-dir $PNPM_HOME


USER node

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-slim as production

RUN corepack enable

WORKDIR /home/node/app

ENV NODE_ENV=production

COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/package.json ./package.json
COPY --from=builder /home/node/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --only=production

CMD ["pnpm", "start"]
