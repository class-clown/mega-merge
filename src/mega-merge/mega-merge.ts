import { CatalogItem, CompanyData } from "../loader";

export function megaMerge(...companyDataArray: CompanyData[]) {
    const mergedCatalogItems: MergedCatalogItem[] = []

    for (let i = 0; i < companyDataArray.length; i++) {
        const companyData = companyDataArray[i]
        for (const catalogItem of companyData.catalogItems) {
            // If item already in the merged catalog, don't add it
            // Note: this is a very inefficient operation, in the order of O(n^3). Can optimize this by using maps for quick lookup
            if (mergedCatalogItems.some((mci) =>
                mci.barcodes.some((b) =>
                    catalogItem.barcodes.some((b2) => b.Barcode === b2.Barcode))
            )) {
                continue
            }

            mergedCatalogItems.push({
                ...catalogItem,
                Source: companyData.name,
            })
        }
    }

    return mergedCatalogItems
}

interface MergedCatalogItem extends CatalogItem {
    Source: string
}