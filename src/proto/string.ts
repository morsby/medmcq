// eslint-disable-next-line
String.prototype.toTitleCase = function () {
  return this[0].toUpperCase() + this.substring(1);
};

export default {}; // Required from typescript
