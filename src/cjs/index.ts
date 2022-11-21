import type { TestStats, SuiteStats } from '@wdio/reporter'
import type TestrailReporter from '../index'
import type { ReporterOptions } from '../types'

exports.default = class CJSTestrailReporter {
    #synced = false
    private instance: Promise<TestrailReporter>

    constructor(options: ReporterOptions) {
        this.instance = import('../index.js').then((TestrailReporter) => {
            return new TestrailReporter.default(options)
        })
    }

    get isSynchronised() {
        return this.#synced
    }

    async onTestPass (test: TestStats) {
        const instance = await this.instance
        return instance.onTestPass(test)
    }

    async onTestFail (test: TestStats) {
        const instance = await this.instance
        return instance.onTestFail(test)
    }

    async onTestSkip (test: TestStats) {
        const instance = await this.instance
        return instance.onTestSkip(test)
    }

    async onSuiteEnd (suiteStats: SuiteStats) {
        const instance = await this.instance
        return instance.onSuiteEnd(suiteStats)
    }

    async onRunnerEnd () {
        const instance = await this.instance
        return instance.onRunnerEnd()
    }

    async sync () {
        const instance = await this.instance
        await instance.sync()
        this.#synced = true
    }
}
