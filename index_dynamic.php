<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>jQuery Image Scale Carousel</title>
	<!-- Google Hosted jQuery -->
	<script src="http://www.google.com/jsapi"></script>
	<script>google.load("jquery", "1");</script>
	<!-- jQuery Image Scale Carousel CSS & JS -->
	<link rel="stylesheet" href="lib.css" type="text/css" media="screen" charset="utf-8">
	<link rel="stylesheet" href="jQuery.isc/jQuery.isc.css" type="text/css" media="screen" charset="utf-8">
	<script src="jQuery.isc/jquery-image-scale-carousel.js" type="text/javascript" charset="utf-8"></script>
	<script>
		// Build the array using PHP.  Reads images in the images directory.
		<?php
		// Open directory holding the images.
		if ($dir = opendir('images/')) {
			// Array opener with carousel_images var
			echo 'var carousel_images = [';
			// Loop contents of the directory.
		    while (false !== ($file = readdir($dir))) {
				// Split all files into two variables: $fileName & $fileExt
				list($fileName, $fileExt) = split('[/.-]', $file);
				// Use above variables to insure you are only adding image files.  Important for ignoring hidden files.
				if (($fileExt == 'jpg') || ($fileExt == 'gif') || ($fileExt == 'png') || ($fileExt == 'jpeg')) {
					// List Images
					echo '"images/' . $file . '",';
				}
		    }
			// Close Array
			echo ']';
			//Close directory
		    closedir($dir);
		}
		?>
		// Example without autoplay
		$(window).load(function() {
			$("#photo_container").isc({
				imgArray: carousel_images
			});	
		});
		
		// Example with autoplay
		/* $(window).load(function() {
			$("#photo_container").isc({
				imgArray: carousel_images,
				autoplay: true,
				autoplayTimer: 5000 // 5 seconds.
			});	
		}); */
	</script>
</head>
<body>
	<h1>jQuery Image Scale Carousel</h1>
	<div id="photo_container"></div>
	<p>This is an example of how it's implemented using dynamic PHP.</p>
</body>
</html>
