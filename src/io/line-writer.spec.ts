import { expect } from 'chai';
import fs, { promises as fsp } from 'fs'
import { lineWriter } from "./line-writer";

describe(lineWriter.name, () => {
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

    it('should write lines to file correctly', async () => {
        await lineWriter({
            data: simpleData(),
            filename: tempFile,
        })

        // Bit tricky; we need to read the file to check the content
        const fileContent = await (await fsp.readFile(tempFile)).toString()
        expect(fileContent).to.be.equal(`First Line
Second Line
Third Line
`) // FIXME we shouldn't add trailing newline if not neccessary. OR, provide it as an option to lineWriter
    })

    // TODO need platform information to determine invalid files; skip for now
    it.skip('should fail if filename is invalid', async () => {
        expect(lineWriter({ data: simpleData(), filename: 'invalid?file.csv' })).to.throw
    })
})

async function* simpleData() {
    yield 'First Line'
    yield 'Second Line'
    yield 'Third Line'
}