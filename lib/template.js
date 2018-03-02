module.exports = function( template ) {
  return function(data) {
    function getDeep( subject, keys ) {
      if ( 'string' === typeof keys ) {
        keys = keys.split('.');
      }
      keys.forEach(function ( key ) {
        subject = subject && subject[ key ] || null;
      });
      return subject;
    }
    if ( typeof data === 'object' ) {
      return template.replace(/{([\w\d\-_]+?(\.[\w\d\-_\.]+?)?)}/g, function ( match, key ) {
        return getDeep(data, key) || match;
      });
    } else {
      var args = arguments;
      return template.replace(/{(\d+?)}/g, function ( match, number ) {
        return args[ number ] || match;
      });
    }
  }
};
