# Rettiwt-API

A CLI tool and an API for fetching data from Twitter for free!

## Prerequisites

-   NodeJS 20.10.0
-   A working Twitter account (optional)

## Installation

It is recommended to install the package globally. Use the following steps to install the package and ensure it's installed correctly:

1. Open a terminal.
2. Install the package using the command `npm install -g rettiwt-api`.
3. Check if the package is installed correctly using the command `rettiwt help`.

## Authentication

Rettiwt can be used with or without logging in to Twitter. As such, the two authentication strategies are:

-   'guest' authentication (without logging in) grants access to the following resources:

    -   Tweet Details
    -   User Details
    -   User Timeline (tweets timeline)
    -   User Replies (replies timeline)

-   'user' authentication (logging in) grants access to the following resources:

    -   Tweet Details
    -   Tweet Favoriters (likes)
    -   Tweet Retweeters (retweets)
    -   Tweet Search
    -   Tweet List
    -   User Details
    -   User Followers
    -   User Following
    -   User Likes
    -   User Timeline (tweets timeline)
    -   User Replies (replies timeline)

By default, Rettiwt-API uses 'guest' authentication. If however, access to the full set of resources is required, 'user' authentication can be used, which requires the following additional steps post-installtion:

1. Open a terminal.
2. Generate an API_KEY using the command `rettiwt auth login <email> <username> <password>`

    Here,

    - \<email\> is the email of the Twitter account to be used for authentication.
    - \<username\> is the username associtated with the Twitter account.
    - \<password\> is the password to the Twitter account.

3. The string returned after running the command is the API_KEY. Store it in a secure place for later use.

## The API_KEY

The API_KEY generated by logging in is what allows Rettiwt-API to authenticate as a logged in user while interacting with the Twitter API ('user' authentication). As such it is a very sensitive information and therefore, must be stored securely. The following points must be kept in mind while using the API_KEY for 'user' authentication:

-   The API_KEY is generated by logging into Twitter using the email, username and password and encoding the returned cookies as a base64 string. This encoded string is the API_KEY.
-   The API_KEY provides the same level of authorization as any standard Twitter account, nothing more, nothing less.
-   Since generation of API_KEY is equivalent to logging in to Twitter, repeated generation attempts might trigger Twitter's anti-bot measures, the same way repeated login attempts do.
-   The API_KEY expires after one year from the day it was generated.
-   Therefore, it is recommended to generate the API_KEY only once, then use it every time it is needed.
-   Do not generate an API_KEY if it has not expired yet!

## Notes for non-programmers

-   If you have no idea of programming, it's recommended to use the CLI.
-   The CLI provides an easy to use interface which does not require any knowledge of JavaScript or programming
-   Please skip to 'CLI-Usage' section for details.

## Usage as a dependency

Rettiwt-API can be used as a dependency for your NodeJS project. In such a case, it is not required to install Rettiwt-API globally and you may install it locally in the root of your project using the command:

-   `npm install --save rettiwt-api` (using npm)

    or

-   `yarn add rettiwt-api` (using yarn)

However, in this case, for accessing the CLI, you will be required to prepend the CLI commands with `npx` in order to tell NodeJS to use the locally installed package.

For example, for generating the API_KEY, the command will be modified as follows:

`npx rettiwt auth login <email> <username> <password>`

## The Rettiwt class

When used as a dependency, the Rettiwt class is entry point for accessing the Twitter API.

A new Rettiwt instance can be initialized using the following code snippets:

-   `const rettiwt = new Rettiwt()` (for 'guest' authentication)
-   `const rettiwt = new Rettiwt({ apiKey: API_KEY })` (for 'user' authentication)

The Rettiwt class has two members:

-   'tweet' member, for accessing resources related to tweets
-   'user' member, for accessing resources related to users

For details regarding usage of these members for accessing the Twitter API, refer to the 'Features' section.

## Usage

The following examples may help you to get started using the library:

### 1. Getting the details of a target Twitter user

```js
const { Rettiwt } = require('rettiwt-api');

// Creating a new Rettiwt instance
// Note that for accessing user details, 'guest' authentication can be used
const rettiwt = new Rettiwt();

// Fetching the details of the user whose username is <username>
rettiwt.user.details('<username>')
.then(details => {
	...
})
.catch(error => {
	...
});
```

### 2. Getting the list of tweets that match a given filter

```js
const { Rettiwt } = require('rettiwt-api');

// Creating a new Rettiwt instance using the API_KEY
const rettiwt = new Rettiwt({ apiKey: API_KEY });

/**
 * Fetching the list of tweets that:
 * 	- are made by a user with username <username>,
 * 	- contain the words <word1> and <word2>
 */
rettiwt.tweet.search({
	fromUsers: ['<username>'],
	words: ['<word1>', '<word2>']
})
.then(data => {
	...
})
.catch(err => {
	...
});
```

### 3. Getting the next batch of data using a cursor

The previous example fetches the the list of tweets matching the given filter. Since no count is specified, in this case, a default of 20 such Tweets are fetched initially. The following example demonstrates how to use the [cursor string](https://rishikant181.github.io/Rettiwt-API/classes/Cursor.html#value) obtained from the [response](https://rishikant181.github.io/Rettiwt-API/classes/CursoredData.html) object's [next](https://rishikant181.github.io/Rettiwt-API/classes/CursoredData.html#next) field, from the previous example, to fetch the next batch of tweets:

```js
const { Rettiwt } = require('rettiwt-api');

// Creating a new Rettiwt instance using the API_KEY
const rettiwt = new Rettiwt({ apiKey: API_KEY });

/**
 * Fetching the list of tweets that:
 * 	- are made by a user with username <username>,
 * 	- contain the words <word1> and <word2>
 *
 * 'data' is the response object received in the previous example.
 */
rettiwt.tweet.search({
	fromUsers: ['<username>'],
	words: ['<word1>', '<word2>']
}, data.next.value)
.then(data => {
	...
})
.catch(err => {
	...
});
```

For more information regarding the different available filter options, please refer to [TweetFilter](https://rishikant181.github.io/Rettiwt-Core/classes/TweetFilter.html).

## Using a proxy

For masking of IP address using a proxy server, use the following code snippet for instantiation of Rettiwt:

```js
/**
 * PROXY_URL is the URL or configuration for the proxy server you want to use.`
 */
const rettiwt = Rettiwt({ apiKey: API_KEY, proxyUrl: PROXY_URL });
```

This creates a Rettiwt instance which uses the given proxy server for making requests to Twitter.

## Debug logs

Sometimes, when the library shows unexpected behaviour, for troubleshooting purposes, debug logs can be enabled which will help in tracking down the issue and working on a potential fix. Currently, debug logs are printed to the console and are enabled by setting the 'logging' property of the config to true, while creating an instance of Rettiwt:

```js
/**
 * By default, is no value for 'logging' is supplied, logging is disabled.
 */
const rettiwt = Rettiwt({ apiKey: API_KEY, logging: true });
```

## Features

So far, the following operations are supported:

### Tweets

-   [Getting the details of a tweet](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#details)
-   [Favoriting/liking a tweet](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#favorite)
-   [Getting the list of users who favorited/liked a given tweet](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#favoriters)
-   [Getting the list of tweets from a given Twitter list](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#list)
-   [Retweeting/reposting a tweet](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#retweet)
-   [Getting the list of users who retweeted/reposted a given tweet](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#retweeters)
-   [Searching for the list of tweets that match a given filter](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#search)
-   [Posting a new tweet](https://rishikant181.github.io/Rettiwt-API/classes/TweetService.html#tweet)

### Users

-   [Getting the details of a user](https://rishikant181.github.io/Rettiwt-API/classes/UserService.html#details)
-   [Getting the list of users who follow the given user](https://rishikant181.github.io/Rettiwt-API/classes/UserService.html#followers)
-   [Getting the list of users who are followed by the given user](https://rishikant181.github.io/Rettiwt-API/classes/UserService.html#following)
-   [Getting the list of tweets favorited/liked by the given user](https://rishikant181.github.io/Rettiwt-API/classes/UserService.html#likes)
-   [Getting the tweet timeline of a user](https://rishikant181.github.io/Rettiwt-API/classes/UserService.html#timeline)
-   [Getting the reply timeline of a user](https://rishikant181.github.io/Rettiwt-API/classes/UserService.html#replies)

## CLI Usage

Rettiwt-API provides an easy to use command-line interface which does not require any programming knowledge.

By default, the CLI operates in 'guest' authentication. If you want to use 'user' authentication:

1. Generate an API_KEY as described in 'Authentication' section.
2. Store the output API_KEY as an environment variable with the name 'API_KEY'.
    - Additionaly, store the API_KEY in a file for later use.
    - Make sure to generate an API_KEY only once, and use it every time you need it.
3. The CLI automatically reads this environment variable to authenticate against Twitter.
    - Additionaly, the API_KEY can also be passed in manually using the '-k' option as follows: `rettiwt -k <API_KEY> <command>`

Help for the CLI can be obtained from the CLI itself:

-   For help regarding the available commands, use the command `rettiwt help`
-   For help regarding a specific command, use the command `rettiwt help <command_name>`

## API Reference

The complete API reference can be found at [this](https://rishikant181.github.io/Rettiwt-API/modules) page.

## Additional information

-   This API uses the cookies of a Twitter account to fetch data from Twitter and as such, there is always a chance (altough a measly one) of getting the account banned by Twitter algorithm.
-   There have been no reports of accounts getting banned, but you have been warned, even though the chances of getting banned is negligible, it is not zero!
