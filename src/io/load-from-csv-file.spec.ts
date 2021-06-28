import { expect } from "chai";
import { createSimpleLineConverter } from "./load-from-csv-file";

describe(createSimpleLineConverter.name, () => {
    it('should convert lines of text to object correctly', async () => {
        const converter = createSimpleLineConverter<ExampleDataObject>("Name", "Description")
        const obj = converter({
            lineNumber: 1,
            fields: ['My Name!', 'My Description!'],
        })

        expect(obj).to.deep.equal({
            Name: 'My Name!',
            Description: 'My Description!',
        })
    })
})

interface ExampleDataObject {
    Name: string
    Description: string
}