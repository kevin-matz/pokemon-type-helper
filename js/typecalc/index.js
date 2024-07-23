import { createApp } from "vue";
import 'vuetify/styles';
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Component from "../../components/typecalc/IndexComp.vue";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    },
})

const app = createApp(Component);
app.use(vuetify);
app.mount("#app");
