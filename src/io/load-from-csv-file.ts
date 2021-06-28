import { LineParser, parseCSV } from "./csv-parser"
import { lineReader } from "./line-reader"

/**
 * Load data from a CSV file, returning an array of objects for each row.
 * 
 * @param options 
 * @returns All the items from the CSV file.
 */
export const loadFromCSVFile = async <T extends object>(options: Options<T>) => {
    const {
        filename,
        columnNames,
        hasHeaderRow,
    } = options

    try {
        const parser = parseCSV({
            source: lineReader({ filename }),
            parser: createSimpleLineConverter(...columnNames),
            hasHeaderRow,
        })

        const items: T[] = []
        for (let result = await parser.next(); !result.done; result = await parser.next()) {
            items.push(result.value)
        }
        return items
    } catch (e) {
        throw new Error(`Failed to load from CSV file ${filename}.\n${e}`)
    }
}
interface Options<T> {
    filename: string
    columnNames: (keyof T)[]
    hasHeaderRow?: boolean
}

/**
 * Create a line converter that will fail if the number of fields in a line does not match the number of columns expected.
 * @param columnNames The name of the columns, in order from left to right
 */
export function createSimpleLineConverter<T extends object>(...columnNames: (keyof T)[]): LineParser<T> {
    return (line) => {
        if (line.fields.length !== columnNames.length) {
            throw new Error(`Expected ${columnNames.length} columns of data but got ${line.fields.length}`)
        }

        // Bit of magic here; create result as any and force cast it return.
        // Note that this is not ideal as we bypass Typescript checking, and could
        // potentially return an invalid object or an object containing undefined
        // values. For example, if the type T is { name: string, age: number },
        // but the caller only specifies 'name' as the column name, we would
        // return an object where 'age' is undefined, but Typescript will still say that it is a number.
        // A cheap way to resolve this is to return a Partial<T> rather than a full T.
        const result: any = {}
        for (let i = 0; i < columnNames.length; i++) {
            result[columnNames[i]] = line.fields[i]
        }
        return result
    }
}