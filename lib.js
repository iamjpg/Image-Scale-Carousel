var carousel_images = [
	"images/1.jpg",
	"http://farm4.static.flickr.com/3328/3575375564_79ab90dca8_b.jpg",
	"http://farm4.static.flickr.com/3163/2505235306_b456603cf3_b.jpg",
	"http://farm4.static.flickr.com/3235/2925947121_8b1f95c95b_b.jpg",
	"http://farm3.static.flickr.com/2769/4481220450_91b0aa9e99_b.jpg",
	"http://farm1.static.flickr.com/118/299048945_faba1a6a4b_b.jpg",
	"http://farm4.static.flickr.com/3089/2335224771_cec36d33a6_o.jpg" // Example of a local image
];

$(window).load(function() {
	$("#photo_container").isc(carousel_images);	
});

