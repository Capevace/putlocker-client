export default {
	set: function (id, season, episode) {
		localStorage.setItem('item-' + id, JSON.stringify({
			season: parseInt(season),
			episode: parseInt(episode)
		}));
	},
	get: function (id) {
		const item = localStorage.getItem('item-' + id);

		if (item)
			return JSON.parse(item);

		return {
			season: 1,
			episode: 1
		};
	}
};
