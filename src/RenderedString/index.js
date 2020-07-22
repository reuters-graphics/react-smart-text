import Mustache from 'mustache';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import bracketedSpans from 'remark-bracketed-spans';

const RenderedString = (props) => {
  const markdownString = Mustache.render(props.source, props.context);
  return (
    <ReactMarkdown
      source={markdownString}
      escapeHtml={false}
      disallowedTypes={['paragraph']}
      unwrapDisallowed
      plugins={[[bracketedSpans]]}
    />);
};

export default RenderedString;
