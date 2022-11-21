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
     * create one report per test run
     */
    oneReport: boolean
}
