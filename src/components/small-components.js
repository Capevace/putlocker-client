import Vue from 'vue';
import { router } from '../router';

const resultTileComponent = {
	template: '#result-tile',
	props: ['result'],
	methods: {
		watch: function () {
			router.go({
				name: 'watch',
				params: {
					id: this.result.id
				}
			});
		}
	}
};

Vue.component('result-tile', resultTileComponent);


const loadingBoxComponent = {
	template: '#loading-box',
	props: ['loading']
};

Vue.component('loading-box', loadingBoxComponent);

export { resultTileComponent, loadingBoxComponent };
