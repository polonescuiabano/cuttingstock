export class Job {
    constructor(stocks, cut_width, required, available_lengths) {
        this.cut_width = cut_width;
        this.stocks = stocks;
        this.required = required;
        this.available_lengths = available_lengths; // Adiciona os tamanhos disponíveis
    }

    valid() {
        return (
            Array.isArray(this.stocks) && this.stocks.length > 0 &&
            this.stocks.every(s => Number.isInteger(s.length) && s.length > 0) &&
            Number.isInteger(this.cut_width) && this.cut_width > 0 &&
            Array.isArray(this.required) && this.required.length > 0 &&
            Array.isArray(this.available_lengths) // Valida os tamanhos disponíveis
        );
    }
}
