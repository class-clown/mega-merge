import { expect } from "chai";
import { writeCSV } from "./csv-writer";

describe(writeCSV.name, () => {
    const simpleData: ExampleDataItem[] = [{
        Name: 'One',
        Description: 'First Item',
    }, {
        Name: 'Two',
        Description: 'Second Item',
    }, {
        Name: 'Three',
        Description: 'Third Item',
    }]

    it('should write data correctly', async () => {
        const writer = writeCSV({
            data: simpleData,
            columnNames: ['Name', 'Description'],
        })

        expect((await writer.next()).value).to.be.equal('One,First Item')
        expect((await writer.next()).value).to.be.equal('Two,Second Item')
        expect((await writer.next()).value).to.be.equal('Three,Third Item')
        expect((await writer.next()).done).to.be.true
    })

    it('should write header line if hasHeaderRow is true', async () => {
        const writer = writeCSV({
            data: simpleData,
            columnNames: ['Name', 'Description'],
            hasHeaderRow: true,
        })

        expect((await writer.next()).value).to.be.equal('Name,Description')
        expect((await writer.next()).value).to.be.equal('One,First Item')
        expect((await writer.next()).value).to.be.equal('Two,Second Item')
        expect((await writer.next()).value).to.be.equal('Three,Third Item')
        expect((await writer.next()).done).to.be.true
    })

    it('should allow use of custom delimiter', async () => {
        const writer = writeCSV({
            data: simpleData,
            columnNames: ['Name', 'Description'],
            delimiter: '@',
        })

        expect((await writer.next()).value).to.be.equal('One@First Item')
        expect((await writer.next()).value).to.be.equal('Two@Second Item')
        expect((await writer.next()).value).to.be.equal('Three@Third Item')
        expect((await writer.next()).done).to.be.true
    })
})

interface ExampleDataItem {
    Name: string
    Description: string
}