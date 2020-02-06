# Rise Data Twitter [![CircleCI](https://circleci.com/gh/Rise-Vision/rise-data-twitter/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-data-twitter/tree/master) [![Coverage Status](https://coveralls.io/repos/github/Rise-Vision/rise-data-twitter/badge.svg?branch=master)](https://coveralls.io/github/Rise-Vision/rise-data-twitter?branch=master)

## Introduction

`rise-data-twitter` is a Polymer 3 Web Component that provides twits from a configurable Twitter account.

## Usage

The below illustrates simple usage of the component.

#### Example

_More information to be provided_

```
  <rise-data-twitter
      id="rise-data-twitter-01" label="Twitter instance">
  </rise-data-twitter>
```

Since this is not a visual component, a listener needs to be registered to process the data it provides. You can check the available events in the [events section](#events)

### Attributes

_More attributes to be defined_

This component receives the following list of attributes:

- **id**: (string): Unique HTMLElement id.
- **label**: (string): Assigns the label to use for the instance of the component in Template Editor.
- **non-editable**: ( empty / optional ): If present, it indicates this component is not available for customization in the Template Editor.

This component does not support PUD; it will need to be handled by Designers on a per Template basis.

### Events

_More events to be defined_

The component sends the following events:

- **configured**: The component has initialized what it requires to and is ready to handle a _start_ event.
- **data-update**: An event providing an object as described [here](#provided-data).
- **data-error**: An event indicating there is a configuration error.

The component listens for the following events:

- **start**: This event will cause the component to start generating events. It can be dispatched to the component when the _configured_ event has been fired.

### Provided data

_To be defined_

### Logging

_More logging to be defined_

The component logs the following events to BQ:

- **start received**: The component receives the start event and commences execution.

### Offline play

The component supports offline play out of the box.

## Built With
- [Polymer 3](https://www.polymer-project.org/)
- [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli)
- [WebComponents Polyfill](https://www.webcomponents.org/polyfills/)
- [npm](https://www.npmjs.org)

## Development

### Local Development Build
Clone this repo and change into this project directory.

Execute the following commands in Terminal:

```
npm install
npm install -g polymer-cli@1.9.7
npm run build
```

**Note**: If EPERM errors occur then install polymer-cli using the `--unsafe-perm` flag ( `npm install -g polymer-cli --unsafe-perm` ) and/or using sudo.

### Testing
You can run the suite of tests either by command terminal or interactive via Chrome browser.

#### Command Terminal
Execute the following command in Terminal to run tests:

```
npm run test
```

In case `polymer-cli` was installed globally, the `wct-istanbul` package will also need to be installed globally:

```
npm install -g wct-istanbul
```

#### Local Server
Run the following command in Terminal: `polymer serve`.

Now in your browser, navigate to:

```
http://127.0.0.1:8081/components/rise-data-twitter/demo/src/rise-data-twitter-dev.html
```

### Demo project

_More information to be provided_

A demo project showing how to implement a simple Twitter consumer can be found in the `demo` folder.

Another option is using `example-twitter-component` as the scaffolding for a new template. This project can be found in https://github.com/Rise-Vision/html-template-library

### Integration in a Template

_More information to be provided_

After creating the Template's structure in `html-template-library`, add a reference to the component in the `<head>` section of `template.html`:

```
<script src="https://widgets.risevision.com/stable/components/rise-data-twitter/1/rise-data-twitter.js"></script>
```

Add an instance of the component, as shown in the example:

```
  <rise-data-twitter
      id="rise-data-twitter-01" label="Twitter instance">
  </rise-data-twitter>
```

To test the template in a browser outside Player/Apps, add the following lines (replacing with the appropriate element id):

```
const riseDataTwitter01 = document.querySelector('#rise-data-twitter-01');

RisePlayerConfiguration.Helpers.sendStartEvent( riseDataTwitter01 );
```

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](https://help.risevision.com/hc/en-us/community/topics), otherwise submit a pull request and we will do our best to incorporate it. Please be sure to submit test cases with your code changes where appropriate.

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive [community](https://help.risevision.com/hc/en-us/community/topics).

If you are looking for help with Rise Vision, please see [Help Center](https://help.risevision.com/hc/en-us).

**Facilitator**

[Stuart Lees](https://github.com/stulees "Stuart Lees")
