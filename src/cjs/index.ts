exports.default = class CJSTestrailReporter {
    #synced = false
    private instance: Promise<any>

    constructor(options: any) {
        this.instance = import('../index.js').then((TestrailReporter) => {
            return new TestrailReporter.default(options)
        })
    }

    get isSynchronised() {
        return this.#synced
    }

    async onTestPass (test: any) {
        const instance = await this.instance
        return instance.onTestPass(test)
    }

    async onTestFail (test: any) {
        const instance = await this.instance
        return instance.onTestFail(test)
    }

    async onTestSkip (test: any) {
        const instance = await this.instance
        return instance.onTestSkip(test)
    }

    async onSuiteEnd (suiteStats: any) {
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
