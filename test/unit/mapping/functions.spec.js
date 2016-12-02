import { expect } from 'chai';
import sinon from 'sinon';
import property from '../../../src/property';
import * as functions from '../../../src/mapping/functions';

describe('Mapping functions', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#lowercase()', () => {
    it('should return the input in lowercase format', () => {
      expect(functions.lowercase('TEST')).to.equal('test');
    });
  });

  describe('#returnValue()', () => {
    it('should return original value as is', () => {
      expect(functions.returnValue('test')).to.equal('test');
      expect(functions.returnValue('1')).to.not.equal(1);
      expect(functions.returnValue({
        test: 1
      })).to.deep.equal({
        test: 1
      });
    });
  });

  describe('#assignProperties()', () => {
    it('should return the retain all of the original keys', () => {
      sandbox.stub(property, 'transformProperty');
      const data = {
        keyToTest: 'test',
        anotherTestKey: 'test'
      };

      expect(functions.recurProperties(data)).to.have.all.keys(Object.keys(data));
    });

    it('should use the transformProperty function to transform each value from the input', () => {
      const stub = sandbox.stub(property, 'transformProperty').returns(2);
      const data = {
        testKey: 'test',
        anotherTestKey: 'test'
      };

      const result = functions.recurProperties(data);

      expect(stub.callCount).to.equal(2);
      expect(result).to.deep.equal({
        testKey: 2,
        anotherTestKey: 2
      });
    });

    it('should use the pass the resources to the transformProperty function', () => {
      const stub = sandbox.stub(property, 'transformProperty');
      const data = {
        testKey: 'test'
      };
      const resources = {
        functions: 'functionsHere',
        mapping: 'mappingHere'
      };

      functions.recurProperties(data, resources);

      expect(stub.calledWithExactly(data.testKey, resources.mapping, resources.functions)).to.be.ok;
    });
  });
});
