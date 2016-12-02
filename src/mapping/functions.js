import { mapValues } from 'lodash';
import { transformProperty } from '../property';

/**
 * Transformation Functions
 */

export const lowercase = input => input.toLowerCase();

export const returnValue = input => input;

export const recurProperties = (input, resources = {}) =>
  mapValues(
    input, value => transformProperty(value, resources.mapping, resources.functions)
  );
