import { expect } from 'chai';
import fs, { promises as fsp } from 'fs'
import { lineReader } from "./line-reader";

describe(lineReader.name, () => {
    const tempFile = "temp.txt"
    beforeEach(async () => {
        if (await fs.existsSync(tempFile)) {
            await fsp.unlink(tempFile)
        }
    })

    afterEach(async () => {
        if (await fs.existsSync(tempFile)) {
            await fsp.unlink(tempFile)
        }
    })

    it('should read lines correctly', async () => {
        // Write a temporary file
        fsp.writeFile(tempFile, `First Line
Second Line
Third Line`)
        const reader = lineReader({ filename: tempFile })

        expect((await reader.next()).value).to.be.equal('First Line')
        expect((await reader.next()).value).to.be.equal('Second Line')
        expect((await reader.next()).value).to.be.equal('Third Line')
        expect((await reader.next()).done).to.be.true
    })

    it('should throw error for non-existent file', async () => {
        expect(lineReader({ filename: 'asdf-sdafvdsv-asfasefaef-aav.txt' })).to.throw
    })
})