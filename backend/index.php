<?php

require "vendor/autoload.php";
require_once 'parsers.php';
use PHPHtmlParser\Dom;

header('Content-type: text/json');
$query = $_GET['query'];
$parser_type = $_GET['parser'];
$req_type = $_GET['type'];
$pretty_print = !is_null($_GET['pretty']) && $_GET['pretty'] ? JSON_PRETTY_PRINT : 0;

if (is_null($query) || is_null($parser_type) || is_null($req_type))
exit;



$parser = DataParser;

switch ($parser_type) {
	case 'putlocker':
		$parser = PutlockerParser;
		break;

	default:
		break;
}


switch ($req_type) {
	case 'query':
		echo json_encode($parser::parse_query($query), $pretty_print);
		break;
	case 'item':
		echo json_encode($parser::parse_item($query, $url), $pretty_print);
		break;
}


function request ($url) {
	$options = array(
		CURLOPT_RETURNTRANSFER => true,     // return web page
		CURLOPT_HEADER         => false,    // don't return headers
		CURLOPT_FOLLOWLOCATION => true,     // follow redirects
		CURLOPT_ENCODING       => "",       // handle all encodings
		CURLOPT_USERAGENT      => "putlocker better ui crawler", // who am i
		CURLOPT_AUTOREFERER    => true,     // set referer on redirect
		CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
		CURLOPT_TIMEOUT        => 120,      // timeout on response
		CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
	);

	$ch = curl_init( $url );
	curl_setopt_array( $ch, $options );
	$raw = curl_exec( $ch );
	curl_close( $ch );

	return $raw;
}
?>
