module.exports = function( template ) {
  return function(data) {
    function getDeep( subject, keys ) {
      if ( 'string' === typeof keys ) {
        keys = keys.split('.');
      }
      keys.forEach(function ( key ) {
        if ( subject.hasOwnProperty(key) ) {
          subject = subject[key];
        } else {
          subject = null;
        }
      });
      return subject;
    }
    if ( typeof data === 'object' ) {
      return template.replace(/{([\w\d\-_]+?(\.[\w\d\-_\.]+?)?)}/g, function ( match, key ) {
        var output = getDeep(data,key);
        if ( 'undefined' === typeof output ) return match;
        if ( null        ===        output ) return match;
        if ( true        ===        output ) return 'true';
        if ( false       ===        output ) return 'false';
        return output;
      });
    } else {
      var args = arguments;
      return template.replace(/{(\d+?)}/g, function ( match, number ) {
        return args[ number ] || match;
      });
    }
  };
};
