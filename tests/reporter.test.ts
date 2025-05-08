import fs from 'node:fs'
import path from 'node:path'

import { describe, test, expect } from 'vitest'
import TestRailReporter from '../src/reporter.ts'
import type { ReporterOptions } from '../src/types.ts'

const mockOptions: ReporterOptions = {
    projectId: '1',
    suiteId: '1',
    domain: 'domain.testrail.io',
    username: 'username',
    apiToken: 'token',
    runName: 'NewRun',
    oneReport: true,
    includeAll: false,
    caseIdTagPrefix: '',
    useCucumber: false,
    timeInMinutes: 30,
    logFile: '../logFileToSatisfyReporterOptions.log',
}
const mockOptionsExistingRun: ReporterOptions = {
    projectId: '1',
    suiteId: '1',
    domain: 'domain.testrail.io',
    username: 'username',
    apiToken: 'token',
    runName: 'ExistingRun',
    existingRunId: '26',
    oneReport: true,
    includeAll: true,
    caseIdTagPrefix: '',
    useCucumber: false,
    timeInMinutes: 30,
    logFile: '../logFileToSatisfyReporterOptions.log',
}

describe.each([
    { options: mockOptions },
    { options: mockOptionsExistingRun }
])('Single CaseID Extraction', ({ options }) => {
    test(`Should extract a single CaseID for onTestPass() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/SinglePassingTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)

        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(options)
        testRailReporter.onTestPass(testStats) // Simulate the onTestPass method
        expect(testRailReporter.getTestCasesArray().length).toEqual(1)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
    test(`Should extract a single CaseID for onTestFail() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/SingleFailingTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)

        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestFail(testStats) // Simulate the onTestPass method
        expect(testRailReporter.getTestCasesArray().length).toEqual(1)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
    test(`Should extract a single CaseID for onTestSkip() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/SingleSkippedTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)

        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestSkip(testStats) // Simulate the onTestPass method

        expect(testRailReporter.getTestCasesArray().length).toEqual(1)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
})
describe.each([
    { options: mockOptions },
    { options: mockOptionsExistingRun }
])('Multiple CaseID Extraction', ({ options }) => {
    test(`Should extract multiple CaseIDs for onTestPass() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/MultiPassingTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)

        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestPass(testStats) // Simulate the onTestPass method

        expect(testRailReporter.getTestCasesArray().length).toEqual(3)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
    test(`Should extract multiple CaseIDs for onTestFail() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/MultiFailingTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)

        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestFail(testStats) // Simulate the onTestPass method

        expect(testRailReporter.getTestCasesArray().length).toEqual(3)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
    test(`Should extract multiple CaseIDs for onTestSkip() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/MultiSkippedTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)

        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestSkip(testStats) // Simulate the onTestPass method

        expect(testRailReporter.getTestCasesArray().length).toEqual(3)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
    test(`Should extract five CaseIDs for onTestPass() with options '${options.runName}'`, () => {
        const jsonFileName = './fixtures/FiveMultiPassingTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)
        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestPass(testStats) // Simulate the onTestPass method

        expect(testRailReporter.getTestCasesArray().length).toEqual(5)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
})
describe('Updating existing run instead of creating new run(s)', () => {
    test('Should use existingRunId if set', () => {
        const jsonFileName = './fixtures/FiveMultiPassingTest.json'
        const jsonFilePath = path.join(__dirname, jsonFileName)
        const externalJsonData = JSON.parse(
            fs.readFileSync(jsonFilePath, 'utf-8')
        )

        const testStats = {
            ...externalJsonData,
            start: new Date(),
        }

        mockOptions.existingRunId = '26'
        const testRailReporter = new TestRailReporter(mockOptions)
        testRailReporter.onTestPass(testStats) // Simulate the onTestPass method

        expect(testRailReporter.runId).toEqual('26')
    })
})
describe('Minor code checks', () => {
    test('Should include all elements but first', () => {
        let args: unknown[] = ['something', 4, false, 'something-else']
        const eventName = args[0] as string | symbol
        [, ...args] = args
        expect(eventName).toEqual('something')
        expect(args).toEqual([4, false, 'something-else'])
    })
})

