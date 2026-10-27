# Production image for the Nuxt frontend: build stage + slim runtime.
# NUXT_PUBLIC_* values are baked into the client bundle at build time, so pass
# them as build args for any non-local deployment:
#   docker build --build-arg NUXT_PUBLIC_API_BASE=https://api.example.com/api \
#                --build-arg NUXT_PUBLIC_API_ORIGIN=https://api.example.com frontend

FROM node:26-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ARG NUXT_PUBLIC_API_ORIGIN=http://localhost:8000
ARG NUXT_PUBLIC_API_BASE=http://localhost:8000/api
ARG NUXT_PUBLIC_TENANCY=true
ENV NUXT_PUBLIC_API_ORIGIN=$NUXT_PUBLIC_API_ORIGIN \
    NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE \
    NUXT_PUBLIC_TENANCY=$NUXT_PUBLIC_TENANCY

RUN npm run build

FROM node:26-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/.output ./.output

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
