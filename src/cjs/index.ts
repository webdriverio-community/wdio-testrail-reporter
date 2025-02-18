import { SuiteStats, TestStats } from '@wdio/reporter'

exports.default = class CJSTestrailReporter {
    #synced = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private instance: Promise<any>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: any) {
        this.instance = import('../index.js').then((TestrailReporter) => {
            return new TestrailReporter.default(options)
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async emit (...args: any[]) {
        const instance = await this.instance
        return instance.emit(...args)
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
