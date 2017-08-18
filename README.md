# OpenAPI / Swagger spec generator for [Tyranid](http://tyranid.org/)

[![npm version](https://badge.fury.io/js/tyranid-openapi.svg)](https://badge.fury.io/js/tyranid-openapi)
[![Build Status](https://travis-ci.org/CrossLead/tyranid-openapi.svg?branch=master)](https://travis-ci.org/CrossLead/tyranid-openapi)
[![codecov](https://codecov.io/gh/CrossLead/tyranid-openapi/branch/master/graph/badge.svg)](https://codecov.io/gh/CrossLead/tyranid-openapi)

This project provides a way to generate a complete + valid [openAPI spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) by adding schema annotations to your [tyranid](http://tyranid.org/) models.

**NOTE**: this library only creates the spec itself, implementation is left to the app code for now (but might be a good feature for this library later on).

## Exposing a single collection

The most basic way to expose a collection to the public api is by setting the `openAPI` flag to `true`, and marking a few properties to show. For example...

```typescript
import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 't01',
  name: 'metric',
  dbName: 'metrics',

  // this indicates that we want GET/PUT/POST/DELETE endpoints
  // for `/metrics` and  `/metrics/{_id}`. Additionally, `read:metrics` and
  // `write:metrics` scopes will be created.
  openAPI: true,

  fields: {
    _id: { is: 'mongoid' },
    organizationId: { is: 'mongoid' },

    // here we mark that we want to expose this field to the api
    // also, since it is marked `required`, api users will recieve
    // an error if they do not POST/PUT data that includes it.
    name: { is: 'string', openAPI: true, required: true }
  },
});
```

## Setting a status flag to track deletions

## Renaming and Restricting certain properties

## Partitioning a collection into multiple "virtual" collections
