<template>
    <b-table
        id="table-input"
        :fields="[{key: 'name', sortable:true},
                  {key: 'quantity', sortable:true},
                  {key: 'length', sortable:true},
                  {key: 'delete', label: '', thStyle: { width: '60px'}}]"
        :items="required"
        :tbody-transition-props="{name: 'flip-list'}"
        bordered
        fixed
        hover
        primary-key="id"
        small
        sort-by="length"
        sort-desc
        tbody-tr-class="table_row"
        thead-tr-class="table_headings"
    >
        <template #head(delete)>
            <b-button
                v-b-tooltip.hover="'Clear table'"
                @click="required.splice(0, required.length)"
            >
                <b-icon-trash-fill/>
            </b-button>
        </template>
        <template #cell(name)="row">
            <b-form-input
                v-model="row.item.name"
                lazy
                :placeholder="'Part?'"
            />
        </template>
        <template #cell(quantity)="row">
            <b-form-input
                v-model="row.item.quantity"
                :state="validQuantity(row.item.quantity) ? null : false"
                lazy
                min="1"
                number
                placeholder="1?"
                type="number"
            />
        </template>
        <template #cell(length)="row">
            <b-form-input
                v-model="row.item.length"
                :state="validLength(row.item.length) ? null : false"
                lazy
                min="1"
                number
                placeholder="100?"
                type="number"
            />
        </template>
        <template #cell(delete)="row">
            <b-button
                v-b-tooltip.hover="'Remove entry'"
                @click="deleteRow(row.item.id)"
            >
                <b-icon-backspace-fill/>
            </b-button>
        </template>

        <template #custom-foot>
            <b-th>
                <b-form-input
                    ref="input_new_name"
                    v-model="new_name"
                    placeholder="enter new name (optional)"
                    @keydown.enter="addRow()"
                />
            </b-th>
            <b-th>
                <b-form-input
                    ref="input_new_quantity"
                    v-model="new_quantity"
                    min="1"
                    number
                    placeholder="enter new quantity"
                    type="number"
                    :state="validQuantity(new_quantity) ? true : null"
                    @keydown.enter="addRow()"
                />
            </b-th>

            <b-th>
                <b-form-input
                    v-model="new_length"
                    min="1"
                    number
                    placeholder="enter new length"
                    type="number"
                    :state="validNewLength() ? true : null"
                    @keydown.enter="addRow()"
                />
            </b-th>

            <b-th>
                <b-button
                    :disabled="!validNewRow()"
                    @click="addRow()"
                >
                    <b-icon-plus-circle-fill/>
                </b-button>
            </b-th>
        </template>
    </b-table>
</template>

<script>
import validators from "@/components/data/validators";

export default {
    name: 'DataTable',
    mixins: [validators],
    props: {
        defaultRequired: {
            type: Array,
            required: true
        },
        availableLengths: { // Recebe as available_lengths do SolverInput
            type: Array,
            required: true
        }
    },
    data() {
        return {
            new_name: '',
            new_length: '',
            new_quantity: '',
            required: this.addIndex(this.defaultRequired),
        };
    },
    created() {
        this.$emit('update:required', this.required);
    },
    methods: {
        addIndex(array) {
            let iIndex = 0;
            array.forEach(row => row.id = iIndex++);
            return array;
        },
        validNewRow() {
            return (
                this.validNewLength() &&
                this.validQuantity(this.new_quantity)
            );
        },
        validNewLength() {
            const availableLengths = this.availableLengths.map(item => item.length);
            if (availableLengths.length === 0) {
                return true; // Se não houver lengths disponíveis, permitir qualquer valor
            }
            const minAvailableLength = Math.min(...availableLengths);

            console.log('Valores disponíveis:', availableLengths);
            console.log('Menor comprimento disponível:', minAvailableLength);
            console.log('Comprimento novo:', this.new_length);

            return this.new_length > 0 && this.new_length < minAvailableLength;
        },
        addRow() {
            if (!this.validNewRow()) {
                return;
            }

            let target = {
                name: this.new_name,
                quantity: this.new_quantity,
                length: this.new_length
            };

            target.id = this.required.length;
            this.required.push(target);

            this.new_name = '';
            this.new_quantity = '';
            this.new_length = '';
            this.$refs["input_new_quantity"].focus();
        },
        deleteRow(row) {
            let index = this.required.findIndex(element => (element.id === row));
            this.required.splice(index, 1);
        }
    }
}
</script>

<style>
.table_headings th {
    font-size: larger;
    vertical-align: middle !important;
}
.table_row td input {
    background-color: #0000;
    border: none;
    border-radius: 0;
}
table#table-input .flip-list-move {
    transition: transform 0.5s;
}
</style>
