<template>
    <b-container fluid="true" class="fix_fluid">
        <b-row align-h="center">
            <b-col xl="5">
                <SolverInput ref="input" @update-lengths="updateAvailableLengths" />
            </b-col>

            <b-col xl="*" align-self="center">
                <b-button
                    id="solve-button"
                    class="solve_button"
                    pill
                    size="lg"
                    type="submit"
                    @click="startSolving"
                >
                    Solve
                </b-button>
            </b-col>

            <b-col xl="5">
                <SolverOutput ref="output" :available-lengths="available_lengths" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import SolverInput from "@/components/SolverInput";
import SolverOutput from "@/components/SolverOutput";
import axios from 'axios'; // Certifique-se de importar axios

export default {
    name: 'MainSolver',
    components: { SolverInput, SolverOutput },
    data() {
        return {
            available_lengths: [] // Para armazenar os tamanhos disponíveis
        };
    },
    methods: {
        async startSolving() {
            const inputComponent = this.$refs.input;
            console.log("Required sizes:", inputComponent.required); 


            // Extrair dados de forma a remover a reatividade do Vue
            const cutWidth = Number(inputComponent.new_cut_width);
            const availableLengths = inputComponent.available_lengths.map(item => ({
                length: item.length,
                name: item.name || "infinite"
            }));
            const required = inputComponent.required.map(item => ({
                length: item.length,
                quantity: item.quantity,  
                name: item.name || ""
            }));

            const jobData = {
                cut_width: cutWidth,
                stocks: availableLengths,
                required: required
            };

            console.log("Job data being sent to backend:", jobData);

            try {
                const response = await axios.post('http://localhost:8000/solve', jobData);
                console.log("Response from backend:", JSON.stringify(response.data, null, 2));
                this.$refs.output.setResult(response.data);
            } catch (error) {
                console.error("Error while solving:", error.response ? error.response.data : error.message);
                console.log("Config do erro:", error.config);
            }
        }
    }
}
</script>

<style>
.solve_button {
    margin: 16px;
}

.fix_fluid {
    padding-left: 15px;
    padding-right: 15px;
}

.fluid-container.footer > *:last-child {
    padding: 4rem 2rem 2rem 2rem;
    margin-bottom: 0;
    color: #a1a1a1;
}
</style>
