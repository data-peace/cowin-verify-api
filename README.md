Cowin Verify API
===================

## API Endpoints

1. Get certificate data from certificate image

Request
```
POST /verify-certificate
Content-Type: multipart/form-data

file: <Image-Binary-data>
```


Response
```
200 OK
Content-Type: application/json

{
  "data": {
    "shortInfo": {
      "userRefId": "",
      "name": "",
      "gender": "",
      "age": "",
      "nationality": "",
      "vaccineDosesGiven": "",
      "vaccineTotalDosesNeeded": "",
    },
    "certificateData": {}
  }
}
```

## Setup project

1. Run `yarn` command to install dependencies
1. Run `yarn watch` command to start server and listen to changes
1. run `yarn build` to build the project. Build project located in `dist` folder.
1. run `yarn start` to start server

## Deploy app using PM2
First build the app then run the app

1. Run `npm run build` to build app to `dist` folder
1. Run `pm2 start pm2-ecosystem.config.js` to start app
1. Run `pm2 stop pm2-ecosystem.config.js` to stop 
1. Run `pm2 restart pm2-ecosystem.config.js` to restart
1. Run `pm2 reload pm2-ecosystem.config.js` to reload
1. Run `pm2 delete pm2-ecosystem.config.js` to delete
