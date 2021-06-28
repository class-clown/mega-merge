/**
 * Return a generator that yields strings representing each row of a CSV
 */
 export async function* writeCSV<T>(options: Options<T>) {
    const {
        data,
        columnNames: columns,
        hasHeaderRow = false,
        delimiter = ','
    } = options

    if (columns.length <= 0) {
        throw new Error(`Must specify at least 1 column for writing CSV`)
    }

    if (hasHeaderRow) {
        yield columns.join(delimiter)
    }

    for (const datum of data) {
        const fields: any[] = []
        for (let i = 0; i < columns.length; i++) {
            fields.push(datum[columns[i]])
        }
        yield fields.join(delimiter)
    }
}
interface Options<T> {
    data: T[]
    columnNames: (keyof T)[]
    hasHeaderRow?: boolean
    delimiter?: string
}