# Cowin Verify API

## API

1. Get vaccination data from certificate image

```
POST /verify-certificate

request:
file: Blob (multipart/form-data)

response:
{
  data: CertificateData
}
```

## Setup

run `yarn` command to install dependencies

---

### Development

run `yarn watch` command to start server and listen to changes

---

### Start server

1. run `yarn build` to build
1. run `yarn start` to start server

---

### Deploy app using PM2

First build the app by running command. 
run `npm run build` to build app to `dist` folder

run `pm2 start ecosystem.config.js` to start app

run `pm2 stop ecosystem.config.js` to stop 

run `pm2 restart ecosystem.config.js` to restart

run `pm2 reload ecosystem.config.js` to reload

run `pm2 delete ecosystem.config.js` to delete
