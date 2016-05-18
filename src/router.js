import Vue from 'vue';
import VueRouter from 'vue-router';

/* Vue components */
import searchPageComponent from './components/search-page';
import resultPageComponent from './components/result-page';
import resultsPageComponent from './components/results-page';
import { resultTileComponent, loadingBoxComponent } from './components/small-components';

Vue.use(VueRouter);

const router = new VueRouter({});
const app = Vue.extend({});

router.map({
    '/': {
        name: 'home',
        component: searchPageComponent
    },
    '/search/:query': {
        name: 'search',
        component: resultsPageComponent
    },
    '/watch/:id': {
        name: 'watch',
        component: resultPageComponent
    },
    '/watch/:id/:season/:episode': {
        name: 'watchSeries',
        component: resultPageComponent
    }
});

export { router, app };
