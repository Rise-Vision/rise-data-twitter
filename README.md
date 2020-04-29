# Rise Data Twitter [![CircleCI](https://circleci.com/gh/Rise-Vision/rise-data-twitter/tree/master.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-data-twitter/tree/master) [![Coverage Status](https://coveralls.io/repos/github/Rise-Vision/rise-data-twitter/badge.svg?branch=master)](https://coveralls.io/github/Rise-Vision/rise-data-twitter?branch=master)

## Introduction

`rise-data-twitter` is a Polymer 3 Web Component that provides tweets from a configurable Twitter account.

## Usage

The below illustrates simple usage of the component.

#### Example

```
  <rise-data-twitter
      id="rise-data-twitter-01" label="Twitter instance">
  </rise-data-twitter>
```

Since this is not a visual component, a listener needs to be registered to process the data it provides. You can check the available events in the [events section](#events)

### Attributes

This component receives the following list of attributes:

- **id**: (string): Unique HTMLElement id.
- **label**: (string): Assigns the label to use for the instance of the component in Template Editor.
- **non-editable**: ( empty / optional ): If present, it indicates this component is not available for customization in the Template Editor.
- **username**: ( string / optional ): The default username for which the tweets will be requested.
- **maxitems**: ( integer / optional ): The default number of tweets to request. Defaults to 25.

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

The response includes an array of objects where each object contains the following fields:

- **name**: The title of the account, as indicated by its owner
- **screenName**: The account name/handle
- **profilePicture**: The url to the largest available version of the profile picture
- **text**: The full text of the tweet
- **createdAt**: The date when the tweet was created
- **images**: A list of urls with the largest image size available 
- **media**: A list of urls with media other than images (video and external links)
- **statistics**:
    - **retweetCount**: The number of retweets of the current tweet
    - **likeCount**: The number of likes to the current tweet
- **user**:
    - **description**: The description of the account, as indicated by its owner
    - **statuses**: The number of statuses/tweets of the account
    - **followers**: The number of followers of the account
- **quoted**: An object with the same structure as a tweet (name, screenName, etc, but not another quoted item). Only available if the main tweet is a quote to another tweet.

#### Example

```
[
    {
        "name": "Mashable",
        "screenName": "mashable",
        "profilePicture": "https://pbs.twimg.com/xyz.png",
        "createdAt": "Tue Apr 28 18:07:00 +0000 2020",
        "text": "3D-printed airless",
        "images": [
            "https://pbs.twimg.com/media/EWxQkRBWoAETEAv?format=jpg&name=large"
        ],
        "user": {
            "description": "Some description.",
            "statuses": 123,
            "followers": 456
        },
        "statistics": {
            "retweetCount": 2,
            "likeCount": 8
        },
        "quoted": {
            "createdAt": "Mon Apr 27 13:48:07 +0000 2020",
            "images": [],
            "name": "Donald J. Trump",
            "profilePicture": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
            "quoted": null,
            "screenName": "realDonaldTrump",
            "statistics": {
                "likeCount": 384831,
                "retweetCount": 79219
            },
            "text": "FAKE NEWS, THE ENEMY OF THE PEOPLE!",
            "user": {
                "description": "45th President of the United States of America🇺🇸",
                "followers": 78921673,
                "statuses": 51028
            }
        }
    }
]
```

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
