<template>
    <div id="app">
        <NavBar />

        <ModalWarning ref="modal_warning" />

        <b-overlay :show="busy">
            <MainSolver
                ref="main_solver"
                :start-solving="startSolving"
                @update-lengths="updateAvailableLengths" 
            />
        </b-overlay>
        <footer class="fluid-container footer">
            <p>
                Frontend v{{ version }} + Backend {{ backend_version }}
                <br />
                Made with 🖤️ by <a href="https://www.linkedin.com/in/fernando-przybyszewski-345358150/" target="_blank">Fernando Przybyszewski Barros</a> 
            </p>
        </footer>
    </div>
</template>

<script>
import { Job } from "@/components/data/Job";
import { Result } from "@/components/data/Result";
import json_testresult from "./tests/data/testresult.json";
import NavBar from "@/components/NavBar";
import axios from "axios";
import ModalWarning from "@/components/ModalWarning";
import validators from "@/components/data/validators";
import MainSolver from "@/components/MainSolver";

let testresult = Object.assign(new Result(), json_testresult);

const title = "CutSolver";
const isTesting = process.env.JEST_WORKER_ID !== undefined;

export default {
    name: 'App',
    components: {
        MainSolver,
        ModalWarning,
        NavBar,
    },
    mixins: [validators],
    data: function () {
        return {
            title: title,
            version: process.env.VUE_APP_VERSION,
            backend_version: "?.?.?",
            job: new Job([], 0, [], []), // Inicializa job com arrays vazios
            busy: false,
            SOLVER_URL: process.env.VUE_APP_BACKEND_SOLVER_URL
        };
    },
    mounted: function () {
        this.setupEnv();
        this.getBackendVersion();
        if (!this.SOLVER_URL) {
            this.showWarning("Set environment variable 'VUE_APP_BACKEND_SOLVER_URL=http://your.example.com/'");
        }
    },
    methods: {
        setupEnv() {
            if (this.SOLVER_URL) return;

            this.SOLVER_URL = '$VUE_APP_BACKEND_SOLVER_URL';
            if (this.SOLVER_URL[0] === "$") {
                this.showWarning("Magic string substitution for backend url failed.");
                return;
            }
            if (!this.SOLVER_URL.endsWith("/")) this.SOLVER_URL += "/";
            console.log("Solver URL is now " + '$VUE_APP_BACKEND_SOLVER_URL');
        },
        getBackendVersion() {
            if (isTesting) return;

            console.log("Requesting version from " + this.SOLVER_URL + "version");
            axios.get(this.SOLVER_URL + "version")
                .then((reply) => {
                    this.backend_version = reply.data;
                    console.log("backend version is " + this.backend_version);
                }).catch(error => {
                    console.log(error);
                    if (error.response) {
                        this.showWarning(error.response.data);
                    } else if (error.request) {
                        this.showWarning("Server is offline");
                    }
                });
        },
        showWarning(text) {
            console.warn(text);
            this.$refs["modal_warning"].text = text;
            this.$bvModal.show("modal-warning");
        },
        startSolving() {
            this.job = this.$refs['main_solver'].$refs["input"].job;

            this.busy = true;

            if (isTesting) {
                this.callMockSolver(this.job);
            } else {
                this.callRemoteSolver(this.job);
            }
        },
        handleReply(reply) {
            if (this.validResult(reply)) {
                this.$refs['main_solver'].$refs['output'].setResult(reply);
            } else {
                this.$refs['main_solver'].$refs['output'].setWarning(reply);
            }

            this.busy = false;
        },
        callMockSolver(job) {
            console.log("faking output for " + job);
            let reply = (Math.random() > 0.2) ? testresult : "fake wrong answer";
            console.assert(reply !== null);

            setTimeout(() => {
                this.handleReply(reply);
            }, 2000);
        },
        callRemoteSolver(job) {
            console.log("Requesting solve from " + this.SOLVER_URL + "solve");

            axios.post(this.SOLVER_URL + "solve", job)
                .then((reply) => {
                    this.handleReply(Object.assign(new Result(), reply.data));
                }).catch(error => {
                    console.log(error);
                    if (error.response) {
                        this.handleReply(error.response.data);
                    } else if (error.request) {
                        this.handleReply("Server is offline");
                    }
                });
        },
        updateAvailableLengths(lengths) {
            this.job.available_lengths = lengths; // Atualiza os tamanhos disponíveis no job
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.fluid-container.footer a {
    color: #005c93;
}

.fluid-container.footer > *:last-child {
    padding: 4rem 2rem 2rem 2rem;
    margin-bottom: 0;
    color: #a1a1a1;
}
</style>
