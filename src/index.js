import PropTypes from 'prop-types';
import React from 'react';
import SmartTextString from './SmartTextString';

const SmartText = ({ source, context = {}, wrap = false, multiline = false, wrapper }) => {
  const Paragraph = (props) => <p>{props.children}</p>;
  const Wrapper = wrapper || Paragraph;

  if (!multiline) {
    return wrap || wrapper ? (
      <Wrapper>
        <SmartTextString source={source} context={context} />
      </Wrapper>
    ) : (
      <SmartTextString source={source} context={context} />
    );
  }

  const Components = source
    .split(/\r?\n/) // Split on paragraph breaking newlines
    .map(line => line.trim()) // Trim lines
    .filter(line => line) // Filter out empty lines caused by multiple new lines
    .map((sourceLine, i) => (
      <Wrapper key={i}>
        <SmartTextString source={sourceLine} context={context} />
      </Wrapper>
    ));

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
  wrap: PropTypes.bool,
  wrapper: PropTypes.elementType,
  multiline: PropTypes.bool,
};

export default SmartText;
