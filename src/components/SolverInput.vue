<template>
    <div id="solver-input" class="solver_input">
        <h2>Input</h2>

        <b-row>
            <b-col cols="6">
                <b-form-group
                    label="Available Lengths"
                    label-for="input_available_lengths"
                >
                    <b-form-input
                        id="input_available_lengths"
                        v-model="new_length"
                        placeholder="Enter a length"
                        type="number"
                        min="1"
                        :state="validLength(new_length) ? null : false"
                    />
                </b-form-group>
            </b-col>

            <b-col cols="6">
                <b-form-group
                    label="Cutting Width"
                    label-for="input_cut_width"
                >
                    <b-form-input
                        id="input_cut_width"
                        v-model="new_cut_width"
                        :state="validCut(new_cut_width) ? null : false"
                        min="0"
                        max="10"
                        number
                        placeholder="Enter cut width (0-10)"
                        type="number"
                    />
                    <b-button
                        @click="addLength"
                        variant="secondary"
                        class="mt-2"
                        :disabled="!validLength(new_length) || !validCut(new_cut_width)"
                    >
                        Add Length
                    </b-button>
                </b-form-group>
            </b-col>
        </b-row>

        <b-list-group>
            <b-list-group-item
                v-for="(item, index) in available_lengths"
                :key="index"
                class="d-flex justify-content-between align-items-center"
            >
                Length: {{ item.length }} | Cutting Width: {{ item.cut_width }}
                <b-button @click="removeLength(index)" variant="danger" size="sm">Remove</b-button>
            </b-list-group-item>
        </b-list-group>

        <DataTable
            ref="main_output"
            :default-required="defaultRequired"
            :available-lengths="available_lengths"
            :cut-width="new_cut_width"
            :required.sync="required"
        />
    </div>
</template>

<script>
import { Job } from "@/components/data/Job";
import validators from "@/components/data/validators";
import DataTable from "@/components/DataTable";
import json_testjob from "../tests/data/testjob.json";

export default {
    name: "SolverInput",
    components: { DataTable },
    mixins: [validators],
    data: function () {
        return {
            new_length: '',
            new_cut_width: '',
            available_lengths: [],
            defaultRequired: this.sizes_as_list(json_testjob.required),
            required: []
        }
    },
    computed: {
        job() {
            return new Job(this.available_lengths.map(item => item.length), this.getCutWidths(), this.required);
        },
        valid() {
            return this.job.valid();
        }
    },
    methods: {
        addLength() {
            const length = Number(this.new_length);
            const cut_width = Number(this.new_cut_width);
            if (length > 0 && this.validCut(cut_width)) {
                this.available_lengths.push({ length, cut_width });
                this.new_length = '';
                this.new_cut_width = '';
                this.$emit('update-lengths', this.available_lengths);
            } else {
                this.showWarning("Please enter a valid length and cut width.");
            }
        },
        removeLength(index) {
            this.available_lengths.splice(index, 1);
        },
        validCut(width) {
            return (Number.isInteger(width) && width >= 0 && width <= 10);
        },
        validLength(length) {
            return length > 0;
        },
        getCutWidths() {
            return this.available_lengths.map(item => item.cut_width);
        },
        sizes_as_list(required) {
            const sizes = required.map(size => ({
                name: size.name,
                quantity: parseInt(size.quantity) || 0, // Garante que quantity seja um número
                length: parseInt(size.length)
            }));
            console.log("Sizes as list:", sizes); // Adicione esta linha para verificar os dados
            return sizes;
        },
    }
}
</script>

<style scoped>
    .solver_input {
        padding: 8px;
    }
</style>
