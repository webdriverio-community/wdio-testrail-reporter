
# wdio-testrail-reporter #

This is a fork from [LuisDiegoNavas/testrail-wdio-custom-reporter](https://github.com/LuisDiegoNavas/testrail-wdio-custom-reporter)

Create a run on TestRail and the update the test cases results

## Use [TestRail API](https://www.gurock.com/testrail/docs/api/reference) ##

The first thing you need is to enable the TestRail API so that report can communicate with TestRail and push the test results.
To do so, log into your TestRail account and go to Administration > Site Settings > API and make sure you click the checkbox near Enable API.

## Usage/Examples ##

Add the required options to your WDIO config file

```javascript
const TestRailReporter = require('wdio-testrail-reporter')

    reporters: 
        [[TestRailReporter, {
        projectId: 1,
        suiteId: 1,
        domain: 'xxxxx.testrail.io',
        username: 'userEmail',
        apiToken: 'testrail apitoken',
        runName: 'name for the test run'  
    }]],
```

## Configuration ##

```javascript
    projectId: ID of the testrail project
    suiteId: ID of the suite, suite 1 is default 
    domain: your-domain.testrail.io, // no default, required field
    username: 'userEmail', // no default, required field
    apiToken: 'testrail apitoken', // no default, required field
    runName: 'name for the test run'
```
