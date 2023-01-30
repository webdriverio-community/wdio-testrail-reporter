import WDIOReporter, { TestStats, SuiteStats } from "@wdio/reporter";
import type { ReporterOptions } from "./types";
export default class TestRailReporter extends WDIOReporter {
    #private;
    constructor(options: ReporterOptions);
    get isSynchronised(): boolean;
    titleToCaseIds(title: string): number[];
    onTestPass(test: TestStats): void;
    onTestFail(test: TestStats): void;
    onTestSkip(test: TestStats): void;
    onSuiteEnd(suiteStats: SuiteStats): void;
    onRunnerEnd(): void;
    sync(): Promise<void>;
}
//# sourceMappingURL=reporter.d.ts.map