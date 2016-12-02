import { reduce } from 'lodash';
import { transformProperty } from './property';
import mapping from './mapping/transforms.json';
import * as functions from './mapping/functions';

const generate = (model, options) => {
  if (!model.definition || !model.definition.properties) {
    throw new ReferenceError('No valid properties found on this model.');
  }

  const jsonSchema = {
    $schema: options.schema,
    title: model.modelName,
    type: 'object',
    properties: {},
    required: []
  };

  return reduce(model.definition.properties, (schema, prop, key) => {
    const prettyProperty = transformProperty(prop, mapping, functions);

    schema.properties[key] = prettyProperty;

    if (prettyProperty.required) {
      schema.required.push(key);
    }

    return schema;
  }, jsonSchema);
};

export default {
  generate
};
