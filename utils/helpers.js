
String.prototype.capitalize = function() {
  if (typeof this !== 'string') return '';
  // return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  return this.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export const capitalize = String.prototype.capitalize;
