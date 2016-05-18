<?php

use PHPHtmlParser\Dom;

class DataParser {

	public static function parse_query ($query) {
        // SHOULD RETURN
        // [
        //      {
        //          name: string,
        //          id: int,
        //          cover: string
        //      }
        // ]
		return json_decode('[]');
	}

	public static function parse_item ($query, $url) {
        // SHOULD RETURN:
		// {
		// 		name: string,
		// 		isSeries: boolean,
		// 		seriesData: {
		// 			seasons: [
		// 				[ // episode
		// 					name: string
		// 				]
		// 			]
		// 		},
		// 		watchData: {
		// 			meta: {},
		// 			playerCode: string
		// 		}
		// }
		//

		return json_decode('{}');
	}

	public static function url_dom ($url) {
		$dom = new Dom;
		$dom->setOptions([
			'removeScripts' => false
		]);
		$dom->loadFromUrl($url);

		return $dom;
	}
}

class PutlockerParser extends DataParser {
	public static function parse_query ($query) {
		$dom = self::url_dom('http://putlocker.is/search/search.php?q=' . $query);

		$results = [];
		$rows = $dom->find('div.content-box')->find('table')[1]->find('tr');

		foreach ($rows as $row) {
			foreach ($row->find('td') as $result) {
				$sublink = $result->find('div a');
				$id;
				preg_match('/(?<=putlocker.is\/watch-)(.*)(?=-online)/', $sublink->getAttribute('href'), $id);

				array_push($results, [
					'name' => $sublink->getAttribute('title'),
					'test' => $sublink->getAttribute('href'),
					'id' => (is_array($id)) ? $id[0] : $id,
					'cover' => $result->find('img')->getAttribute('src'),
				]);
			}
		}

		return $results;
	}

	public static function parse_item ($query, $url) {
		$is_series = strpos($query, 'tvshow') !== false;
		$dom = self::url_dom('http://putlocker.is/watch-' . $query . '-online-free-putlocker.html');

		if (count($dom) <= 0 || strrpos($dom->outerHTML, 'This movie doesn\'t exist! :(') !== false) {
			return [
				'error' => 'Movie or series not found.'
			];
		}

		if ($is_series) {
			// Parse series/episodes first
			$season_str = (isset($_GET['season'])) ? intval($_GET['season']) : 1;
			$episode_str = (isset($_GET['episode'])) ? intval($_GET['episode']) : 1;
			$season_index = $season_str - 1;
			$episode_index = $episode_str - 1;

			$episode_dom = self::url_dom('http://putlocker.is/watch-' . $query . '-season-' . $season_str . '-episode-' . $episode_str . '-online-free-putlocker.html');

			$seasons = self::parse_seasons($dom->find('div.content-box table.table'));

			if (count($seasons) <= $season_index || count($seasons[$season_index]) <= $episode_index) {
				return [
					'error' => 'Episode or season not found.'
				];
			}

			return [
				'name' => self::parse_title(self::parse_meta($dom->find('div.content-box'))),
				'isSeries' => true,
				'seriesData' => [
					'current' => [
						'seasonIndex' => $season_index,
						'episodeIndex' => $episode_index,
						'seasonIndexReadable' => $season_str,
						'episodeIndexReadable' => $episode_str
					],
					'seasons' => $seasons
				],
				'watchData' => [
					'meta' => self::parse_meta($episode_dom->find('div.content-box')),
					'playerCode' => self::parse_player_code($episode_dom)
				]
			];
		} else {
			// Parse movie
			$meta_data = [];
			$content = $dom->find('div.content-box');
			$metas = self::parse_meta($content);
			$name = self::parse_title($metas);
			$code = self::parse_player_code($dom);

			return [
				'name' => $name,
				'isSeries' => false,
				'watchData' => [
					'meta' => $metas,
					'playerCode' => $code
				]
			];
		}
	}

	private static function parse_meta ($content) {
		$metas = $content->find('table.table2 td.summary[width=100%] table.table2 tr');
		foreach ($metas as $meta) {
			$line = $meta->find('td', 1);

			$title_unfiltered = $line->find('strong')->innerHTML;
			preg_match('/.+?(?=:)/', $title_unfiltered, $title); // Remove ':' character from string

			$content = '';
			$links = $line->find('a');
			if (count($links) > 0) {
				$index = 0;
				foreach ($links as $link) {
					if ($index++ > 0)
						$content .= ', ';

					$content .= $link->innerHTML;
				}
			} else {
				preg_match('/(?<=<\/strong>\s).+/', $line->innerHTML, $content_array);
				$content = $content_array[0];
			}

			$meta_data[$title[0]] = $content;
		}
		return $meta_data;
	}

	private static function parse_title ($metas) {
		return explode(', ', $metas['Release'])[1];
	}

	private static function parse_player_code ($content) {
		$s_code = $content->find('div.video script', 0)->innerHTML;
		preg_match('/(?<=doit\(\').+(?=\')/', $s_code, $code);

		return $code[0];
	}

	private static function parse_seasons ($seasons) {
		$seasons_arr = [];
		foreach ($seasons as $season) {
			$season_arr = [];
			$episodes = $season->find('tr');

			foreach ($episodes as $episode) {
				preg_match('/(?<=-\&nbsp;\&nbsp; ).+/', $episode->find('td', 1)->innerHTML, $name);

				if (!is_null($name[0]))
					array_push($season_arr, [
						'name' => $name[0]
					]);
			}

			if (count($season_arr) > 0)
				array_push($seasons_arr, $season_arr);
		}

		return $seasons_arr;
	}
}

?>
