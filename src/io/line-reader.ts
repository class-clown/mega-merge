import fs, { promises as fsp } from 'fs'
import readline from 'readline'

/**
 * Return a async generator function that yields each line of the specified file.
 * @throws Exception if file cannot be loaded, or a problem occurs while reading.
 */
export async function* lineReader(options: Options) {
    const { filename } = options

    // For some weird reason, if file doesn't exist Node will auto catch it
    // at the top level, without giving us a chance to catch it. So, manually
    // check for file existance before continuing
    if (!fs.existsSync(filename)) {
        throw new Error(`File ${filename} does not exist`)
    }

    
    const rl = readline.createInterface({
        input: fs.createReadStream(filename), 
    })

    let lineNumber = 0;
    try {
        for await (const line of rl) {
            lineNumber++;
            yield line
        }
    } catch (e) {
        throw new Error(`Failure reading ${filename} at line number ${lineNumber}. ${e}`)
    }
}

interface Options {
    filename: string
}