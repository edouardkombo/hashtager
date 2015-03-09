<?php       
    // Get class for Instagram
    // More examples here: https://github.com/cosenary/Instagram-PHP-API
    require_once 'lib/instagram.class.php';

    // Initialize class with client_id
    // Register at http://instagram.com/developer/ and replace client_id with your own
    $instagram = new Instagram(array(
      'apiKey'      => '6ffb1036a193401ca901270833b0b905',
      'apiSecret'   => 'c6c9139856ab474ba1c8d74fe97b7b10',
      'apiCallback' => 'http://localhost'
    ));

    // Set keyword for #hashtag
    $tag = 'kisschoice';

    // Get latest photos according to #hashtag keyword
    $media = $instagram->getTagMedia($tag);

    // Set number of photos to show
    $limit = 5;

    // Set height and width for photos
    $size = '100';

    echo json_encode($media->data);