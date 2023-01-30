import type { TestResults, NewTest, ReporterOptions, TestCase } from './types';
export default class TestRailAPI {
    #private;
    constructor(options: ReporterOptions);
    updateTestRunResults(runId: string, results: TestCase[]): Promise<import("axios").AxiosResponse<any, any> | undefined>;
    updateTestRun(runId: string, case_ids: unknown[]): Promise<import("axios").AxiosResponse<any, any> | undefined>;
    pushResults(testId: string, results: TestResults): Promise<import("axios").AxiosResponse<any, any> | undefined>;
    createTestRun(test: NewTest, runName?: string): Promise<string>;
    getLastTestRun(suiteId: string, runName: string): Promise<any>;
}
//# sourceMappingURL=api.d.ts.map