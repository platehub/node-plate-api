# Plate API

[![npm version](https://badge.fury.io/js/plate-api.svg)](https://badge.fury.io/js/plate-api)
[![Build Status](https://travis-ci.com/platehub/node-plate-api.svg?branch=master)](https://travis-ci.com/platehub/node-plate-api)
[![install size](https://packagephobia.now.sh/badge?p=plate-api)](https://packagephobia.now.sh/result?p=plate-api)

Welcome to the Node Plate Api package for Node.js

## Installation:
```shell
npm install --save plate-api
```

## Usage

To initialize an instance of the PlateAPI:

```javascript
PlateApi = require("./app.js");

// Replace 'publickey' and 'secretkey' with the keys of your API integration.
plate_api = new PlateApi("publickey", "secretkey")
```

To make a request:

```javascript
plate_api.sendRequest(
  "POST",
  "/site_translations/471/posts",
  {
    content_type_id: 11373,
    title: "An API Page!",
    slug: "a-slug-for-api"
  }
).then(
  function (response) {
    console.log("Successful response");
    console.log(response.body);
  },
  function (response) {
    console.log("Error response");
    console.log(response.body);
  }
)
```
