import Vue from 'vue';
import { router } from '../router';

const searchPageComponent = Vue.extend({
    template: '#search-page',
    data: function () {
        return {
            query: ''
        };
    },
    methods: {
        search: function () {
            router.go({
                name: 'search',
                params: {
                    query: this.query
                }
            });
        }
    }
});

Vue.component('search-page', searchPageComponent);

export default searchPageComponent;
