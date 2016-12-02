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

  it('should add a jsonSchema method onto every model', () => {
    jsonSchema({ models: [model] });
    /* eslint-disable no-unused-expressions */
    expect(model.jsonSchema).to.be.ok;
  });

  it('should call the generate json schema function with the correct arguements on call of jsonSchema', (done) => {
    const spy = sandbox.spy(schema, 'generate');
    jsonSchema({ models: [model] });

    model.jsonSchema(() => {
      const call = spy.getCall(0);
      expect(call.args[0]).to.deep.equal(model);
      done();
    });
  });

  it('should return the generated json schema on the new jsonSchema function', (done) => {
    sandbox.stub(schema, 'generate').returns('testSchema');
    jsonSchema({ models: [model] });

    model.jsonSchema((err, result) => {
      expect(err).to.equal(null);
      expect(result).to.equal('testSchema');
      done();
    });
  });

  it('should call the loopback remoteMethod function with the correct config', () => {
    jsonSchema({ models: [model] });

    const args = model.remoteMethod.getCall(0).args;

    expect(args[0]).to.equal('jsonSchema');
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
