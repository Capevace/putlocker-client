import Vue from 'vue';

var result = Vue.extend({
    template: '#result-page',
    data: function () {
        return {
            result: {}
        };
    },
    computed: {
        title: function () {
            if (!this.result.watchData)
                return '';

            const season = this.result.seriesData;
            return season.seasons[season.current.seasonIndex][season.current.episodeIndex].name;
        },

        videoSource: function () {
            if (!this.result.watchData)
                return '';

            return videoSource.get('putlocker', this.result.watchData.playerCode);
        }
    },
    route: {
        data: function (transition) {
            const id = transition.to.params.id;
            let season = transition.to.params.season;
            let episode = transition.to.params.episode;

            if (id.includes('tvshow')) { // If is series
                if (season && episode) {
                    videoCache.set(
                        id,
                        season,
                        episode
                    );
                } else {
                    const item = videoCache.get(id);
                    season = item.season;
                    episode = item.episode;
                }
            }

            return dataService.fetch(
                'putlocker',
                id,
                season,
                episode,
                dataService.fetchMode.ITEM
            ).then((result) => {
                return {
                    result: result
                };
            }).catch(error => {
                return {
                    result: {
                        error: error
                    }
                };
            });
        }
    },
    methods: {
        changeEpisode: function (forward) {
            if (!this.result.isSeries)
                return;

            const value = (forward) ? 1 : -1;
            let season = parseInt(this.result.seriesData.current.seasonIndexReadable);
            let episode = parseInt(this.result.seriesData.current.episodeIndexReadable);
            const series = this.result.seriesData;

            // alert(season + ", " + episode + ', ' + JSON.stringify(series, null, 4));
            console.warn(season, episode);

            // complex code, maybe redo someday
            if (forward) {
                // Go one episode forward

                if (episode >= series.seasons[season - 1].length) {
                    // last episode, go up season
                    if (season >= series.seasons.length) {
                        // last season
                        season = series.seasons.length;
                        episode = series.seasons[season - 1].length;
                    } else {
                        // some season
                        season++;
                        episode = 1;
                    }
                } else {
                    // some epidode, don't care
                    episode++;
                }
            } else {
                // Go one episode back

                if (episode <= 1) {
                    // first episode, go back season

                    if (season <= 1) {
                        // We're in first season
                        season = 1;
                        episode = 1;
                    } else {
                        // We're in any other season, don't care
                        season--; // Go back season
                        episode = series.seasons[season - 1].length; // Last episode of season
                    }
                } else {
                    // some episode, don't care
                    episode--;
                }
            }

            this.goEpisode(season, episode);
        },

        goEpisode: function (season, episode) {
            router.go({
                name: 'watchSeries',
                params: {
                    id: this.$route.params.id,
                    season: season,
                    episode: episode
                }
            });
        }
    }
});

export default result;
