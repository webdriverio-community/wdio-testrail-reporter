import { describe, test, expect } from 'vitest'
import TestRailReporter from '../src/reporter.ts'
import { TestStats } from '@wdio/reporter'
import { ReporterOptions } from '../src/types.ts'

const fs = require('fs')
const path = require('path')

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

test('I am a test', () => {
    expect(1).toBe(1)
})
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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

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
        testRailReporter.getTestCasesArray().forEach((testCase) => {
            console.log(testCase.case_id)
        })

        expect(testRailReporter.getTestCasesArray().length).toEqual(5)
        expect(typeof testRailReporter.getTestCasesArray()[0].case_id).toEqual(
            'string'
        )
    })
})
