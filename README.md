![](badge.svg)

# @reuters-graphics/react-smart-text


### Install

```
$ yarn add @reuters-graphics/react-smart-text react
```

### Use

Use markdown, including [brackets to create spans with attributes](https://github.com/sethvincent/remark-bracketed-spans).

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = 'This _is_ [a]{.red} test.';

<SmartText source={source} />
```

Use mustache syntax and replace with text or React components.

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = 'This is {{ article }} test, {{ name }}.';
const context = {
  article: 'an',
  name: () => (<span>Jon!</span>),
};

<SmartText source={source} context={context} />
```

Pass options to pluralize text based on other context variables.

```javascript
import SmartText from '@reuters-graphics/react-smart-text';

const source = '{{ number }} {{ number.pluralize:person is|people are }} typing.';
const context = { number: 2 };

<SmartText source={source} context={context} />
```


### Testing

```
$ yarn test
```
