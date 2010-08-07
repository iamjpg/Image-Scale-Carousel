/******************************************************
	* jQuery plug-in
	* jQuery Image Scale Carousel
	* Developed by J.P. Given (http://johnpatrickgiven.com)
	* Useage: anyone so long as credit is left alone
******************************************************/
var cObj;
var x = 0; // Object X
var y = 0; // Object Y
var c = 0; // Object center point
var ct = 0; // Object center point from top
var mX = 0; // Mouse X
var mY = 0;  // Mouse Y
var imgCount = 1;
var current = 0;

$(window).resize(function() {
	x = cObj.offset().left;
	y = cObj.offset().top;
	c = x + (cObj.width() / 2);
	ct = y + (cObj.height() / 2);
	posCount();
});


(function($) {
	$.fn.isc = function(images) {
		
		cObj = $(this);
		current = 0;
		imgCount = 1;
		
		// set up the CSS
		cObj.css("overflow","hidden");
		//cObj.css("overflow-x","hidden");
		
		//Append the images
		cObj.append('<div class="internal_swipe_container"></div>');	
		
		for (i=0;i<images.length;i++) {
			$(".internal_swipe_container").append('<div class="jq_swipe_image" id="swipe_div_' + i + '"><img id="swipe_img_' + i + '" src="' + images[i] + '" border="0"></div>');
			
			$("#internal_swipe_container").css({
				width: cObj.width(),
				height: cObj.height(),
				overflow: "hidden"
			});
			
			// Containing div height for loader
			$(".jq_swipe_image").css({
				"height":cObj.height() + "px",
				"background-color":"#FFF"
			});
			
			// Image visibility hidden until loaded
			$('#swipe_img_' + i).css("visibility","hidden");
			
			$('#swipe_img_' + i).load(function() {
				// Lose the background loader image
				$(this).parent('div').css({
					"background-image":"url()",
					"background-color":"inherit"
				});
				
				// Show image
				$(this).css({
					"visibility":"visible",
					"position":"relative"
				});
				
				// Resize the img object to the proper ratio of the container.
				var iw = $(this).width();
				var ih = $(this).height();
				if (cObj.width() > cObj.height()) {
					//alert($(this).attr("id") + " width: " + iw + "|" + ih);
					if (iw > ih) {
						var fRatio = iw/ih;
						$(this).css({
							"width":cObj.width() + "px",
							"height":Math.round(cObj.width() * (1/fRatio))
						});

						var newIh = Math.round(cObj.width() * (1/fRatio));

						if(newIh < cObj.height()) {
							var fRatio = ih/iw;
							$(this).css({
								"height":cObj.height(),
								"width":Math.round(cObj.height() * (1/fRatio))
							});
						}
					} else {
						var fRatio = ih/iw;
						$(this).css({
							"height":cObj.height(),
							"width":Math.round(cObj.height() * (1/fRatio))
						});
					}
				} else {
					var fRatio = ih/iw;
					$(this).css({
						"height":cObj.height(),
						"width":Math.round(cObj.height() * (1/fRatio))
					});
				}
				
				// Center image within container

				if ($(this).width() > cObj.width()) {
					var wDiff = ($(this).width() - cObj.width()) / 2;
					$(this).css("left", "-" + wDiff + "px");
				}
				
				if ($(this).height() > cObj.height()) {
					var hDiff = ($(this).height() - cObj.height()) / 2;
					$(this).css("top", "-" + hDiff + "px");
				}
				
			});	
		}
		
		// Set CSS for image container after appended
		$(".internal_swipe_container").css("width",($(this).width() * images.length) + "px");
		$(".jq_swipe_image").css({
			"float":"left",
			"text-align":"center",
			"overflow":"hidden",
			"width":$(this).width() + "px"
		});
		
		// Get the position of the obj the image will be loaded into
		x = cObj.offset().left;
		y = cObj.offset().top;
		c = x + (cObj.width() / 2);
		ct = y + (cObj.height() / 2);
		
		// Append Nav
		cObj.append('<div id="swipe_nav_prev" class="trans"><div></div></div>');
		cObj.append('<div id="swipe_nav_next" class="trans"><div></div></div>');
		
		$('#swipe_nav_next').bind("click", function() {
			imgCount ++;
			if (imgCount == images.length) { $('#swipe_nav_next').css("display","none"); }
			$('.internal_swipe_container').animate({
				left: '-=' + cObj.width()
			}, 400, function() {
				// Animation complete.
				current = current + 1;
				$("#count_container li").removeClass("current");
				$("#count_" + current).addClass("current");
			});
		});
		
		$('#swipe_nav_prev').bind("click", function() {
			imgCount --;
			if (imgCount == 1) { $('#swipe_nav_prev').css("display","none"); }
			$('.internal_swipe_container').animate({
				left: '+=' + cObj.width()
			}, 400, function() {
				// Animation complete.
				current = current - 1;
				$("#count_container li").removeClass("current");
				$("#count_" + current).addClass("current");
			});
		});
		
		// Append Count
		$("body").append('<ul id="count_container" class="trans"></ul>');
		
		for (i=0;i<images.length;i++) {
			$("#count_container").append('<li id="count_' + i + '" onclick="jumpTo(' + i + ');" class="counter"></li>');
		}
		
		$("#count_" + current).addClass("current");
		
		$(".counter").css({
			"width":cObj.width() / images.length + "px"
		});
		
		posCount();
		
		$(document).mousemove(function (e) {
			// Set global mouse position
			mX = e.pageX;
			mY = e.pageY;
			
			// Bounding box coordinents of object
			var bY = y + (cObj.outerHeight(true)-6);
			var rX = x + cObj.outerWidth(true);
			if (((mY > y) && (mY < bY)) && ((mX > x) && (mX < rX))) {
				if (mX < c) { // Prev
					if (imgCount > 1) {
						$('#swipe_nav_next').css("display","none");
						$('#swipe_nav_prev').css({
							"display":"block",
							"height":(cObj.outerHeight(true) - 6) + "px",
							"top": y + "px",
							"left": x + "px",
							"width":(cObj.width() * 0.2) + "px"
						});
					}
				} else if (mX > c) { // Next
					if (imgCount < images.length) {
						$('#swipe_nav_prev').css("display","none");
						$('#swipe_nav_next').css({
							"display":"block",
							"height":(cObj.outerHeight(true) - 6) + "px",
							"top": y + "px",
							"left": ((x + cObj.width()) - cObj.width() * 0.2) + "px",
							"width":(cObj.width() * 0.2) + "px"
						});
					}
				}
			} else {
				$('#swipe_nav_next,#swipe_nav_prev').css("display","none");
			}
		});
		
		
	}
})(jQuery);

function jumpTo(index) {
	
	$('#swipe_nav_next,#swipe_nav_prev').css("display","none");
	
	if (index > current) {
		var diff = index - current;
	} else {
		var diff = current - index;
	}
	
	var go_to_xy = cObj.width() * diff;
	
	if (index >= current) {
		var str = '-=';
	} else {
		var str = '+=';
	}
	
	current = index;
	
	$('.internal_swipe_container').animate({
		left: str + go_to_xy
	}, 400, function() {
		$("#count_container li").removeClass("current");
		$("#count_" + current).addClass("current");
		
		imgCount = index + 1;
	});
}

function posCount() {
	$("#count_container").css({
		"left":x + "px",
		"top":(y + cObj.height() - 6) + "px"
	});
}