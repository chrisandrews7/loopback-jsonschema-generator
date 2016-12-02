import { expect } from 'chai';
import sinon from 'sinon';
import { transformProperty } from '../../src/property';

describe('Property', () => {
  describe('Simple Transformation', () => {
    it('should return nothing if no transform mapping or functions are passed in', () => {
      const data = {
        title: 'test',
        required: 'oldValue'
      };
      const result = transformProperty(data);

      expect(result).to.deep.equal({});
    });

    it('should add the transform value if the search criteria is met', () => {
      const mapping = [{
        search: {
          key: 'title', // The key to search on
          value: 'test' // The value to search for on the above key
        },
        transform: {
          key: 'required', // The new key to add
          value: 'newValue' // The new value to assign to the above key
        }
      }];
      const data = {
        title: 'test',
        required: 'oldValue'
      };

      const expectedResult = {
        required: 'newValue'
      };
      const result = transformProperty(data, mapping);

      expect(result).to.deep.equal(expectedResult);
    });

    it('should add the transform value if dot notation search criteria are met', () => {
      const mapping = [{
        search: {
          key: 'required.deep.value',
          value: 'test'
        },
        transform: {
          key: 'title',
          value: 'newValue'
        }
      }];
      const data = {
        required: {
          deep: {
            value: 'test'
          }
        },
        title: 'oldValue'
      };

      const expectedResult = {
        title: 'newValue'
      };
      const result = transformProperty(data, mapping);

      expect(result).to.deep.equal(expectedResult);
    });

    it('should add the transform value if regex search criteria are met', () => {
      const mapping = [{
        search: {
          key: 'type',
          value: 'String|Number'
        },
        transform: {
          key: 'title',
          value: 'newValue'
        }
      }];
      const data = {
        type: 'Number',
        title: 'oldValue'
      };

      const expectedResult = {
        title: 'newValue'
      };
      const result = transformProperty(data, mapping);

      expect(result).to.deep.equal(expectedResult);
    });

    it('shouldnt add anything if the search criteria isnt met', () => {
      const mapping = [{
        search: {
          key: 'badCritera',
          value: '[0-9]'
        },
        transform: {
          key: 1,
          value: 'newValue'
        }
      }];
      const data = {
        badCritera: 'not-a-number'
      };

      const expectedResults = {};
      const result = transformProperty(data, mapping);

      expect(result).to.deep.equal(expectedResults);
    });

    it('shouldnt add anything if the search criteria is missing', () => {
      const mapping = [{
        search: {},
        transform: {
          key: 'newKey',
          value: 'newValue'
        }
      }];
      const data = {
        badCritera: 'test'
      };

      const result = transformProperty(data, mapping);
      expect(result).to.deep.equal({});
    });
  });

  describe('Function Transformation', () => {
    it('should use the transform function using the search result if the search criteria is met', () => {
      const functions = {
        testFunc: input => input + 1
      };
      const mapping = [{
        search: {
          key: 'number'
        },
        transform: {
          key: 'newNumberKey',
          func: 'testFunc'
        }
      }];
      const data = {
        number: 1
      };

      const expectedResult = {
        newNumberKey: 2
      };
      const result = transformProperty(data, mapping, functions);

      expect(result).to.deep.equal(expectedResult);
    });

    it('shouldnt run anything if the search key doesnt exist', () => {
      const functions = {
        testFunc: sinon.spy()
      };
      const mapping = [{
        search: {
          key: 'cantFindMe'
        },
        transform: {
          key: 'dontAdd',
          func: 'testFunc'
        }
      }];
      const data = {
        shouldntSee: 1
      };

      const result = transformProperty(data, mapping, functions);

      expect(result).to.deep.equal({});
      expect(functions.testFunc.called).to.equal(false);
    });

    it('should pass the transform mapping/functions to the transformation function', () => {
      const functions = {
        testFunc: sinon.spy()
      };
      const mapping = [{
        search: {
          key: 'test'
        },
        transform: {
          key: 'another',
          func: 'testFunc'
        }
      }];
      const data = {
        test: 1
      };

      transformProperty(data, mapping, functions);

      expect(functions.testFunc.calledWithExactly(
        data.test,
        { mapping, functions }
      )).to.be.ok;
    });

    it('should run the transformation function on the new value if it exists (Chaining)', () => {
      const functions = {
        testFunc: input => input + 2, // Will change to 3
        anotherTestFunc: input => input + 10 // Will change to 13
      };
      const mapping = [
        {
          search: {
            key: 'testKey'
          },
          transform: {
            key: 'testKey',
            func: 'testFunc'
          }
        },
        {
          search: {
            key: 'testKey'
          },
          transform: {
            key: 'testKey',
            func: 'anotherTestFunc'
          }
        }
      ];
      const data = {
        testKey: 1
      };

      const result = transformProperty(data, mapping, functions);
      expect(result.testKey).to.equal(13);
    });
  });
});
