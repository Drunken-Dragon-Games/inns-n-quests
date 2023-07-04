FROM denoland/deno:1.34.3

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY --chown=deno ./deno.lock ./deno.lock
COPY --chown=deno ./src/deps.ts ./src/deps.ts
RUN deno cache ./src/deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY --chown=deno ./src ./src
RUN deno cache ./src/server.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "src/server.ts"]