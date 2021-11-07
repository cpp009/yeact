import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";

const hasOwnProperty = Object.prototype.hasOwnProperty;

const ReactElement = function (type, key, ref, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  };
  return element;
};

export function createElement(type, config, children) {
  let key = null;
  let ref = null;
  let props = {};

  if (config.key) {
    key = "" + config.key;
  }

  if (config) {
    key = "" + config.key;
    ref = config.ref;
  }

  for (const propName in config) {
    if (hasOwnProperty.call(config, propName)) {
      props[propName] = config[propName];
    }
  }

  let childrenLen = arguments.length - 2;
  if (childrenLen === 1) {
    props.children = arguments[2];
  } else if (childrenLen > 1) {
    let newChildren = new Array(childrenLen);
    for (let i = 0; i < childrenLen; i++) {
      newChildren[i] = arguments[2 + i];
    }

    props.children = newChildren;
  }

  return ReactElement(type, key, ref, props);
}
