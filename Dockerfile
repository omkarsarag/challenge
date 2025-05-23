FROM node:alpine

RUN npm install -g cors-anywhere

ENTRYPOINT ["node", "/usr/local/lib/node_modules/cors-anywhere/server.js"]
CMD ["--port", "8080"]
