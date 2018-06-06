<!DOCTYPE html>
<html lang="ru">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>jQuery Image Scale Carousel</title>
	<link rel="stylesheet" type="text/css" media="screen" charset="utf-8" href="css/isc.css">
	<link rel="stylesheet" type="text/css" media="screen" charset="utf-8" href="Third-party.Plugins/jQuery.isc/jQuery.isc.css">
</head>
<body>
	<h1>Поехали на карусели</h1>
	<h2>Let's go on carousel</h2>
	<br>
	<div id="photo_container"></div>
	<br>
	<p>This is an example of how "jQuery Image Scale Carousel" implemented using dynamic PHP.</p>
	
    <script type="text/javascript" charset="utf-8" src="Third-party.Plugins/jquery.min.js"></script>
	<!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> -->

	<!-- jQuery Image Scale Carousel CSS & JS -->
	<script type="text/javascript" charset="utf-8" src="Third-party.Plugins/jQuery.isc/jquery-image-scale-carousel.js"></script>
</body>
<script>
	// Build the array using PHP.  Reads images in the images directory.
	<?php
	// Open directory holding the images.
	if ($dir = opendir('pic/')) {
		// Array opener with carousel_images var
		echo 'var carousel_images = [';
		// Loop contents of the directory.
	    while (false !== ($file = readdir($dir))) {
			// Split all files into two variables: $fileName & $fileExt
			list($fileName, $fileExt) = split('[/.-]', $file);
			// Use above variables to insure you are only adding image files.  Important for ignoring hidden files.
			if (($fileExt == 'jpg') || ($fileExt == 'gif') || ($fileExt == 'png') || ($fileExt == 'jpeg')) {
				// List Images
				echo '"pic/' . $file . '",';
			}
	    }
		// Close Array
		echo ']';
		//Close directory
	    closedir($dir);
	}
	?>
	// Example without autoplay
	// $(window).load(function() {
	// 	$("#photo_container").isc({
	// 		imgArray: carousel_images
	// 	});	
	// });
	
	// Example with autoplay
	$(window).load(function() {
		$("#photo_container").isc({
			imgArray: carousel_images,
			imageWhiteSpace: 34,

			autoplay: true,
			autoplayRounded: true,
			animationPeriod: 3000,
			autoplayTimer: 4000, 
			videoStyle: true
		});	
	}); 
</script>
</html>
