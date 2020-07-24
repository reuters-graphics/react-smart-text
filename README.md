![](badge.svg)

# @reuters-graphics/react-smart-text

[![npm version](https://badge.fury.io/js/%40reuters-graphics%2Freact-smart-text.svg)](https://badge.fury.io/js/%40reuters-graphics%2Freact-smart-text) [![Reuters open source software](https://badgen.net/badge/Reuters/open%20source/?color=ff8000)](https://github.com/reuters-graphics/)

"Smart text" is text with [Mad Libs](https://en.wikipedia.org/wiki/Mad_Libs)-style replacement. We use it to create sentences that respond to data.

> There have been _ _ _ _ _ _ _ reported votes.


### Why this

This library helps us write smart text in React using tools for formatting and replacement, including [Markdown](https://guides.github.com/features/mastering-markdown/) and [mustache templating](https://mustache.github.io/). Often our source text comes from a separate API (usually a reporter-written Google Doc), which we marry up to data within our app.

SmartText is particularly useful for dealing with translation where the order of words you're replacing within a sentence changes between languages.


### Install

```
$ yarn add @reuters-graphics/react-smart-text react
```

### Use

SmartText component takes two props:

- `source`: The template text (required)
- `context`: Replacement variables

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = 'Hi, my name is {{ name }}.';
const context = { name: 'Jon' };

<SmartText source={source} context={context}/>
// Hi, my name is Jon.
```


### Features


##### Markdown

You can use [Markdown](https://guides.github.com/features/mastering-markdown/) in your source, including [bracketed spans](https://github.com/sethvincent/remark-bracketed-spans).

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = 'This _is_ [a]{.red} test.';

const MySmartText = () => (
  <SmartText source={source} />
);
// This <em>is</em> <span><span class="red" >a</span></span> test.
```

##### mustache

You can use [mustache templates](https://mustache.github.io/) to replace placeholders with values or React components.

```javascript
const MyName = (props) => <span>{props.name}</span>;

const source = 'Hiya, {{ name }}. This is {{ article }} test.';
const context = {
  article: 'an',
  name: <MyName name='Jon' key='key' />,
  // (Recommend you always add a ☝️ key to your component b/c
  // it will be rendered as part of an array.)
};

const MySmartText = () => (
  <SmartText source={source} context={context} />
);
// Hiya, <span>Jon</span>. This is an test.
```

##### Pluralization

You can pluralize text based on other context variables.

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = '{{ number }} {{ number.pluralize:person is|people are }} typing.';
const context = { number: 2 };

const MySmartText = () => (
  <SmartText source={source} context={context} />
);
// 2 people are typing.
```

##### Custom props

You can pass additional props to a component directly within your source. Write props as `prop=value` separated by pipes `|`. Your value can be written in [Relaxed JSON](http://www.relaxedjson.org/) format to create objects or arrays.

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const Elder = (props) => {
  const { age, ageRange, qualifier } = props;
  const [young, old] = ageRange;
  if (age > 30) {
    return <span>{qualifier} {old}</span>;
  } else if (age > 20) {
    return <span>{old}</span>;
  }
  return <span>{young}</span>;
};

const source = 'It’s {{ name }}’s birthday! He is {{ age }}, which is {{ elder.props:ageRange=[young, old]|qualifier=very }}.';
const context = {
  name: 'Jon',
  age: 35,
  elder: <Elder age={35} key='key' />,
};

const MySmartText = () => (
  <SmartText source={source} context={context} />
);
// It’s Jon’s birthday! He is 35, which is <span>very old</span>.

// VERY useful for translation...
const germanSource = 'Es ist {{ name }}s Geburtstag! Er ist {{ age }} Jahre alt, was {{ elder.props:ageRange=[jung, alt]|qualifier=sehr }} ist.';
const germanContext = {
  name: 'Jon',
  age: 35,
  elder: <Elder age={35} key='key' />,
};

const MyGermanSmartText = () => (
  <SmartText source={germanSource} context={germanContext} />
);
// Es ist Jons Geburtstag! Er ist 35 Jahre alt, was <span>sehr alt</span> ist.
```

### Testing

```
$ yarn build && yarn test
```
