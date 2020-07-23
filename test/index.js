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
    // extra span is from react, which rendereds naked text in a one
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
      context: { article: 'an', name: e(Name, { name: 'Jon', key: 'key' }) },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('This <em>is</em> an test, <span>Jon!</span>');
  });

  it('Should pluralize based on context variable', function() {
    const element = e(ReactSmartText, {
      source: '{{ number }} {{ number.pluralize:person|people }} {{ number.pluralize:is|are }} typing',
      context: { number: 1 },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('1 person is typing');
  });

  it('Should pluralize based on array of components', function() {
    const element = e(ReactSmartText, {
      source: '{{ people }} {{ people.pluralize:is|are }} typing',
      context: {
        people: [
          e('span', null, 'Jon'),
          e('span', null, '& Lisa'),
        ],
      },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('<span>Jon</span><span>&amp; Lisa</span> are typing');
  });

  it('Should pass props to a component', function() {
    class Elder extends React.Component {
      render() {
        const { age, ageRange, qualifier } = this.props;
        if (age > 30) {
          return e('span', null, `${qualifier} ${ageRange[1]}`);
        } else if (age > 20) {
          return e('span', null, `${ageRange[1]}`);
        }
        return e('span', null, `${ageRange[0]}`);
      }
    }

    const element = e(ReactSmartText, {
      source: 'It’s {{ name }}’s birthday! He is {{ age }}, which is {{ elder.props:ageRange=[young, old]|qualifier=very }}.',
      context: {
        name: 'Jon',
        age: 35,
        elder: e(Elder, { age: 35, key: 'key' }),
      },
    });
    const string = ReactDOMServer.renderToStaticMarkup(element);
    expect(string).to.be('It’s Jon’s birthday! He is 35, which is <span>very old</span>.');
  });
});
