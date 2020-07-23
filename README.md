![](badge.svg)

# @reuters-graphics/react-smart-text

[![npm version](https://badge.fury.io/js/%40reuters-graphics%2Freact-smart-text.svg)](https://badge.fury.io/js/%40reuters-graphics%2Freact-smart-text) [![Reuters open source software](https://badgen.net/badge/Reuters/open%20source/?color=ff8000)](https://github.com/reuters-graphics/)

"Smart text" is text with [Mad Libs](https://en.wikipedia.org/wiki/Mad_Libs)-style replacement. We use it to create sentences that respond to data.

> There have been _ _ _ _ _ _ _ reported votes.

This library helps us write smart text in React, using tools for formatting and replacement, including [Markdown](https://guides.github.com/features/mastering-markdown/) and [mustache templating](https://mustache.github.io/).

### Install

```
$ yarn add @reuters-graphics/react-smart-text react
```

### Use

Use markdown, including [bracketed spans](https://github.com/sethvincent/remark-bracketed-spans).

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = 'This _is_ [a]{.red} test.';

const MySmartText = () => (
  <SmartText source={source} />
);
```

Use mustache syntax and replace with text or React components.

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = 'This is {{ article }} test, {{ name }}.';
const context = {
  article: 'an',
  name: () => (<span>Jon!</span>),
};

const MySmartText = () => (
  <SmartText source={source} context={context} />
);
```

Pass options to pluralize text based on other context variables (usually a number or an array of components).

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = '{{ number }} {{ number.pluralize:person is|people are }} typing.';
const context = { number: 2 };

const MySmartText = () => (
  <SmartText source={source} context={context} />
);
```


### Testing

```
$ yarn build && yarn test
```
