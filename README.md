# statistics.reg

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Deploying Front End (VUE)

```
cd app
docker build -t vuejs-nginx-docker/statistics.reg-app .
docker run -it -p 9087:80 --rm --name statistics.reg-app vuejs-nginx-docker/statistics.reg-app
```

### Deploying Back End (EXPRESS API)

```
cd api
docker build -t  node-express-docker/statistics.reg-api .
docker run -p 8182:8182 --name statistics.reg-api node-express-docker/statistics.reg-api
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
