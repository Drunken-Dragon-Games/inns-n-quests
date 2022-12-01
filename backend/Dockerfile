FROM node:18

WORKDIR /usr/src/app

COPY --chown=node package*.json ./
COPY --chown=node ./dist ./dist
COPY --chown=node ./node_modules ./node_modules

USER node
EXPOSE 8080
CMD [ "node", "dist/main.js" ]