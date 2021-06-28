import { writeCSV } from "./csv-writer"
import { lineWriter } from "./line-writer"

export async function writeToCSVFile
<T extends object>(options: Options<T>) {
    const {
        filename,
        data,
        columnNames,
        hasHeaderRow
    } = options

    try {
        const writer = writeCSV({
            data,
            columnNames,
            hasHeaderRow,
        })

        await lineWriter({
            filename,
            data: writer,
        })
    } catch (e) {
        throw new Error(`Failure writing to CSV file ${filename}.\n${e}`)
    }
}

interface Options<T> {
    filename: string
    data: T[]
    columnNames: (keyof T)[]
    hasHeaderRow?: boolean
}