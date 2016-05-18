import http from './http';

export default {
	fetchMode: {
		QUERY: 'query',
		ITEM: 'item'
	},

	fetch: function (set, query, season, episode, mode) {
		mode = mode || this.fetchMode.QUERY;

		const episodeSelector = (season && episode) ? '&season=' + season +
			'&episode=' + episode : '';
		const url = 'query=' + encodeURIComponent(query) +
			'&parser=' + encodeURIComponent(set) +
			'&type=' + mode + episodeSelector;

		return new Promise((resolve, reject) => {
			http.get(url)
				.then((responseText) => {
					let result = JSON.parse(responseText);

                    console.log('Received result:', result);

					if (result)
						if (result.error)
							reject({
								message: result.error,
								responseText: responseText
							});
						else
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
