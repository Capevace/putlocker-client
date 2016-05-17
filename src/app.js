document.addEventListener('DOMContentLoaded', function() {
    Vue.use(VueRouter);
    Vue.debug = true;

    var router = new VueRouter({

	});
    var App = Vue.extend({});

    var Search = Vue.extend({
        template: '#search-page',
        data: function() {
            return {
                query: 'dick'
            };
        },
        methods: {
            search: function() {
                router.go({
                    name: 'search',
                    params: {
                        query: this.query
                    }
                });
            }
        }
    });

    var Results = Vue.extend({
        template: '#results-page',
        data: function() {
            return {
                query: 'dick',
                results: []
            };
        },
        route: {
            data: function(transition) {
                return dataService
                    .fetch('putlocker', transition.to.params.query, dataService.fetchMode.QUERY)
	                    .then((results) => {
	                        return {
	                            results: results
	                        };
	                    });
            }
        }
    });

    var Result = Vue.extend({
        template: '#result-page',
		data: function() {
            return {
                result: {}
            };
        },
        route: {
            data: function(transition) {
                return dataService
                    .fetch('putlocker', transition.to.params.id, dataService.fetchMode.ITEM)
	                    .then((result) => {
	                        return {
	                            result: result
	                        };
	                    });
            }
        }
    });

    Vue.component('search-page', Search);
    Vue.component('results-page', Results);
    Vue.component('result-page', Result);

    Vue.component('result-tile', {
        template: '#result-tile',
        props: ['result'],
        methods: {
            watch: function() {
                router.go({
                    name: 'watch',
                    params: {
                        id: this.result.id
                    }
                });
            }
        }
    })

    router.map({
        '/': {
            name: 'home',
            component: Search
        },
        '/search/:query': {
            name: 'search',
            component: Results
        },
        '/watch/:id': {
            name: 'watch',
            component: Result
        }
    });

    router.start(App, 'body')
});

String.prototype.dashToSpace = function() {
    return this.replace(/-/g, ' ');
};

String.prototype.spaceToDash = function() {
    return this.replace(/\s/g, '-');
};

String.prototype.toHtmlObject = function() {
	let element = document.createElement('html');
	element.innerHTML = this;

	return element;
};


var dataService = {
    fetchMode: {
        QUERY: 'query',
        ITEM: 'item'
    },

    fetch: function(set, query, mode) {
        mode = mode || this.fetchMode.QUERY;

        return new Promise((resolve, reject) => {
            http.get('query=' + encodeURIComponent(query) +'&parser=' + encodeURIComponent(set) + '&type=' + mode)
                .then((responseText) => {
					console.log(responseText);

                    let result = JSON.parse(responseText);
                    if (result)
                        resolve(result);
                    else {
                        reject({
                            message: 'Parsing data with set in mode ' + mode + ' failed. See console for details.',
                            responseText: responseText
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

var http = {
    get: function(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', 'fetch.php?' + url, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    resolve(request.responseText);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText,
                        responseText: request.responseText,
                        message: 'Request failed: ' + request.status
                    });
                }
            };

            request.onerror = function() {
                reject({
                    message: 'Client connection error'
                });
            };

            request.send();
        });
    }
};
