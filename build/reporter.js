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
var _TestRailReporter_instances, _TestRailReporter_api, _TestRailReporter_options, _TestRailReporter_synced, _TestRailReporter_testCases, _TestRailReporter_requestPromises, _TestRailReporter_getRunId, _TestRailReporter_updateSuite, _TestRailReporter_updateTestRun;
import WDIOReporter from "@wdio/reporter";
import TestRailAPI from "./api.js";
export default class TestRailReporter extends WDIOReporter {
    constructor(options) {
        options = Object.assign(options, { stdout: false });
        super(options);
        _TestRailReporter_instances.add(this);
        _TestRailReporter_api.set(this, void 0);
        _TestRailReporter_options.set(this, void 0);
        _TestRailReporter_synced.set(this, false);
        _TestRailReporter_testCases.set(this, []);
        _TestRailReporter_requestPromises.set(this, []);
        __classPrivateFieldSet(this, _TestRailReporter_api, new TestRailAPI(options), "f");
        __classPrivateFieldSet(this, _TestRailReporter_options, options, "f");
    }
    get isSynchronised() {
        return __classPrivateFieldGet(this, _TestRailReporter_synced, "f");
    }
    titleToCaseIds(title) {
        let caseIds = [];
        let testCaseIdRegExp = /\bT?C(\d+)\b/g;
        let m;
        while ((m = testCaseIdRegExp.exec(title)) !== null) {
            let caseId = parseInt(m[1]);
            caseIds.push(caseId);
        }
        return caseIds;
    }
    onTestPass(test) {
        let caseIds = this.titleToCaseIds(test.title);
        if (caseIds.length > 0) {
            for (let index = 0; index < caseIds.length; index++) {
                const element = caseIds[index];
                __classPrivateFieldGet(this, _TestRailReporter_testCases, "f").push({
                    case_id: `${element}`,
                    status_id: "1",
                    comment: `${test.fullTitle}`,
                });
            }
        }
    }
    onTestFail(test) {
        let caseIds = this.titleToCaseIds(test.title);
        if (caseIds.length > 0) {
            for (let index = 0; index < caseIds.length; index++) {
                const element = caseIds[index];
                const errorMsg = test?.error?.stack?.replace(/\[\d{1,2}m/gm, "");
                __classPrivateFieldGet(this, _TestRailReporter_testCases, "f").push({
                    case_id: `${element}`,
                    status_id: "5",
                    comment: `${test.fullTitle}\n\n${errorMsg}`,
                });
            }
        }
    }
    onTestSkip(test) {
        let caseIds = this.titleToCaseIds(test.title);
        if (caseIds.length > 0) {
            for (let index = 0; index < caseIds.length; index++) {
                const element = caseIds[index];
                __classPrivateFieldGet(this, _TestRailReporter_testCases, "f").push({
                    case_id: `${element}`,
                    status_id: "4",
                    comment: `${test.fullTitle} was skipped.`,
                });
            }
        }
    }
    onSuiteEnd(suiteStats) {
        __classPrivateFieldGet(this, _TestRailReporter_requestPromises, "f").push(__classPrivateFieldGet(this, _TestRailReporter_instances, "m", _TestRailReporter_updateSuite).call(this, suiteStats));
    }
    onRunnerEnd() {
        __classPrivateFieldGet(this, _TestRailReporter_requestPromises, "f").push(__classPrivateFieldGet(this, _TestRailReporter_instances, "m", _TestRailReporter_updateTestRun).call(this));
    }
    async sync() {
        await Promise.all(__classPrivateFieldGet(this, _TestRailReporter_requestPromises, "f"));
        __classPrivateFieldSet(this, _TestRailReporter_synced, true, "f");
    }
}
_TestRailReporter_api = new WeakMap(), _TestRailReporter_options = new WeakMap(), _TestRailReporter_synced = new WeakMap(), _TestRailReporter_testCases = new WeakMap(), _TestRailReporter_requestPromises = new WeakMap(), _TestRailReporter_instances = new WeakSet(), _TestRailReporter_getRunId = function _TestRailReporter_getRunId() {
    return __classPrivateFieldGet(this, _TestRailReporter_options, "f").oneReport
        ? __classPrivateFieldGet(this, _TestRailReporter_api, "f").getLastTestRun(__classPrivateFieldGet(this, _TestRailReporter_options, "f").suiteId, __classPrivateFieldGet(this, _TestRailReporter_options, "f").runName)
        : __classPrivateFieldGet(this, _TestRailReporter_api, "f").createTestRun({
            suite_id: __classPrivateFieldGet(this, _TestRailReporter_options, "f").suiteId,
            name: __classPrivateFieldGet(this, _TestRailReporter_options, "f").runName,
            include_all: __classPrivateFieldGet(this, _TestRailReporter_options, "f").includeAll,
        });
}, _TestRailReporter_updateSuite = async function _TestRailReporter_updateSuite(suiteStats) {
    const values = {
        general: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        errors: [],
    };
    for (const test of suiteStats.tests) {
        switch (test.state) {
            case "failed":
                values.failed = values.failed + 1;
                values.failed += 1;
                values.errors.push(`Failed on: ${test.title} \n ${JSON.stringify(test.errors, null, 1)}`);
                break;
            case "passed":
                values.passed += 1;
                break;
            case "skipped":
                values.skipped += 1;
                break;
        }
    }
    if (values.failed > 0) {
        values.general = 5;
    }
    else if (values.passed === 0 && values.skipped !== 0) {
        values.general = 4;
    }
    else {
        values.general = 1;
    }
    const results = {
        status_id: values.general.toString(),
        comment: JSON.stringify(values, null, 1),
    };
    const testId = suiteStats.fullTitle.split(" ")[0].replace("C", "");
    return __classPrivateFieldGet(this, _TestRailReporter_api, "f").pushResults(testId, results);
}, _TestRailReporter_updateTestRun = async function _TestRailReporter_updateTestRun() {
    const runId = await __classPrivateFieldGet(this, _TestRailReporter_instances, "m", _TestRailReporter_getRunId).call(this);
    const caseIds = __classPrivateFieldGet(this, _TestRailReporter_testCases, "f").map((test) => test.case_id);
    await __classPrivateFieldGet(this, _TestRailReporter_api, "f").updateTestRun(runId, caseIds),
        await __classPrivateFieldGet(this, _TestRailReporter_api, "f").updateTestRunResults(runId, __classPrivateFieldGet(this, _TestRailReporter_testCases, "f"));
};
