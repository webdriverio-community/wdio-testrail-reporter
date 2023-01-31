var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TestRailAPI_config, _TestRailAPI_projectId, _TestRailAPI_baseUrl, _TestRailAPI_includeAll;
import axios from "axios";
import logger from "@wdio/logger";
const log = logger("TestrailReporter");
export default class TestRailAPI {
    constructor(options) {
        _TestRailAPI_config.set(this, {});
        _TestRailAPI_projectId.set(this, void 0);
        _TestRailAPI_baseUrl.set(this, void 0);
        _TestRailAPI_includeAll.set(this, void 0);
        __classPrivateFieldSet(this, _TestRailAPI_baseUrl, `https://${options.domain}/index.php?/api/v2`, "f");
        __classPrivateFieldSet(this, _TestRailAPI_projectId, options.projectId, "f");
        __classPrivateFieldSet(this, _TestRailAPI_includeAll, options.includeAll, "f");
        __classPrivateFieldGet(this, _TestRailAPI_config, "f").auth = {
            username: options.username,
            password: options.apiToken,
        };
    }
    async updateTestRunResults(runId, results) {
        try {
            const resp = await axios.post(`${__classPrivateFieldGet(this, _TestRailAPI_baseUrl, "f")}/add_results_for_cases/${runId}`, { results }, __classPrivateFieldGet(this, _TestRailAPI_config, "f"));
            return resp;
        }
        catch (err) {
            log.error(`Failed to update test run results: ${err.message}`);
        }
    }
    async updateTestRun(runId, case_ids) {
        await axios
            .get(`${__classPrivateFieldGet(this, _TestRailAPI_baseUrl, "f")}/get_tests/${runId}`, __classPrivateFieldGet(this, _TestRailAPI_config, "f"))
            .then((res) => {
            if (res.data.tests.length > 0) {
                const addCaseIds = res.data.tests.map((tests) => tests.case_id);
                addCaseIds.forEach((id) => {
                    case_ids.push(id);
                });
            }
        })
            .catch((err) => {
            log.error(`Error getting test run: ${err.message}`);
        });
        try {
            const resp = await axios.post(`${__classPrivateFieldGet(this, _TestRailAPI_baseUrl, "f")}/update_run/${runId}`, { case_ids: case_ids }, __classPrivateFieldGet(this, _TestRailAPI_config, "f"));
            return resp;
        }
        catch (err) {
            log.error(`Failed to update test run: ${err.message}`);
        }
    }
    async pushResults(testId, results) {
        try {
            const resp = axios.post(`${__classPrivateFieldGet(this, _TestRailAPI_baseUrl, "f")}/add_result_for_case/${__classPrivateFieldGet(this, _TestRailAPI_projectId, "f")}/${testId}`, results, __classPrivateFieldGet(this, _TestRailAPI_config, "f"));
            return resp;
        }
        catch (err) {
            log.error(`Failed to push results: ${err.message}`);
        }
    }
    async createTestRun(test, runName) {
        const now = new Date();
        if (!test.name) {
            test.name = `${runName} ${now.getDate()}.${now.getMonth()} ${now.getHours()}:${now.getMinutes()}`;
        }
        const resp = await axios.post(`${__classPrivateFieldGet(this, _TestRailAPI_baseUrl, "f")}/add_run/${__classPrivateFieldGet(this, _TestRailAPI_projectId, "f")}`, test, __classPrivateFieldGet(this, _TestRailAPI_config, "f"));
        log.info(`Create new run '${test.name}' with id: ${resp.data.id}`);
        return resp.data.id;
    }
    async getLastTestRun(suiteId, runName, buildName, runNumber) {
        const thirtyMinAgo = new Date();
        thirtyMinAgo.setMinutes(thirtyMinAgo.getMinutes() - 30);
        const date = new Date(thirtyMinAgo);
        const unixTimeStamp = Math.floor(date.getTime() / 1000);
        try {
            const resp = await axios.get(`${__classPrivateFieldGet(this, _TestRailAPI_baseUrl, "f")}/get_runs/${__classPrivateFieldGet(this, _TestRailAPI_projectId, "f")}&is_completed=0&created_after=${unixTimeStamp}&suite_id=${suiteId}`, __classPrivateFieldGet(this, _TestRailAPI_config, "f"));
            const thisrun = resp.data.runs.filter(function (run) {
                return run.name.startsWith(runName);
            });
            const runId = thisrun.length > 0
                ? thisrun[0].id
                : await this.createTestRun({
                    suite_id: suiteId,
                    name: `${runName} ${buildName} (${runNumber})`,
                    include_all: __classPrivateFieldGet(this, _TestRailAPI_includeAll, "f"),
                });
            return runId;
        }
        catch (err) {
            log.error(`Failed to get last test run: ${err.message}`);
        }
    }
}
_TestRailAPI_config = new WeakMap(), _TestRailAPI_projectId = new WeakMap(), _TestRailAPI_baseUrl = new WeakMap(), _TestRailAPI_includeAll = new WeakMap();
