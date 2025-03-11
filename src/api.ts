import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import logger from '@wdio/logger'

import type { TestResults, NewTest, ReporterOptions, TestCase } from './types'

const log = logger('TestrailReporter')

export default class TestRailAPI {
    #config: AxiosRequestConfig = {}
    #projectId: string
    #baseUrl: string
    #includeAll: boolean

    /**
     *
     * @param username username of testrail instance
     * @param password API token
     */
    constructor (options: ReporterOptions) {
        this.#baseUrl = `https://${options.domain}/index.php?/api/v2`
        this.#projectId = options.projectId
        this.#includeAll = options.includeAll
        this.#config.auth = {
            username: options.username,
            password: options.apiToken
        }
    }

    //https://support.testrail.com/hc/en-us/articles/7077083596436-Introduction-to-the-TestRail-API#01G68HCTTNHFT1WVDXKW4BC4WP
    private waitForRateLimit(err: AxiosError<unknown, unknown>) {
        const headers = err.response?.headers
        const retryAfter = headers?.['retry-after']
        new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
    }

    async updateTestRunResults (runId: string, results: TestCase[], retry = false) {
        try {
            const resp = await axios.post(
                `${this.#baseUrl}/add_results_for_cases/${runId}`,
                { results },
                this.#config,
            )
            return resp
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const statusCode = err.response.status
                if (statusCode === 429 && retry === false) {
                    this.waitForRateLimit(err)
                    await this.updateTestRunResults(runId, results, true)
                } else {
                    log.error(`Failed to update test run results: ${err.message}`)
                }
            } else {
                log.error(`Failed to update test run results: ${err.message}`)
            }

        }
    }

    async updateTestRun (runId: string, case_ids: unknown[], retry = false) {
        await axios.get(
            `${this.#baseUrl}/get_tests/${runId}`,
            this.#config
        ).then((res) => {
            if (res.data.tests.length > 0) {
                const addCaseIds = res.data.tests.map((tests: { case_id: number }) => tests.case_id)
                addCaseIds.forEach((id: number) => {
                    case_ids.push(id)
                })
            }
        }
        ).catch((err) => {
            log.error(`Error getting test run: ${err.message}`)
        })

        try {
            const resp = await axios.post(
                `${this.#baseUrl}/update_run/${runId}`,
                { 'case_ids': case_ids },
                this.#config
            )
            return resp
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const statusCode = err.response.status
                if (statusCode === 429 && retry === false) {
                    this.waitForRateLimit(err)
                    await this.updateTestRun(runId, case_ids, true)
                } else {
                    log.error(`Failed to update test run: ${err.message}`)
                }
            } else {
                log.error(`Failed to update test run: ${err.message}`)
            }
        }
    }

    async pushResults (runId: string, testId: string, results: TestResults, retry = false) {
        try {
            const resp = axios.post(
                `${this.#baseUrl}/add_result_for_case/${runId}/${testId}`,
                results,
                this.#config,
            )
            return resp
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const statusCode = err.response.status
                if (statusCode === 429 && retry === false) {
                    this.waitForRateLimit(err)
                    await this.pushResults(runId, testId, results, true)
                } else {
                    log.error(`Failed to push results: ${err.message}`)
                }
            } else {
                log.error(`Failed to push results: ${err.message}`)
            }
        }
    }

    async createTestRun (test: NewTest, runName?: string): Promise<string> {
        const now = new Date()
        if (!test.name) {
            test.name = `${runName} ${now.getDate()}.${now.getMonth()} ${now.getHours()}:${now.getMinutes()}`
        }

        const resp = await axios.post(
            `${this.#baseUrl}/add_run/${this.#projectId}`,
            test,
            this.#config,
        )
        log.info(`Create new run '${test.name}' with id: ${resp.data.id}`)
        return resp.data.id
    }

    async getLastTestRun (suiteId: string, runName: string) {
        const thirtyMinAgo = new Date()
        thirtyMinAgo.setMinutes(thirtyMinAgo.getMinutes() - 30)
        const date = new Date(thirtyMinAgo)

        const unixTimeStamp = Math.floor(date.getTime() / 1000)
        try {
            const resp = await axios.get(
                `${this.#baseUrl}/get_runs/${this.#projectId}&is_completed=0&created_after=${unixTimeStamp}&suite_id=${suiteId}`,
                this.#config
            )
            const thisrun = resp.data.runs.filter(function (run: NewTest) {
                return run.name ? run.name.startsWith(runName) : false
            })

            const runId = thisrun.length > 0
                ? thisrun[0].id
                : await this.createTestRun({
                    suite_id: suiteId,
                    name: runName,
                    include_all: this.#includeAll
                })

            return runId
        } catch (err) {
            log.error(`Failed to get last test run: ${err.message}`)
        }
    }
}
