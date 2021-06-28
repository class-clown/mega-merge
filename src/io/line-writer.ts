import { createWriteStream, promises as fsp } from "fs"
import path from "path"

export async function lineWriter(options: Options) {
    const { filename, data } = options

    try {
        // Make parent directory if required
        await fsp.mkdir(path.dirname(filename), { recursive: true })

        const ws = createWriteStream(filename)

        for (let result = await data.next(); !result.done; result = await data.next()) {
            // TODO should probably detect if we need CRLF, or if LF is enough
            ws.write(result.value + '\n')
        }
    } catch (e) {
        throw new Error(`Failed to write line to file.\n${e}`)
    }
}

interface Options {
    filename: string
    data: AsyncGenerator<string>,
}