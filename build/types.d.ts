export interface TestResults {
    status_id: string;
    comment: string;
}
export interface NewTest {
    suite_id: string;
    name?: string;
    include_all: boolean;
}
export interface TestCase {
    case_id: string;
    status_id: string;
    comment: string;
}
export interface ReporterOptions {
    domain: string;
    projectId: string;
    suiteId: string;
    username: string;
    apiToken: string;
    runName: string;
    oneReport: boolean;
    includeAll: boolean;
    buildName: string;
    runNumber: string;
}
//# sourceMappingURL=types.d.ts.map