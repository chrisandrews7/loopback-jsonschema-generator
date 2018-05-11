# Loopback JSON Schema Generator

[![Build Status](https://travis-ci.org/chrisandrews7/loopback-jsonschema-generator.svg?branch=master)](https://travis-ci.org/chrisandrews7/loopback-jsonschema-generator) [![Coverage Status](https://coveralls.io/repos/github/chrisandrews7/loopback-jsonschema-generator/badge.svg?branch=master)](https://coveralls.io/github/chrisandrews7/loopback-jsonschema-generator?branch=master) [![npm version](https://img.shields.io/npm/v/loopback-jsonschema-generator.svg?style=flat)](https://www.npmjs.com/package/loopback-jsonschema-generator)

Generates JSON schemas for your [LoopBack](https://github.com/strongloop/loopback) models

## Installing
```
npm install loopback-jsonschema-generator
```

## Setup

### Initialising

Add the following configuration to `component-config.js` inside your loopback project

```json
{
  "loopback-jsonschema-generator": {},
  "..."
}
```

### Configuration options

- **schema** - JSON Schema specification
- **url** - Url to access each JSON schema endpoint, defaults to 'json-schema'

```json
{
  "loopback-jsonschema-generator": {
    "schema": "http://json-schema.org/draft-04/schema",
    "url": "json-schema"
  },
  "..."
}
```

## Using

### Define a model inside loopback as normal

```json
# products.json
{
    "name": "Products",
    "base": "PersistedModel",
    "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "required": true
        }
    },
    "validations": [],
    "relations": {},
    "acls": [],
    "methods": {}
}
```

### Access the generated JSON schema url

`http://yourapi.com/api/products/json-schema`

```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Products",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "title": "Name"
      }
    },
    "required": [
      "name"
    ]
}
```

### Programmatic access to the json schema

A property is added onto each model under `model.jsonSchema`

```js
// Model file
module.exports = function(Products) {
  const jsonSchema = Products.jsonSchema;
  //...
};
```

## References

http://json-schema.org/
