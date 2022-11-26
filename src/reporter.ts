import WDIOReporter, { TestStats, SuiteStats } from '@wdio/reporter'

import TestRailAPI from './api.js'
import type { ReporterOptions, TestCase, TestResults } from './types'

export default class TestRailReporter extends WDIOReporter {
    #api: TestRailAPI
    #options: ReporterOptions

    #synced = false
    #testCases: TestCase[] = []
    #requestPromises: Promise<unknown>[] = []

    constructor (options: ReporterOptions) {
        options = Object.assign(options, { stdout: false })
        super(options)

        this.#api = new TestRailAPI(options)
        this.#options = options
    }

    get isSynchronised() {
        return this.#synced
    }

    onTestPass (test: TestStats) {
        this.#testCases.push({
            case_id: test.title.split(' ')[0].replace('C', ''),
            status_id: '1',
            comment: 'This test case is passed'
        })
    }

    onTestFail (test: TestStats) {
        this.#testCases.push({
            case_id: test.title.split(' ')[0].replace('C', ''),
            status_id: '5',
            comment: `This test case is failed:\n ${JSON.stringify(test.errors)}`
        })
    }

    onTestSkip (test: TestStats) {
        this.#testCases.push({
            case_id: test.title.split(' ')[0].replace('C', ''),
            status_id: '4',
            comment: 'This test case is skipped'
        })
    }

    onSuiteEnd (suiteStats: SuiteStats) {
        this.#requestPromises.push(this.#updateSuite(suiteStats))
    }

    onRunnerEnd () {
        this.#requestPromises.push(this.#updateTestRun())
    }

    async sync () {
        // ensure all request promises were resolved
        await Promise.all(this.#requestPromises)
        this.#synced = true
    }

    #getRunId () {
        return this.#options.oneReport
            ? this.#api.getLastTestRun(this.#options.suiteId, this.#options.runName)
            : this.#api.createTestRun({
                suite_id: this.#options.suiteId,
                name: this.#options.runName,
                include_all: this.#options.includeAll
            })
    }

    async #updateSuite (suiteStats: SuiteStats) {
        const values = {
            'general': 0,
            'passed': 0,
            'failed': 0,
            'skipped': 0,
            'errors': [] as string[]
        }

        for (const test of suiteStats.tests) {
            switch (test.state) {
            case 'failed': values.failed = values.failed + 1
                values.failed += 1
                values.errors.push(`Failed on: ${test.title} \n ${JSON.stringify(test.errors, null, 1)}`)
                break
            case 'passed':
                values.passed += 1
                break
            case 'skipped':
                values.skipped += 1
                break
            }
        }

        if (values.failed > 0) {
            values.general = 5
        } else if (values.passed === 0 && values.skipped !== 0) {
            values.general = 4
        } else {
            values.general = 1
        }

        const results: TestResults = {
            status_id: values.general.toString(),
            comment: JSON.stringify(values, null, 1)
        }
        const testId = suiteStats.fullTitle.split(' ')[0].replace('C', '')
        return this.#api.pushResults(testId, results)
    }

    async #updateTestRun () {
        const runId = await this.#getRunId()
        const caseIds = this.#testCases.map((test) => test.case_id)
        await this.#api.updateTestRun(runId, caseIds),
        await this.#api.updateTestRunResults(runId, this.#testCases)
    }
}
