# README

## Requirements

- NodeJS 12+ (use nvm for simplier management)

## Getting started

1. Check out the repository using git.
1. In the root of this project, run `npm ci`

### Running the application

The application is set up to read from `input` and write to `output/result_output.csv` by default.

1. Run the application with `npm start --silent`; the `--silent` flag suppress some annoying NPM error messages
1. The directories being read my be specified using some command line arguments, like so: `npm start --silent -- --input_dir my_input_dir --output_file results/my_results.csv --input_companies CompanyA CompanyB CompanyC`
    - For information on command line usage and input file naming requirements, please run `npm start --silent -- --help`

### Testing the application

1. Run `npm test`

## General development notes

- *I don't know how the Suppliers data is used*. The output can be generated without the suppliers information it seems. I'd need more information/requirements before incorporating the Supplier information into the merge.
- This is a TypeScript project, and thus I've opted to use a more functional programming-style rather than an object oriented style. Typescript does support classes, but I've elcted not to use them. Major frameworks (React, Redux, etc) promote usage of functional programming.
- I have not optimised for time-complexity, which is why I have nested loops 3 deep (!) in mega merge. Can improve later if required.
- The output does not match the sample provided exactly, as the order of catalog items is different. I didn't try to match the output exactly since the logic is still correct.
- Tested on:
    - Windows 10 (PowerShell)
    - Windows 10 (git-bash)
    - Windows 10 (WSL - Ubuntu LTS)