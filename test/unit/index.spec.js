import { expect } from 'chai';
import sinon from 'sinon';
import schema from '../../src/schema';
import jsonSchema from '../../src';

describe('Index', () => {
  let sandbox;
  let model;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    model = {
      modelName: 'test',
      remoteMethod: sandbox.spy(),
      definition: {
        properties: {}
      }
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should expose a schema property with the jsonSchema on every model', () => {
    sandbox.stub(schema, 'generate').returns('testSchemaProperty');
    jsonSchema({ models: [model] });

    expect(model.jsonSchema).to.equal('testSchemaProperty');
  });

  it('should add a getJsonSchema method onto every model', () => {
    jsonSchema({ models: [model] });
    /* eslint-disable no-unused-expressions */
    expect(model.getJsonSchema).to.be.ok;
  });

  it('should call the generate json schema function with the correct arguements on call of jsonSchema', (done) => {
    const spy = sandbox.spy(schema, 'generate');
    jsonSchema({ models: [model] });

    model.getJsonSchema(() => {
      const call = spy.getCall(0);
      expect(call.args[0]).to.deep.equal(model);
      done();
    });
  });

  it('should return the generated json schema on the new jsonSchema function', (done) => {
    sandbox.stub(schema, 'generate').returns('testSchema');
    jsonSchema({ models: [model] });

    model.getJsonSchema((err, result) => {
      expect(err).to.equal(null);
      expect(result).to.equal('testSchema');
      done();
    });
  });

  it('should call the loopback remoteMethod function with the correct config', () => {
    jsonSchema({ models: [model] });

    const args = model.remoteMethod.getCall(0).args;

    expect(args[0]).to.equal('getJsonSchema');
    expect(args[1].isStatic).to.equal(true);
    expect(args[1].accessType).to.equal('READ');
    expect(args[1].returns.root).to.equal(true);
    expect(args[1].http.verb).to.equal('GET');
  });

  it('should set the schema url to the default if one isnt provided', () => {
    jsonSchema({ models: [model] });

    const args = model.remoteMethod.getCall(0).args;
    expect(args[1].http.path).to.equal('/json-schema');
  });

  it('should set the schema url using the options', () => {
    const url = 'testing-url';
    jsonSchema({ models: [model] }, {
      url
    });

    const args = model.remoteMethod.getCall(0).args;
    expect(args[1].http.path).to.equal(`/${url}`);
  });
});
