[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/BtcRelax/kuna-api-sdk)

# Kuna API SDK

### Quick start

Create file production.json and default.json from default.json.sample

```
cd config
cp default.json.sample default.json
cp default.json.sample production.json
```



#### How to set environment

`$env:NODE_ENV = 'production'` - to turn on production configuration (Windows case) 
If you want to use port 80 for listening, without root. Run:
```
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```


#### Add and start as service

Before beginig you need to install package [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)

```
 npm install pm2@latest -g
```

and  for add service 

```
pm2 start npm --name "kuna api" --log-date-format 'DD-MM HH:mm:ss.SSS' -- start
```