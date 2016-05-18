import _ from './utilities';
_.polyfills();

/* Vue */
import Vue from 'vue';
import { router, app } from './router';

_.ready(() => {
	Vue.debug = true;

    router.start(app, 'body');
});
