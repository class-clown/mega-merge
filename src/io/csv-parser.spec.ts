import { expect } from 'chai'
import { parseCSV } from './csv-parser'


describe(parseCSV.name, () => {
    it('should return rows correctly', async () => {
        const parser = parseCSV({
            source: simpleData(),
            parser: (line) => line, // Don't transform line
        })

        expect((await parser.next()).value!.fields).to.deep.equal(['row','one'])
        expect((await parser.next()).value!.fields).to.deep.equal(['row','two'])
        expect((await parser.next()).value!.fields).to.deep.equal(['row','three'])
        expect((await parser.next()).done).to.be.true
    })

    it('should skip first row if hasHeaderRow is true', async () => {
        const parser = parseCSV( {
            source: simpleData(),
            parser: (line) => line, // Don't transform line
            hasHeaderRow: true,
        })

        expect((await parser.next()).value!.fields).to.deep.equal(['row','two'])
        expect((await parser.next()).value!.fields).to.deep.equal(['row','three'])
        expect((await parser.next()).done).to.be.true
    })

    it('should allow use of custom delimiter', async () => {
        const parser = parseCSV({
            source: async function*() {
                yield 'row@fi,rst'
                yield 'row@se,cond'
                yield 'row@th,ird'
            }(),
            parser: (line) => line,
            delimiter: '@',
        })

        expect((await parser.next()).value!.fields).to.deep.equal(['row','fi,rst'])
        expect((await parser.next()).value!.fields).to.deep.equal(['row','se,cond'])
        expect((await parser.next()).value!.fields).to.deep.equal(['row','th,ird'])
        expect((await parser.next()).done).to.be.true
    })
})


async function* simpleData() {
    yield "row,one"
    yield "row,two"
    yield "row,three"
}