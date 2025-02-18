import { describe, test, expect } from 'vitest'
import TestRailReporter from '../src/reporter.ts'
import { ReporterOptions } from '../src/types.ts'

import fs from 'fs'
import path from 'path'

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
    logFile: '../logFileToSatisfyReporterOptions.log',
}
describe('Single CaseID Extraction', () => {
    test('Should extract a single CaseID for onTestPass()', () => {
        const jsonFileName = './fixtures/SinglePassingTest.json'
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
        expect(testRailReporter.getTestCasesArray().length).toEqual(1)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
    test('Should extract a single CaseID for onTestFail()', () => {
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
    test('Should extract a single CaseID for onTestSkip()', () => {
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
describe('Multiple CaseID Extraction', () => {
    test('Should extract multiple CaseIDs for onTestPass()', () => {
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
    test('Should extract multiple CaseIDs for onTestFail()', () => {
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
    test('Should extract multiple CaseIDs for onTestSkip()', () => {
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
    test('Should extract five CaseIDs for onTestPass()', () => {
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
    test('Should use runId if set', () => {
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
