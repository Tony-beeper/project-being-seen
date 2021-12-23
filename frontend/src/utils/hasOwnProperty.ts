// Check whether a given property exists on a given object (improvement over
// standard hasOwnProperty() method for TypeScript static checking)
const hasOwnProperty = <X extends {}, Y extends PropertyKey>(
  obj: X,
  property: Y
): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(property);
};

export default hasOwnProperty;
