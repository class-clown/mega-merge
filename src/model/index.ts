export interface CatalogItem {
    SKU: string
    Description: string
}

export interface SupplierProductBarcode {
    SupplierID: string
    SKU: string
    Barcode: string
}

export interface Supplier {
    ID: string
    Name: string
}