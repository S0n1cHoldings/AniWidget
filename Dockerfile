FROM oven/bun:1.3.13-slim

WORKDIR /app
COPY . /app

RUN bun install --frozen-lockfile
RUN bun build:site

# install wget for Coolify healthchecks
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "site"]
