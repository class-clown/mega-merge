import path from 'path';
import yargs from 'yargs'
import { writeToCSVFile } from './io';
import { loadCompanyData } from './loader'
import { megaMerge } from './mega-merge';


process.on('uncaughtException', (err) => {
    console.error(err)
});

/*
 * NOTE: This top-level async wrapper shouldn't be required, but an error in
 * the yargs Typescript defintion means that argv is incorrectly typed as a
 * Promise.
 */
(async () => {
    try {
        const args = await readCommandLine()

        // Bit of a bug in yargs Type definitions means we need to force the input_companies to be a string[]
        const { input_dir, output_file } = args
        const input_companies = args.input_companies as string[]

        if (input_companies.length < 2) {
            throw new Error(`Must specify at least 2 companies to merge`)
        }

        // Load
        const companyDataArray = await Promise.all(
            input_companies.map((company) => loadCompanyData(input_dir, company))
        )

        // Merge
        const mergedData = megaMerge(...companyDataArray)

        // Write output
        await writeToCSVFile({
            filename: output_file,
            data: mergedData,
            columnNames: ['SKU', 'Description', 'Source'],
            hasHeaderRow: true,
        })

    } catch (e) {
        console.error(`Failed to run. ${e}`)
    }
})()

async function readCommandLine() {
    const yargsOptions = {
        input_dir: {
            type: 'string',
            demandOption: true,
            description: `Files will be loaded from the directory. Files must be named according to the following.
        
        Barcodes files must be named 'barcodes<company>.csv', where '<company>' is the name of the company from which the barcodes originated.
        
        Same naming pattern for 'catalog' and 'suppliers'`,
        },
        input_companies: {
            type: 'array',
            demandOption: true,
            description: `The order in which companies will be processed. This affects the resulting output. Must have at least 2 companies.
        Example: given two companies A and B, to make the catalog items from company B appear first, the input will be 'B A'`
        },
        output_file: {
            type: 'string',
            demandOption: true,
        },
    } as const
    const argv = yargs(process.argv.slice(2))
        .options(yargsOptions)
        .default('input_dir', 'input')
        .default('output_file', path.join('output', 'result_output.csv'))
        .default('input_companies', ['A', 'B'])
        .argv

    // Force realArgv to not be a Promise
    return await argv
}