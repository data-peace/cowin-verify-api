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
