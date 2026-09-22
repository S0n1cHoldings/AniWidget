FROM oven/bun:1.4.2-slim AS base

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/site/package.json ./packages/site/package.json
COPY packages/utils/package.json ./packages/utils/package.json

FROM base AS build

RUN bun install --frozen-lockfile --ignore-scripts

COPY packages ./packages

RUN bun run build:site

FROM base AS production-dependencies

RUN bun install --frozen-lockfile --production --ignore-scripts

FROM oven/bun:1.4.2-slim AS runtime

WORKDIR /app

RUN apt-get update \
	&& apt-get install --no-install-recommends -y curl \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=production-dependencies /app/package.json ./package.json
COPY --from=production-dependencies /app/packages ./packages

# The generated server can still resolve source-based workspace packages.
COPY --from=build /app/packages/core/lib ./packages/core/lib
COPY --from=build /app/packages/db/lib ./packages/db/lib
COPY --from=build /app/packages/utils/lib ./packages/utils/lib
COPY --from=build /app/packages/site/build ./packages/site/build

EXPOSE 3000
ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD curl --fail --silent --show-error "http://127.0.0.1:${PORT}/api/health" > /dev/null || exit 1

CMD ["bun", "run", "packages/site/build/index.js"]
