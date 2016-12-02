import { each, defaults } from 'lodash';
import { generate } from './schema';

export default (app, opts) => {
  const options = defaults({}, opts, {
    schema: 'http://json-schema.org/draft-04/schema#',
    url: 'json-schema'
  });

  each(app.models, (model) => {
    model.jsonSchema = (cb) => {
      const schema = generate(model, options);
      cb(null, schema);
    };

    model.remoteMethod(
      'jsonSchema',
      {
        description: 'Get the json schema for the given loopback model.',
        accessType: 'READ',
        returns: {
          arg: 'schema',
          type: 'string',
          root: true
        },
        isStatic: true,
        http: {
          path: `/${options.url}`,
          verb: 'GET'
        }
      }
    );
  });
};
