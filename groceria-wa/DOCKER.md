# Docker & Docker Hub

**Hub profile:** [hub.docker.com/repositories/akhilthadaa](https://hub.docker.com/repositories/akhilthadaa)

**Image name:** `akhilthadaa/groceria-wa:latest`

## Build locally

```bash
docker build -t akhilthadaa/groceria-wa:latest .
```

Optional WhatsApp number (digits only, country code included), baked in at build time:

```bash
docker build -t akhilthadaa/groceria-wa:latest --build-arg VITE_WHATSAPP_NUMBER=919876543210 .
```

## Run locally

```bash
docker run --rm -p 8080:80 akhilthadaa/groceria-wa:latest
```

Open [http://localhost:8080](http://localhost:8080).

Or with Compose (build + run on port 8080):

```bash
docker compose up --build -d
```

Set `PORT=80` in the environment if you want port 80.

## Push to Docker Hub (make the image “live” on Hub)

1. Create a repository on Docker Hub named `groceria-wa` under user `akhilthadaa` (if it does not exist).
2. Log in:

   ```bash
   docker login -u akhilthadaa
   ```

3. Build and push:

   ```bash
   docker build -t akhilthadaa/groceria-wa:latest .
   docker push akhilthadaa/groceria-wa:latest
   ```

Anyone can then run:

```bash
docker run --rm -p 8080:80 akhilthadaa/groceria-wa:latest
```

## Run on a VPS or cloud

On any Linux host with Docker:

```bash
docker pull akhilthadaa/groceria-wa:latest
docker run -d --name groceria -p 80:80 --restart unless-stopped akhilthadaa/groceria-wa:latest
```

Point your domain’s DNS A record to that server. Use HTTPS in production (e.g. Caddy, Traefik, or nginx with Let’s Encrypt in front of this container).

## CI: GitHub Actions

The workflow `.github/workflows/docker-publish.yml` builds and pushes `latest` when you push to `main`. Add these **repository secrets**:

- `DOCKERHUB_USERNAME` — `akhilthadaa`
- `DOCKERHUB_TOKEN` — a Docker Hub [access token](https://hub.docker.com/settings/security)
