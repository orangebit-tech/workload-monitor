# Workload Monitor

Team workload visualization

## Project setup
```
create .env following env.example, populate respectively. All fields are required

note, that there are two env.example files: one in the route directory, the other one in jira_proxy_server folder.

```
### Prepare front end for prod
```
navigate to the root folder, run: 
npm install
npm run build

copy .htaccess to /dist

```
### Prepare server for prod 
```
* do not forget to open ports, entered in .env(VUE_APP_HTTP_PORT and VUE_APP_HTTPS_PORT)

navigate to /jira_proxy_server, run: 
npm install

node proxy.js


```
## DEFAULT

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
