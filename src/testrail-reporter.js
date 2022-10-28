"use strict";
/// <reference types="node" />

const WDIOReporter = require("@wdio/reporter").default;
const axios = require('axios');
const async = require('async')
let runId,
  params,
  resp,
  synced = false;
let resultsForIT = []
let testCasesIDs = []

function getObject(case_id, status_id, comment, defect) {
  return {
    "case_id": case_id,
    "status_id": status_id,
    "comment": comment,
  }
}

const updateTestRunResults = async () => {
  resp = undefined;

  try {
    const resp = await axios.post(
      `https://${params.domain}/index.php?/api/v2/add_results_for_cases/${runId}`,
      {
        "results": resultsForIT
      },
      {
        auth: {
          username: params.username,
          password: params.apiToken,
        },
      },
    )
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const updateTestRun = async () => {
  try {
    const resp = await axios.post(
      `https://${params.domain}/index.php?/api/v2/update_run/${runId}`,
      {
        "case_ids": testCasesIDs,
      },

      {
        auth: {
          username: params.username,
          password: params.apiToken,
        },
      },
    )
    //console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

async function pushResults(testID, status, comment) {
  resp = undefined;
  axios.post(
    `https://${params.domain}/index.php?/api/v2/add_result_for_case/${projectId}/${testID}`,
    {
      status_id: status,
      comment: comment,
    },
    {
      auth: {
        username: params.username,
        password: params.apiToken,
      },
    },
  ).then(function (response) {
    resp = true;
  })

}

const createTestRun = async () => {
  let date = new Date()
  let title = params.title == undefined ? `${params.runName} ${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}` : params.title
  let boolValue = JSON.parse(params.includeAll);
  axios.post(
    `https://${params.domain}/index.php?/api/v2/add_run/${params.projectId}`,
    {
      suite_id: params.suiteId,
      name: title,
      include_all: boolValue,
    },
    {
      auth: {
        username: params.username,
        password: params.apiToken,
      },
    },
  )
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then((response) => {
      runId = response.data.id
      console.log(`Create new run "${title}" with id: ${runId}`)
    })
};

const getLastTestRun = async () => {
  let date = new Date()
  date.setMinutes(date.getMinutes() - 30)
  date = new Date(date)
  var unixTimeStamp = Math.floor(date.getTime() / 1000);
  const resp = await axios.get(
    `https://${params.domain}/index.php?/api/v2/get_runs/${params.projectId}&is_completed=0&created_after=${unixTimeStamp}`,

    {
      auth: {
        username: params.username,
        password: params.apiToken,
      },
    },
  )
    .catch(function (error) {
      console.log(error);
    })
    .then(async (response) => {
      if (synced === false) {
        if (response.data.size > 0) {
          runId = response.data.runs[0].id
          console.log(`Update test suite: ${runId}`)
        } else {
          await createTestRun()
        }
      }
      synced = true
    })

};

module.exports = class TestRailReporter extends WDIOReporter {
  constructor(options) {
    options = Object.assign(options, { stdout: true })
    super(options)
    params = options;

    if (params.sendReport === 'true') {
      if (params.oneReport === 'true') {
        getLastTestRun()
      } else {
        createTestRun()
      }
    } else {
      console.log('Report is not sent!')
    }

  }
  get isSynchronised() {
    return synced
  }

  onSuiteStart(test) {
  }

  onTestPass(test) {
    resultsForIT.push(getObject((test.title.split(' '))[0].replace('C', ''), 1, 'This test case is passed'))
    testCasesIDs.push((test.title.split(' '))[0].replace('C', ''))
  }

  onTestFail(test) {
    resultsForIT.push(getObject((test.title.split(' '))[0].replace('C', ''), 5, `This test case is failed:\n ${JSON.stringify(test.errors)}`))
    testCasesIDs.push((test.title.split(' '))[0].replace('C', ''))
  }

  onTestSkip(test) {
    resultsForIT.push(getObject((test.title.split(' '))[0].replace('C', ''), 4, 'This test case is skipped'))
    testCasesIDs.push((test.title.split(' '))[0].replace('C', ''))
  }

  onSuiteEnd(suiteStats) {
    if (suiteStats.tests == undefined) {
      this.sync(test, true)
    }
  }

  onRunnerEnd(runnerStats) {
    if (runnerStats.end != undefined) {
      this.sync();
    }
    this.write('\nThe results are pushed!')
  }

  async sync(test, isSuite = false) {
    if (isSuite) {
      let values = new Object({
        'general': 0,
        'passed': 0,
        'failed': 0,
        'skipped': 0,
        'errors': []
      })

      async.each(test.tests, function (logs, callback) {
        switch (logs.state) {
          case 'failed': values.failed = values.failed + 1;
            values.errors.push(`Failed on : ${logs.title} \n ${JSON.stringify(logs.errors, null, 1)}`)
            break;
          case 'passed':
            values.passed = values.passed + 1;
            break;
          case 'skipped': values.skipped = values.skipped + 1;
            break;
        }
        callback()
      })

      if (values.failed != 0) {
        values.general = 5;
      }
      else if (values.passed == 0 && values.skipped != 0) {
        values.general = 4;
      }
      else {
        values.general = 1;
      }
      pushResults((test.fullTitle.split(' '))[0].replace('C', ''), values.general, JSON.stringify(values, null, 1))
    }
    else {
      await updateTestRun()
      await updateTestRunResults()
    }
  };

};
