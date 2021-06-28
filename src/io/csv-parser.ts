/**
 * Returns a generator function which will yield the fields of CSV input.
 * 
 * FUTURE: Consider being able to derive the columns by interrogating the header line
 */
export async function* parseCSV<T>(options: Options<T>) {
    const {
        source,
        parser: converter,
        // default values for optional arguments
        hasHeaderRow = false,
        delimiter = ',',
    } = options

    let lineNumber = 0
    try {
        for (let next = await source.next(); !next.done; next = await source.next()) {
            lineNumber++

            if (lineNumber === 1 && hasHeaderRow) {
                continue
            }

            const line = next.value
            const t = converter({
                lineNumber,
                fields: line.split(delimiter),
            })
            yield t
        }
    } catch (e) {
        throw new Error(`Failure parsing line number ${lineNumber}.\n${e}`)
    }
}

interface Options<T> {
    /** Source from which lines of plaintext is to be read. */
    source: AsyncGenerator<string>
    /** Function called for each line read from the source. */
    parser: LineParser<T>
    /** If true, will skip reading the first line of text. Default: false.*/
    hasHeaderRow?: boolean
    /** Specify the delimiter. Default: , */
    delimiter?: string
}
export type LineParser<T> = (line: { lineNumber: number, fields: string[] }) => T
