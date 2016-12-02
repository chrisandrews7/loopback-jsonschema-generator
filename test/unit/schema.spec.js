import { expect } from 'chai';
import sinon from 'sinon';
import { generate } from '../../src/schema';
import property from '../../src/property';
import mapping from '../../src/mapping/transforms.json';
import * as functions from '../../src/mapping/functions';

describe('Schema', () => {
  const buildModel = (properties = {}) => ({
    modelName: 'TestModel',
    definition: {
      properties
    }
  });

  it('should return the $schema from options', () => {
    const schemaValue = 'http://someschemaurl.com/schema';
    const result = generate(buildModel(), {
      schema: schemaValue
    });
    expect(result.$schema).to.equal(schemaValue);
  });

  it('should return the title', () => {
    const result = generate(buildModel(), {});
    expect(result.title).to.equal('TestModel');
  });

  it('should the correct type', () => {
    const result = generate(buildModel(), {});
    expect(result.type).to.equal('object');
  });

  it('should throw a reference error if no properties are passed in the model argument', () => {
    expect(generate.bind(null, {}, {})).to.throw(ReferenceError);
  });

  it('should return an empty array/object for properties/required if no model properties are present', () => {
    const result = generate(buildModel(), {});
    expect(result.properties).to.deep.equal({});
    expect(result.required).to.deep.equal([]);
  });

  it('should return an list properties', () => {
    const result = generate(buildModel({
      shouldExist: {
        title: 'test',
        type: {
          name: 'string'
        }
      }
    }), {});
    expect(result.properties).to.include.keys('shouldExist');
  });

  it('should return an array of all required properties', () => {
    const result = generate(buildModel({
      requiredTest: {
        title: 'test',
        type: {
          name: 'string'
        },
        required: true
      }
    }), {});
    expect(result.required).to.include('requiredTest');
  });

  it('should use the transformProperty function with the correct mapping/functions', () => {
    const stub = sinon.stub(property, 'transformProperty').returns({});
    const data = {
      test: {
        title: 'test',
        required: false
      }
    };
    generate(buildModel(data), {});

    expect(stub.calledWithExactly(
      data.test,
      mapping,
      functions
    )).to.be.ok;
  });
});
