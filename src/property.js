import { get, set, has } from 'lodash';

function transformProperty(input, mapping = [], functions = {}) {
  const property = {};

  // Run each transformation
  mapping.forEach((item) => {
    // Get the original value
    let originalValue = get(input, item.search.key);

    // Function transformation
    if (item.transform.func && has(input, item.search.key)) {
      // If the property has already been transformed
      // then take the transformed value and not the original input,
      // this will allow for transforms to be chained and not override each other
      if (property[item.search.key]) {
        originalValue = get(property, item.search.key);
      }

      // Run the transformation function on the value
      const transformedValue = functions[item.transform.func](originalValue, {
        mapping, // Added resources for functions
        functions
      });

      set(property, item.transform.key, transformedValue);

      // Basic value swap transformation
    } else if (item.search.value && new RegExp(item.search.value).test(originalValue)) {
      set(property, item.transform.key, item.transform.value);
    }
  });

  return property;
}

export default {
  transformProperty
};
