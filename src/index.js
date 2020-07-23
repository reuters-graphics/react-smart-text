import Mustache from 'mustache';
import PropTypes from 'prop-types';
import React from 'react';
import RenderedString from './RenderedString';
import last from 'lodash/last';
import pickBy from 'lodash/pickBy';
import { toJson } from 'really-relaxed-json';

// Pluralize handlers
const isPluralize = (key) => key.split('.pluralize:').length > 1;
const getPluralizedParts = (key) => {
  const [context, pluralstring] = key.split('.pluralize:');
  const plurals = pluralstring.split('|').map(d => d.trim());
  return [context, plurals];
};
const isPlural = (context) => Array.isArray(context) ?
  context.length > 1 : context > 1;

// Props handlers
const isProps = (key) => key.split('.props:').length > 1;
const getPropsParts = (key) => {
  const [componentKey, propsString] = key.split('.props:');
  const propsParts = propsString.split('|').map(d => d.trim());
  const props = {};
  for (const propsPart of propsParts) {
    const [key, script] = propsPart.split('=');
    try {
      const prop = JSON.parse(toJson(script));
      props[key] = prop;
    } catch (e) {
      console.warn(`Unable to parse prop "${key}" in SmartText component. Skipping.`);
    }
  }
  return [componentKey, props];
};

const SmartText = ({ source, context = {} }) => {
  const tokens = Mustache.parse(source);
  const componentTokens = [];

  const concatOrAppend = (arr, item) => {
    const lastItem = last(arr);
    if (typeof lastItem === 'string' && typeof item === 'string') {
      arr.splice(-1, 1, lastItem + item);
    } else {
      arr.push(item);
    }
  };

  for (const token of tokens) {
    const [type, key] = token;
    // Text
    if (type === 'text') {
      concatOrAppend(componentTokens, key);
    // Template tokens
    } else if (type === 'name') {
      // Pluralize
      if (isPluralize(key)) {
        const [refKey, plurals] = getPluralizedParts(key);
        const [singular, plural] = plurals;
        const contextElement = context[refKey];
        if (!contextElement) continue;
        if (isPlural(contextElement)) {
          concatOrAppend(componentTokens, plural);
        } else {
          concatOrAppend(componentTokens, singular);
        }
        continue;
      }

      // Props
      if (isProps(key)) {
        const [componentKey, props] = getPropsParts(key);
        const component = context[componentKey];
        if (!component) continue;
        componentTokens.push(React.cloneElement(component, props));
        continue;
      }

      // Recreate mustache templates to pass through for later processing
      if (!context[key] || typeof context[key] === 'string') {
        concatOrAppend(componentTokens, `${Mustache.tags[0]} ${key} ${Mustache.tags[1]}`);

      // Components
      } else {
        componentTokens.push(context[key]);
      }
    }
  };

  const cleanContext = pickBy(context, d => typeof d === 'string');

  const Components = componentTokens.map((componentToken, i) => {
    if (typeof componentToken !== 'string') return componentToken;
    return (
      <RenderedString
        source={componentToken}
        context={cleanContext}
        key={i}
      />
    );
  });

  return (<>{Components}</>);
};

SmartText.propTypes = {
  source: PropTypes.string.isRequired,
  context: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ])),
  ])),
};

export default SmartText;
