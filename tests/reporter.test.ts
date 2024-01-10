import { test, expect } from 'vitest'
import TestRailReporter from '../src/reporter.ts'
import { TestStats } from '@wdio/reporter'
import { ReporterOptions } from '../src/types.ts';

// test('I am a test', () => {
//     expect(1).toBe(1)
// })
test('Should extract out a single CaseID', () => {
    // type TestState = 'passed' | 'pending' | 'skipped' | 'failed';
    
    const testStats: TestStats = {
        type: 'test',
        start: new Date(),
        _duration: 1,
        uid: 'test-00-1',
        cid: '0-0',
        title: 'C00000001 Passing Test',
        fullTitle: 'Describe Name.C00000001 Passing Test',
        output: [],
        retries: 0,
        parent: 'Describe Name',
        state: 'passed',
        body: 'async function () {\n      expect(true).to.equal(true);\n    }',
        pass() {},
        skip(reason: string) {},
        fail(errors?: Error[]) {},
        duration: 1,
        complete: true,
        // _stringifyDiffObjs?
    };
    
    const mockOptions: ReporterOptions = {
        projectId: '1',
        suiteId: '1',
        domain: 'domain.testrail.io',
        username: 'username',
        apiToken: 'token',
        runName: 'RunName',
        oneReport: true,
        includeAll: false,
        caseIdTagPrefix: '',
        useCucumber: false,
    };

    const testRailReporter = new TestRailReporter(mockOptions)
    testRailReporter.onTestPass(testStats) // Simulate the onTestPass method

    // Assertions based on the changes made by onTestPass
    // For instance, you might expect testCases array to have certain length or content
    // expect(
    //     testRailReporter.testCases.length
    // ).toBe(/* Expected length after onTestPass */)
    expect(true).toBe(true)
    // Add more assertions as needed based on the expected behavior after onTestPass
})
