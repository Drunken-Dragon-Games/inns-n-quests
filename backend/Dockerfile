FROM node:18

WORKDIR /usr/src/app

COPY --chown=node package*.json ./
COPY --chown=node ./dist ./dist
COPY --chown=node ./node_modules ./node_modules
COPY --chown=node ./nfts_metadata ./nfts_metadata

USER node
EXPOSE 5000
CMD [ "node", "dist/server.js" ]
