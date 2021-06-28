import { expect } from "chai";
import { megaMerge } from "./mega-merge";

describe(megaMerge.name, () => {
    it('should include both catalog items if no barcodes match', () => {
        const merged = megaMerge({
            name: 'A',
            catalogItems: [{
                Description: 'from company A',
                SKU: 'SKU-01',
                barcodes: [{
                    Barcode: 'Barcode-01',
                    SKU: 'SKU-01',
                    SupplierID: '1',
                }]
            }],
        }, {
            name: 'B',
            catalogItems: [{
                Description: 'from company B',
                SKU: 'SKU-01', // Note: Same SKU
                barcodes: [{
                    Barcode: 'Barcode-02',
                    SKU: 'SKU-01',
                    SupplierID: '1',
                }]
            }],
        })

        expect(merged.length).to.be.equal(2)
        expect(merged[0].SKU).to.be.equal('SKU-01')
        expect(merged[0].Description).to.be.equal('from company A')
        expect(merged[0].Source).to.be.equal('A')
        expect(merged[1].SKU).to.be.equal('SKU-01')
        expect(merged[1].Description).to.be.equal('from company B')
        expect(merged[1].Source).to.be.equal('B')
    })

    it('should include only first companys catalog item if a matching barcode is found', () => {
        const merged = megaMerge({
            name: 'A',
            catalogItems: [{
                Description: 'from company A',
                SKU: 'SKU-01',
                barcodes: [{
                    Barcode: 'Barcode-01',
                    SKU: 'SKU-01',
                    SupplierID: '1',
                }]
            }],
        }, {
            name: 'B',
            catalogItems: [{
                Description: 'from company B',
                SKU: 'SKU-02', // Note: Differnt SKU
                barcodes: [{
                    Barcode: 'Barcode-01', // Note: Same Barcode
                    SKU: 'SKU-02',
                    SupplierID: '1',
                }]
            }],
        })

        expect(merged.length).to.be.equal(1)
        expect(merged[0].SKU).to.be.equal('SKU-01')
        expect(merged[0].Description).to.be.equal('from company A')
        expect(merged[0].Source).to.be.equal('A')
    })
})