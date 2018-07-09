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


// Example with autoplay
$(window).load(function() {

	var aSlider = $("#photo_container");

	// // Full browser-window: "photo_container" in "body"
	// w = window.innerWidth;
	// h = window.innerHeight;

	// Not full browser-window: "photo_container" in percent "div"
    var aParent = $("#ph"); 
    w = aParent.css('width');
    h = aParent.css('height');
	
	aSlider.css({"width":w+"px", "height":h+"px"});


	aSlider.isc({
		imgArray: carousel_images,
		imageWhiteSpace: 52,
		dynamic: true,

		autoplay: true,
		autoplayRounded: true,
		animationPeriod: 2500,
		autoplayTimer: 4000, 
		videoStyle: true,
		autoresize: true
	});	
}); 

$(window).resize(function(){
	// The resizing of the slider block will be automatically calculated.
	$(iscGlobal.selector).isc_rebuild_slider();
});
