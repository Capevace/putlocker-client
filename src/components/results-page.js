import Vue from 'vue';
import dataService from '../data-service';
import { router } from '../router';

const resultsPageComponent = Vue.extend({
    template: '#results-page',
    data: function () {
        return {
            query: '',
            results: []
        };
    },
    route: {
        data: function (transition) {
            this.query = transition.to.params.query;

            return dataService
                .fetch('putlocker', transition.to.params.query, dataService.fetchMode.QUERY)
                .then((results) => {
                    return {
                        results: results
                    };
                });
        }
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

Vue.component('results-page', resultsPageComponent);

export default resultsPageComponent;
