FROM node:8.11.3-alpine

RUN mkdir /ymlx
COPY ["index.js", "reduce.js", "package.json", "package-lock.json", "test", "/ymlx/"]
WORKDIR /ymlx
RUN npm install
WORKDIR /

ENTRYPOINT ["node", "/ymlx/index.js"]
CMD ["--help"]
