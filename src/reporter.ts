import WDIOReporter, { TestStats, SuiteStats, RunnerStats, Tag } from '@wdio/reporter'

import TestRailAPI from './api.js'
import type { ReporterOptions, TestCase, TestResults } from './types'

export default class TestRailReporter extends WDIOReporter {
    #api: TestRailAPI
    #options: ReporterOptions

    #synced = false
    #testCases: TestCase[] = []
    #requestPromises: Promise<unknown>[] = []
    #caps = {}
    
    interval: ReturnType<typeof setInterval>
    runId: string

    constructor (options: ReporterOptions) {
        options = Object.assign(options, { stdout: false })
        super(options)
        this.#api = new TestRailAPI(options)
        this.#options = options
        this.runId = ''
        Promise.resolve(this.#getRunId()).then((value) => this.runId = value)
        this.interval = setInterval(this.checkForRun, 1000)
    }
    
    get isSynchronised() {
        return this.#synced
    }
    
    checkForRun() {
        if (this.runId !== '') clearInterval(this.interval)
    }
    
    onRunnerStart(runner: RunnerStats) {
        this.#caps = runner.capabilities
    }

    onTestPass(test: TestStats) {
        if (!this.#options.useCucumber) {
            const caseIds = test.title.match(/C\d+/g) || [] // Extract multiple case IDs
            const comment = `This test case is passed.\n${JSON.stringify(this.#caps)}`
            caseIds.forEach(caseId => {
                this.#testCases.push({
                    case_id: caseId.replace('C', ''),
                    status_id: '1',
                    comment,
                    elapsed: test._duration / 1000 + 's'
                })
            })
        }
    }

    onTestFail(test: TestStats) {
        const caseIds = test.title.match(/C\d+/g) || [] // Extract multiple case IDs
        const comment = `This test case is failed:\n${JSON.stringify(this.#caps)}\n${JSON.stringify(test.errors)}`
        caseIds.forEach(caseId => {
            this.#testCases.push({
                case_id: caseId.replace('C', ''),
                status_id: '5',
                comment,
                elapsed: test._duration / 1000 + 's'
            })
        })
    }

    onTestSkip(test: TestStats) {
        const caseIds = test.title.match(/C\d+/g) || [] // Extract multiple case IDs
        const comment = `This test case is skipped.\n${JSON.stringify(this.#caps)}`
        caseIds.forEach(caseId => {
            this.#testCases.push({
                case_id: caseId.replace('C', ''),
                status_id: '4',
                comment,
            })
        })
    }

    onSuiteEnd (suiteStats: SuiteStats) {
        if (suiteStats.type === 'scenario') {
            const promise = this.#updateSuite(suiteStats)
            if (promise) {
                this.#requestPromises.push(promise)
            }
        }
    }

    onRunnerEnd () {
        this.#requestPromises.push(this.#updateTestRun())
        Promise.resolve(this.sync())
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

        if (this.#options.useCucumber && suiteStats.type === 'scenario') {
            let testId = '-1'
            if (this.#options.caseIdTagPrefix && suiteStats.tags) {
                for (let i = 0; i < suiteStats.tags.length; i++) {
                    const tag: string | Tag = suiteStats.tags[i]
                    const tagName: string = JSON.parse(JSON.stringify(tag)).name
                    if (tagName.includes(this.#options.caseIdTagPrefix)) {
                        testId = tagName.replace(`@${this.#options.caseIdTagPrefix}`, '').replace('C', '')
                    }
                }
            } else {
                testId = suiteStats.title.split(' ')[0].replace('C', '')
            }
            return this.#api.pushResults(this.runId, testId, results)
        } else {
            const testId = suiteStats.fullTitle.split(' ')[0].replace('C', '')
            return this.#api.pushResults(this.runId, testId, results)
        }
    }

    async #updateTestRun () {
        const caseIds = this.#testCases.map((test) => test.case_id)
        if (caseIds.length > 0) {
            await this.#api.updateTestRun(this.runId, caseIds)
            await this.#api.updateTestRunResults(this.runId, this.#testCases)
        }
    }
    getTestCasesArray() {
        return this.#testCases
    }
}
