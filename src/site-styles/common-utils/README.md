# [Fairfax Common Utilities](#markdown-header-fairfax-common-utilities)

The **Fairfax Common Utilities** library is a **collection of useful tools commonly used across interactives**.

Unfortunately, the utilities fall short of being general purpose, as one depends on the D3 data 
visualisation library, in particular its `d3-format` module. (By default, all dependent 
utilities are commented out, so as to avoid bundling errors.)

The library is written to be imported using the **[Rollup module bundler](https://rollupjs.org/)**. A great thing about Rollup is that, by [tree-shaking](https://rollupjs.org/#tree-shaking), it will get rid of any utilities that aren't used in the application, meaning that users can add all of these utilities to their project but only pay for those they use.

This repo might not be a whole lot of use to other developers, at this point, but could be adapted to be so. For now, it'll help me throw together projects a little faster.

## Contents

* [API](#markdown-header-api)
    * [Get current page URL](#markdown-header-get-current-page-url)
    * [Get URL argument values](#markdown-header-get-url-argument-values)
    * [Make readable event time](#markdown-header-make-readable-event-time)
    * [Is mobile](#markdown-header-is-mobile)
    * [Make short name](#markdown-header-make-short-name)
    * [Format number](#markdown-header-format-number)

## [API](#markdown-header-api)

### [Get current page URL](#markdown-header-get-current-page-url) [^](#markdown-header-fairfax-common-utilities)

`getCurrentPageUrl()`

Returns the URL of the page in which the interactive is embedded or, failing that, the URL for the interactive itself.

### [Get URL argument values](#markdown-header-get-url-argument-values) [^](#markdown-header-fairfax-common-utilities)

`getUrlArgumentValues()`

Returns an object containing each of the provided URL parameters as keys and each of the associated values as values.

For example, the following URL...
```
'http://www.someurl.com?title=Derp&description=something'
```
... would result in the following object:
```
{
  title: 'Derp',
  description: 'something'
}
```

### [Make readable event time](#markdown-header-make-readable-event-time) [^](#markdown-header-fairfax-common-utilities)

`makeReadableEventTime(utcTimestamp)`

| Parameter name | Data type | Description | Required |
| -------------- | --------- | ----------- | -------- |
| utcTimestamp   | String    | String consisting of a timestamp of a given event | Yes |

Returns a rendering of the input timestamp that 'makes sense', given the current time. 

For example, if the timestamp denotes some time earlier in the same day, the timestamp would be rendered as just '6pm'.

A timestamp denoting the same time in the day a few days before would read 'November 6'.

And a timestamp denoting the same time of year, but last year, would read 'November 6, 2017'.

### [Is mobile](#markdown-header-is-mobile) [^](#markdown-header-fairfax-common-utilities)

`isMobile()`

Returns a boolean indicating whether or not the user appears to be on a mobile device.

### [Make short name](#markdown-header-make-short-name) [^](#markdown-header-fairfax-common-utilities)

`makeShortName(name)`

| Parameter name | Data type | Description | Required |
| -------------- | --------- | ----------- | -------- |
| name       | String    | String denoting name to be formatted | Yes |

Returns shortened version of a given name, with all but the person's last name initialised.

### [Format number](#markdown-header-format-number) [^](#markdown-header-fairfax-common-utilities)

`formatNumber(number)`

| Parameter name | Data type | Description | Required |
| -------------- | --------- | ----------- | -------- |
| number       | Number    | Number to be formatted | Yes |

Returns a number rendered as a string according to Fairfax style, or close to it. It adds commas where appropriate and trims decimals to two digits of significance.

For example, the number `100000.30000231` would be rendered as `'100,000.3'`.

For example, the number `9876.543` would be rendered as `'9,876.54'`.

**This function is dependent on D3's `d3-format` module and is commented out of this library by default.**
