<template>
    <div id="solver-output" class="solver_output">
        <h2>Output</h2>

        <b-overlay
            :show="warning !== null || result === null"
            opacity="0.95"
        >
            <template #overlay>
                <div v-if="warning !== null" class="text-center">
                    Invalid result: {{ warning }}
                </div>
                <div v-else-if="result === null" class="text-center">
                    Hit [Solve] to get results.
                </div>
            </template>

            <div v-if="validResult(result)">
                <p>Solved using {{ result.solver_type }}. Calculation took {{ usToMs(result.time_us) }}ms.</p>

                <LengthsList
                    :cut-width="result.job.cut_width"
                    :result="result.layout"  
                    :available-lengths="result.job.stocks"  
                />
            </div>
            <div v-else>
                <p>Solved using pure magic. Calculation took forever.</p>

                <LengthsList
                    :cut-width="testresult.job.cut_width"
                    :result="result"  
                    :available-lengths="testresult.job.stocks" 
                />
            </div>
        </b-overlay>
    </div>
</template>

<script>
import validators from "@/components/data/validators";
import LengthsList from "@/components/LengthsList";

import json_testresult from "../tests/data/testresult.json";
import { Result } from "@/components/data/Result";
let testresult = Object.assign(new Result(), json_testresult);

export default {
    name: "SolverOutput",
    components: { LengthsList },
    mixins: [validators],
    data() {
        return {
            result: null,
            warning: null,
            testresult: testresult
        };
    },
    methods: {
        reset() {
            this.result = null;
            this.warning = null;
        },
        setResult(result) {
            console.log("Received result:", result);
            console.assert(this.validResult(result), "Invalid result structure.");
            this.result = result;
            this.warning = null;
        },
        setWarning(text) {
            this.warning = text;
        },
        usToMs(duration) {
            return (duration / 1000).toFixed(1);
        },
        validResult(result) {
            return(
                result &&
                result.job &&
                result.job.cut_width !== undefined &&
                Array.isArray(result.layout) &&
                result.layout.length > 0
            );
        }
    }
};
</script>

<style scoped>
.solver_output {
    padding: 8px;
}
</style>
