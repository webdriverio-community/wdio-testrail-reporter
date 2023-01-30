var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CJSTestrailReporter_synced, _a;
exports.default = (_a = class CJSTestrailReporter {
        constructor(options) {
            _CJSTestrailReporter_synced.set(this, false);
            this.instance = import('../index.js').then((TestrailReporter) => {
                return new TestrailReporter.default(options);
            });
        }
        async emit(...args) {
            const instance = await this.instance;
            return instance.emit(...args);
        }
        get isSynchronised() {
            return __classPrivateFieldGet(this, _CJSTestrailReporter_synced, "f");
        }
        async onTestPass(test) {
            const instance = await this.instance;
            return instance.onTestPass(test);
        }
        async onTestFail(test) {
            const instance = await this.instance;
            return instance.onTestFail(test);
        }
        async onTestSkip(test) {
            const instance = await this.instance;
            return instance.onTestSkip(test);
        }
        async onSuiteEnd(suiteStats) {
            const instance = await this.instance;
            return instance.onSuiteEnd(suiteStats);
        }
        async onRunnerEnd() {
            const instance = await this.instance;
            return instance.onRunnerEnd();
        }
        async sync() {
            const instance = await this.instance;
            await instance.sync();
            __classPrivateFieldSet(this, _CJSTestrailReporter_synced, true, "f");
        }
    },
    _CJSTestrailReporter_synced = new WeakMap(),
    _a);
