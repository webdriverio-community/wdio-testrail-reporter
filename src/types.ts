export interface TestResults {
    status_id: string
    comment: string
}

export interface NewTest {
    suite_id: string
    name?: string
    include_all: boolean
}

export interface TestCase {
    case_id: string
    status_id: string
    comment: string
    elapsed?: string
}

export interface ReporterOptions {
    /**
     * your-domain.testrail.io
     */
    domain: string
    /**
     * ID of the testrail project
     */
    projectId: string
    /**
     * ID of the suite, suite 1 is default
     */
    suiteId: string
    /**
     * username of testrail instanxce
     */
    username: string
    /**
     * API token of test rail instance
     */
    apiToken: string
    /**
     * name for the test run
     */
    runName: string
    /**
     * id for an existing test run to use
     */
    existingRunId?: string
    /**
     * create one report per test run
     */
    oneReport: boolean
    /**
     * include all test cases in suite
     */
    includeAll: boolean
    /**
     * use Cucumber
     */
    useCucumber: boolean
    /**
     * tag prefix when case ID is encoded into Cucumber tags
     */
    caseIdTagPrefix: string
    /**
     * max time in past to consider when using 'oneReport' to check for existing runs
     */
    timeInMinutes: number

    /**
     * desired path for a logfile
     * This was needed to satisfy a logFile requirementfound in:
     * reporter.ts's super's constructor: 'this.options.logFile':
     * https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-reporter/src/index.ts#L52
     */
    logFile?: string
}
