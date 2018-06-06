var carousel_images = [
	"pic/1.jpg",
	"pic/2.jpg",
	"pic/4.jpg" // Example of a local images
	// "http://farm4.static.flickr.com/3328/3575375564_79ab90dca8_b.jpg",
	// "http://farm4.static.flickr.com/3163/2505235306_b456603cf3_b.jpg",
	// "http://farm4.static.flickr.com/3235/2925947121_8b1f95c95b_b.jpg",
	// "http://farm3.static.flickr.com/2769/4481220450_91b0aa9e99_b.jpg",
	// "http://farm1.static.flickr.com/118/299048945_faba1a6a4b_b.jpg",
	// "http://farm4.static.flickr.com/3089/2335224771_cec36d33a6_o.jpg" // Example of a shared images
];


// Example without autoplay
$(window).load(function() {
	$("#photo_container").isc({
		imgArray: carousel_images
	});	
});

// // Example with autoplay
// $(window).load(function() {

// 	var aSlider = $("#photo_container");

// 	aSlider.isc({
// 		imgArray: carousel_images,
// 		imageWhiteSpace: 34,

// 		autoplay: true,
// 		autoplayRounded: true,
// 		animationPeriod: 400,
// 		autoplayTimer: 1000, 
// 		videoStyle: true,
// 		autoresize: false
// 	});	
// }); 
