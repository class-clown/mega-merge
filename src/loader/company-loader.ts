import path from "path"
import { loadFromCSVFile } from "../io"
import { CatalogItem, SupplierProductBarcode, Supplier } from "../model"

export async function loadCompanyData(directory: string, company: string) {
    try {
        const allCatalogItems = await loadFromCSVFile<CatalogItem>({
            filename: path.join(directory, `catalog${company}.csv`),
            columnNames: ['SKU', 'Description'],
            hasHeaderRow: true,
        })
        const allBarcodes = await loadFromCSVFile<SupplierProductBarcode>({
            filename: path.join(directory, `barcodes${company}.csv`),
            columnNames: ['SupplierID', 'SKU', 'Barcode'],
            hasHeaderRow: true,
        })
        const allSuppliers = await loadFromCSVFile<Supplier>({
            filename: path.join(directory, `suppliers${company}.csv`),
            columnNames: ['ID', 'Name'],
            hasHeaderRow: true,

        })

        const result: CompanyData = {
            name: company,
            catalogItems: [],
            // barcodes: allBarcodes,
            // suppliers: allSuppliers,
        }
        for (const catalogItem of allCatalogItems) {
            result.catalogItems.push({
                ...catalogItem,
                barcodes: allBarcodes.filter((b) => b.SKU === catalogItem.SKU),
            })
        }
        return result
    } catch (e) {
        throw new Error(`Failed loading data for company ${company}.\n${e}`)
    }
}

export interface CompanyData {
    name: string
    catalogItems: _CatalogItem[]
    // barcodes: SupplierProductBarcode[]
    // suppliers: Supplier[]
}

// Internal interfaces, which mimic the relationships between the entities
export interface _CatalogItem extends CatalogItem {
    barcodes: SupplierProductBarcode[]
}
