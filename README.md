
# WebdriverIO Testrail Reporter

This reporter creates TestRail reports. The first thing you need is to enable the TestRail API so that report can communicate with TestRail and push the test results. To do so, log into your TestRail account and go to Administration > Site Settings > API and make sure you click the checkbox near Enable API.

Add TestRail's test case ID to the test description. e.g.
```javascript
it("C123456 Page loads correctly", async () => {
```

## Install

To use the reporter, add it to your `package.json`:

```sh
npm i --save-dev @wdio/testrail-reporter
```

## Usage

Add the reporter to your WDIO config file:

```javascript
export const config = {
    // ...
    reporters:
        [
            ['testrail', {
                projectId: 1,
                suiteId: 1,
                domain: 'xxxxx.testrail.io',
                username: process.env.TESTRAIL_USERNAME,
                apiToken: process.env.TESTRAIL_API_TOKEN,
                runName: 'name for the test run',
                oneReport: true,
                includeAll: false
                caseIdTagPrefix: '' // used only for multi-platform Cucumber Scenarios
            }
        ]
    ],
    // ...
}
```

## Options

### `projectId`

ID of the testrail project.

Type: `string`

### `suiteId`

ID of the suite, suite 1 is default.

Type: `string`

### `domain`

Domain of your testrail instance, e.g. `your-domain.testrail.io`.

Type: `string`

### `username`

Username of your testrail instance.

Type: `string`

### `apiToken`

API token of your testrail instance.

Type: `string`

### `runName`

Custom name for the test run.

Type: `string`

### `oneReport`

Create a single test run.

Type: `boolean`

### `includeAll`

Include all tests in suite in test run.

Type: `boolean`

### `caseIdTagPrfix`

Prefix use to locate for case ID in Cucumber tags, useful for multi-platform Cucumber Scenario executions

Type: `string`

---

For more information on WebdriverIO see the [homepage](https://webdriver.io).
