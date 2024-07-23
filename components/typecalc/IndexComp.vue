<template>
    <v-app>
        <v-container fluid>
            <v-row>
                <v-col id="content" cols="12">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field height="auto" label="Search Pokémon" v-model="search" clearable persistent-clear hide-details="true" prepend-icon="mdi-magnify" @input="searchInput" @click:clear="searchInput"></v-text-field>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <div v-if="searchResults.length > 0" class="mt-3"></div>
                                    <!-- pa-10 if screen >= md -->
                                    <div :class="['search-results-grid', {'pl-10': $vuetify.display.mdAndUp}]">
                                        <template v-for="result in searchResults">
                                            <img :src="result['sprite_url']" alt="Sprite" :class="['sprite', {'small-sprite': $vuetify.display.smAndDown}]" style="grid-column: 1 / 2">
                                            <p :class="{'small-text': $vuetify.display.smAndDown}" style="grid-column: 2 / 3">{{ result["english_name"] }}</p>
                                            <img :src="'/assets/typecalc/types/en/' + result['type1'] + '.png'" :alt="result['type1']" style="grid-column: 3 / 4" width="85">
                                            <img v-if="result['type2'] !== 'none'" :src="'/assets/typecalc/types/en/' + result['type2'] + '.png'" :alt="result['type2']" style="grid-column: 4 / 5" width="85">
                                            <div v-else></div>
                                            <v-btn variant="tonal" icon="mdi-arrow-right" size="x-small" @click="searchResultClicked(result)" style="grid-column: 5 / 6"></v-btn>
                                        </template>
                                    </div>
<!--                                    <div v-if="searchResults.length > 0" class="mb-3"></div>-->
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select label="Generation" v-model="generation" :items="generations" hide-details="true" prepend-icon="mdi-nintendo-game-boy" @update:modelValue="generationChanged"></v-select>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-4 mb-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-row>
                                <v-col>
                                    <h2>First type</h2>
                                    <v-radio-group v-model="primaryType" inline>
                                        <v-radio v-for="type in types" :value="type" class="mr-2 mb-1" @input="recalculate" :disabled="shouldRadioBeDisabled(1, type)">
                                            <template v-slot:label>
                                                <img :src="'/assets/typecalc/types/en/' + type + '.png'" :alt="type" height="20" class="type-img">
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col id="secondary-type-col">
                                    <h2>Second type</h2>
                                    <v-radio-group v-model="secondaryType" inline>
                                        <v-radio v-for="type in types" :value="type" class="mr-2 mb-1" @input="recalculate" :disabled="shouldRadioBeDisabled(2, type)">
                                            <template v-slot:label>
                                                <img :src="'/assets/typecalc/types/en/' + type + '.png'" :alt="type" height="20" class="type-img">
                                            </template>
                                        </v-radio>
                                        <v-radio label="None" :value="null" class="mr-2 mb-1" @input="recalculate"></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col id="effectivenesses" cols="12" md="6">
                            <div v-for="effectiveness in [4, 2, 1, 0.5, 0.25, 0]">
                                <v-col v-if="damageValues[effectiveness].length > 0" class="pa-0 mb-5">
                                    <h2>{{ damageFactorText[effectiveness] }}× damage from</h2>
                                    <v-row class="ma-0">
                                        <img v-for="type in damageValues[effectiveness]" :src="'/assets/typecalc/types/en/' + type + '.png'" :alt="type" height="20" class="mr-2 mb-1 mt-1">
                                    </v-row>
                                </v-col>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import { Types, getDamage } from "@/typecalc/types";

export default {
    name: "IndexComp",
    data: () => ({
        search: "",
        searchResults: [],
        originalPokemonData: null,
        pokemonData: null,
        typeChangeData: null,
        generationData: null,
        generation: 9,
        generations: [
            { title: "Gen 1 (Red, Blue, Yellow)", value: 1 },
            { title: "Gen 2 (Gold, Silver, Crystal)", value: 2 },
            { title: "Gen 3 (Ruby, Sapphire, Emerald, Firered, Leafgreen)", value: 3 },
            { title: "Gen 4 (Diamond, Pearl, Platinum)", value: 4 },
            { title: "Gen 5 (Black, White, Black 2, White 2)", value: 5 },
            { title: "Gen 6 (X, Y)", value: 6 },
            { title: "Gen 7 (Sun, Moon, Ultra Sun, Ultra Moon)", value: 7 },
            { title: "Gen 8 (Sword, Shield)", value: 8 },
            { title: "Gen 9 (Scarlet, Violet)", value: 9 }
        ],
        types: Types,
        primaryType: "normal",
        secondaryType: null,
        damageValues: {
            4: [],
            2: [],
            1: [],
            0.5: [],
            0.25: [],
            0: []
        },
        damageFactorText: {
            4: "4",
            2: "2",
            1: "1",
            0.5: "½",
            0.25: "¼",
            0: "0"
        }
    }),
    methods: {
        recalculate() {
            for (const damageFactor of Object.keys(this.damageValues)) {
                this.damageValues[damageFactor] = [];
            }

            const types = Object.keys(Types);
            if (this.generation === 1) {
                types.splice(types.indexOf("dark"), 1);
                types.splice(types.indexOf("steel"), 1);
                types.splice(types.indexOf("fairy"), 1);
            } else if (this.generation < 6) {
                types.splice(types.indexOf("fairy"), 1);
            }

            for (const type of types) {
                const dmg = getDamage(type, this.primaryType, this.secondaryType, this.generation);
                this.damageValues[dmg].push(type.toString());
            }
        },
        generationChanged() {
            this.updatePokemonData();

            if (this.generation === 1) {
                if (["dark", "steel", "fairy"].includes(this.primaryType)) {
                    this.primaryType = "normal";
                    if (this.secondaryType === "normal") {
                        this.secondaryType = null;
                    }
                }
                if (["dark", "steel", "fairy"].includes(this.secondaryType)) {
                    this.secondaryType = null;
                }
            } else if (this.generation < 6) {
                if (this.primaryType === "fairy") {
                    this.primaryType = "normal";
                    if (this.secondaryType === "normal") {
                        this.secondaryType = null;
                    }
                }
                if (this.secondaryType === "fairy") {
                    this.secondaryType = null;
                }
            }

            this.recalculate();
        },
        shouldRadioBeDisabled(slot, type) {
            if (this.generation === 1 && ["dark", "steel", "fairy"].includes(type))
                return true;

            if (this.generation < 6 && type === "fairy")
                return true;

            if (slot === 1) {
                if (this.secondaryType === type)
                    return true;
            } else {
                if (this.primaryType === type)
                    return true;
            }

            return false;
        },
        loadPokemonData() {
            fetch('/assets/typecalc/data.json')
                .then(resp => resp.json())
                .then(json => {
                    this.originalPokemonData = json;
                    // Deep clone array using JSON trick
                    this.pokemonData = JSON.parse(JSON.stringify(this.originalPokemonData));
                });
            fetch('/assets/typecalc/type_changes.json')
                .then(resp => resp.json())
                .then(json => {
                    this.typeChangeData = json;
                });
            fetch('/assets/typecalc/generations.json')
                .then(resp => resp.json())
                .then(json => {
                    this.generationData = json;
                });
        },
        updatePokemonData() {
            // Deep clone array using json trick
            this.pokemonData = JSON.parse(JSON.stringify(this.originalPokemonData));

            const isBetween = (number, min, max) => {
                return number >= min && number <= max;
            } ;

            let applicableEntries = [];
            for (const entry of this.typeChangeData) {
                const fromGen = entry["from_gen"];
                const untilGen = entry["until_gen"];

                if (!isBetween(this.generation, fromGen, untilGen))
                    continue;

                applicableEntries.push(entry);
            }

            let lastId = 0;
            for (const generationEntry of this.generationData) {
                if (generationEntry["generation"] !== this.generation)
                    continue;

                lastId = generationEntry["last_id"];
            }

            let i = this.pokemonData.length;
            while (i--) {
                let data = this.pokemonData[i];
                const id = data["id"];

                if (id > lastId) {
                    this.pokemonData.splice(i, 1);
                    continue;
                }

                for (const applicableEntry of applicableEntries) {
                    if (id !== applicableEntry["id"])
                        continue;

                    data["type1"] = applicableEntry["type1"];
                    data["type2"] = applicableEntry["type2"];
                }
            }

            this.searchInput();
        },
        searchInput() {
            this.searchResults = [];
            const searchText = this.search.toLowerCase();
            if (searchText.length < 3) {
                return;
            }

            for (const data of this.pokemonData) {
                let englishName = data["english_name"].toLowerCase();
                let germanName = data["german_name"].toLowerCase();

                if (!(englishName.startsWith(searchText) || germanName.startsWith(searchText)))
                    continue;

                this.searchResults.push(data);
            }

            if (this.searchResults.length === 1) {
                const data = this.searchResults[0];
                this.primaryType = data["type1"];
                this.secondaryType = data["type2"] === "none" ? null : data["type2"];
                this.recalculate();
            }
        },
        searchResultClicked(result) {
            this.primaryType = result["type1"];
            this.secondaryType = result["type2"] === "none" ? null : result["type2"];
            this.recalculate();
            const eff = document.getElementById("effectivenesses");
            // Trick to make scrolling work on mobile while keyboard is still visible
            setTimeout(() => {
                eff.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 100);
        }
    },
    mounted() {
        this.loadPokemonData();
        this.recalculate();
    }
}
</script>

<style>
/* Set all type-img containing labels to full opacity, the type images look weird otherwise */
label:has(.type-img) {
    opacity: 1.0;
}

.search-results-grid {
    display: grid;
    grid-auto-rows: 35px;
    grid-template-columns: 35px repeat(4, fit-content(100%));
    grid-row-gap: 4px;
    grid-column-gap: 12px;
    align-items: center;
}

.sprite {
    max-width: 35px;
    max-height: 35px;
    justify-self: center;
}

/* mdAndUp */
@media (min-width: 960px) {
    .search-results-grid {
        padding-left: 40px;
    }
}

/* smAndDown */
@media (max-width: 959px) {
    .search-results-grid {
        grid-column-gap: 10px;
    }

    .search-results-grid > .sprite {
        max-width: 25px;
        max-height: 25px;
    }

    .search-results-grid > img:not(.sprite) {
        max-width: 75px;
    }
}

.max-w-85 {
    max-width: 85px;
}

.max-h-40 {
    max-height: 40px;
}
</style>
