import Mustache from 'mustache';
import React from 'react';
import RenderedString from './RenderedString';
import last from 'lodash/last';
import pickBy from 'lodash/pickBy';

const isPluralize = (key) => key.split('.pluralize:').length > 1;
const getPluralizedParts = (key) => {
  const [context, pluralstring] = key.split('.pluralize:');
  const plurals = pluralstring.split('|').map(d => d.trim());
  return [context, plurals];
};
const isPlural = (context) => Array.isArray(context) ?
  context.length > 1 : context > 1;

const RenderedRichString = ({ source, context = {} }) => {
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
      // Pluralize strings
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

      // Mustache templates
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

export default RenderedRichString;
