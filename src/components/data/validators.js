import { Result } from "@/components/data/Result";

export default {
    methods: {
        validQuantity(quantity) {
            return Number.isInteger(quantity) && quantity > 0;
        },
        validLength(length, max_length) {
            const availableLengths = this.availableLengths.map(item => item.length);
            const minAvailableLength = Math.min(...availableLengths);
            return Number.isInteger(length) && length > 0 && length < minAvailableLength;
        },
        validAvailableLengths(lengths) {
            return Array.isArray(lengths) && lengths.every(length => Number.isInteger(length) && length > 0);
        },
        validResult(obj) {
            return (obj instanceof Result && obj.valid());
        }
    }
}
