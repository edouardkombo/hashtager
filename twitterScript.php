<?php
require_once 'lib/twitteroauth.php';
 
define('CONSUMER_KEY', 'k6ELVb9HWVPBDWblS1ZLngSJo');
define('CONSUMER_SECRET', 'rZ7UmOKuGZpGrDFBxrxa0f5I2hbXcqgtTMgDkD5EIinn1mOXPN');
define('ACCESS_TOKEN', '2163091566-uHfai4zdGTeQkG5tlQfIutQovWKsEPtKxJZ4mKS');
define('ACCESS_TOKEN_SECRET', 'ZYxpOKZrWm7j9suQJJpQlJ8YdFGrUt51GbdJreVCG4n6R');
 
$toa = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET);

$query = array(
  "q" => "#bluemoon27"
);

$results = $toa->get('search/tweets', $query);
 
echo json_encode($results->statuses);

/*
foreach ($results->statuses as $result) {
  echo $result->user->screen_name . ": " . $result->text . "\n";
}*/