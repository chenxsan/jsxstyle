'use strict';

const getStyleKeysForProps = require('./getStyleKeysForProps');
const addStyleToHead = require('./addStyleToHead');
const stringHash = require('./stringHash');

let classNameCache;

if (module.hot) {
  if (typeof module.hot.data === 'object') {
    classNameCache = module.hot.data.classNameCache;
  }

  module.hot.addDisposeHandler(function(data) {
    data.classNameCache = classNameCache;
  });
}

if (!classNameCache) {
  classNameCache = {};
}

function getClassNameStringFromProps(props) {
  const styleObj = getStyleKeysForProps(props);
  if (typeof styleObj !== 'object' || styleObj === null) {
    return props.className || null;
  }
  const key = styleObj.classNameKey;
  let className;
  if (!classNameCache.hasOwnProperty(key)) {
    className = classNameCache[key] = '_j' + stringHash(key).toString(36);
    delete styleObj.classNameKey;
    Object.keys(styleObj)
      .sort()
      .forEach(k => addStyleToHead(className, styleObj[k]));
  } else {
    className = classNameCache[key];
  }
  return props.className ? props.className + ' ' + className : className;
}

module.exports = getClassNameStringFromProps;