const ReactSmartText = require('../dist');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const expect = require('expect.js');

const e = React.createElement;

describe('Testing ReactSmartText', function() {
  it('Should render simple mustache templates', function() {
    const element = e(ReactSmartText, {
      source: 'This is {{ article }} test',
      context: { article: 'an' },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('This is an test');
  });

  it('Should render with markdown', function() {
    const element = e(ReactSmartText, {
      source: 'This _is_ a test',
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('This <em>is</em> a test');
  });

  it('Should render with markdown & mustache', function() {
    const element = e(ReactSmartText, {
      source: 'This _is_ {{ article }} test',
      context: { article: 'an' },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('This <em>is</em> an test');
  });

  it('Should render with markdown bracketed spans', function() {
    const element = e(ReactSmartText, {
      source: 'This [is]{.red} a test',
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('This <span><span class="red" >is</span></span> a test');
  });

  it('Should render with React components', function() {
    class Name extends React.Component {
      render() {
        return e('span', null, `${this.props.name}!`);
      }
    }

    const element = e(ReactSmartText, {
      source: 'This _is_ {{ article }} test, {{ name }}',
      context: { article: 'an', name: e(Name, { name: 'Jon', key: 'i' }) },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('This <em>is</em> an test, <span>Jon!</span>');
  });

  it('Should pluralize based on context', function() {
    const element = e(ReactSmartText, {
      source: '{{ number }} {{ number.pluralize:person|people }} {{ number.pluralize:is|are }} typing',
      context: { number: 1 },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('1 person is typing');
  });
});
