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
	<script type="text/javascript" charset="utf-8" src="Third-party.Plugins/jQuery.isc/jquery-image-scale-carousel.min.js"></script>
</body>
<script type="text/javascript">
	<?php
	// Build the array using PHP.  Reads images in the images directory.
		$ini_scream = ini_get('error_reporting');
		error_reporting(0);

		// Array opener with carousel_images var
		echo 'var carousel_images = [';
		// Explore contents of the directory.
		$dir  = 'pic/';
		// Open directory holding the images.
		if (is_dir($dir)) {
			if ($dh = @opendir($dir)) {
				// Which type of images
				$exts  = array('jpg','jpeg','gif','png');
				$resFiles  = array();
				$files = scandir($dir,0);
				foreach ($files as $fileName){
					$pInfo = pathinfo($fileName);
					$fileExt = $pInfo['extension'];
					if (in_array($fileExt, $exts)) {
						array_push($resFiles, '"'.$dir.$fileName.'"'); 
					}
				}
				// Fill list Images
				echo implode(",", $resFiles);
				//Close directory
			    closedir($dir);
			} 
		}
		// Close Array
		echo ']';
		
		ini_set('error_reporting', $ini_scream);
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
			dynamic: true,

			autoplay: true,
			autoplayRounded: true,
			animationPeriod: 3000,
			autoplayTimer: 4000, 
			videoStyle: true
		});	
	}); 
</script>
</html>
