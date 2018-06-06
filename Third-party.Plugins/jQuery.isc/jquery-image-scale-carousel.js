/******************************************************
	* jQuery plug-in
	* jQuery Image Scale Carousel
	* Developed by J.P. Given (http://johnpatrickgiven.com) 2010
	* Demo page (http://johnpatrickgiven.com/jquery/Image-Scale-Carousel/)
	* Upgraded by nWebGitFlow (http://invitation.ru) 2018
	* Example show page (http://invitation.ru/show.html)
	* Useage: anyone so long as credit is left alone

	* Новое в версии от 2018 г:
	* – переделана файловая структура проекта с отделением внутренних участков кода от коммуникацонного интерфейса библиотеки с прикладными приложениями;
	* – исключена зависимость от онлайн библиотеки jQuery с сайта http://www.google.com/jsapi;
	* – изменён шаблон индексной страницы под HTML5;
	* – согласованы асинхронные функции анимации и навигации между собой, в связи с чем:
	* ––> удалены баги навигации за пределы списка изображений;
	* ––> исправлен баг с позиционированием слайдера при выборе изображения курсором мыши;
	* – исправлен баг с поведением курсора в некоторых браузерах справа от слайдера;
	* – проведён редизайн слайдера;
	* – добавлен режим автопрокрутки вперёд по кругу без обратного движения по списку изображений;
	* – добавлен режим видеослайдера с кнопками отложенной автопрокрутки изображений; 
	* – расширен перечень конфигурируемых параметров из функции инициализации слайдера;
	* – допущено произвольное наименование указателя для контейнера слайдера и разрешено присоединять слайдер к div на любой глубине вложенности или к body;
	* – исключены математические вычисления регионов положения курсора мыши;
	* – реализована функциональность по извлечению из файла CSS свойств динамически достраиваемых графических элементов;
	* – реализована функциональность по автоматическому отслеживанию размеров слайдера;
	* – важные моменты по настройке пользовательского CSS для контейнера слайдера у его селектора #photo_container:
	* –> задание размеров окна слайдера (объект #photo_container) в точных размерах (в px) обязательно, иначе не будет гарантии в установлении ожидаемых размеров слайдера;
	* –> стиль position:relative; для объекта #photo_container обязателен, иначе его составные элементы разбегутся по web-странице.
******************************************************/

var iscGlobal = {};

// Local variable
iscGlobal.x = 0; // Object X
iscGlobal.y = 0; // Object Y
iscGlobal.c = 0; // Object center point
iscGlobal.ct = 0; // Object center point from top
iscGlobal.animated = false;
iscGlobal.imgCount = 1;
iscGlobal.current = 0;
iscGlobal.videoStyled = false;
iscGlobal.imgArray = {}; 
iscGlobal.selector = "";

// Reading properties from CSS
iscGlobal.scrollBoxSize = 17;
iscGlobal.videoFrameMinTop = 17;
iscGlobal.playBoxMinSize = 61;

// Global variable
iscGlobal.autoplay = false;
iscGlobal.autoplayRounded = false;
iscGlobal.autoplayTimer = 2000;
iscGlobal.animationPeriod = 400;
iscGlobal.imageWhiteSpace = 34;
iscGlobal.videoStyle = false; 
iscGlobal.autoresize = false;

//=======================
function getSliderPos() {
	if (iscGlobal.cObj.length > 0) {

		// console.log("getSliderPos: iscGlobal.cObj.length="+iscGlobal.cObj.length+
		// 	" iscGlobal.cObj.outerHeight()="+iscGlobal.cObj.outerHeight()+
		// 	" iscGlobal.cObj.width()="+iscGlobal.cObj.width()+
		// 	" iscGlobal.scrollBoxSize="+iscGlobal.scrollBoxSize);

		$("#count_container").css({
			"left":0 + "px",
			"bottom": 0 + "px"
		});

		if ($('#swipe_nav_prev').css("display")=="block") {
			$('#swipe_nav_prev').css({
				"height":(iscGlobal.cObj.outerHeight() - iscGlobal.scrollBoxSize) + "px",
				"top": 0 + "px",
				"left": 0 + "px",
				"width":(iscGlobal.cObj.width() * 0.20) + "px"
			});
		}

		if ($('#swipe_nav_next').css("display")=="block") {
			$('#swipe_nav_next').css({
				"height":(iscGlobal.cObj.outerHeight() - iscGlobal.scrollBoxSize) + "px",
				"top": 0 + "px",
				"right":0 + "px",
				"width":(iscGlobal.cObj.width() * 0.20) + "px"
			});
		}

		if ($('#video_frame_start').css("display")=="flex") {
			$('#video_frame_start').css({
				"top": 0 + "px",
				"left": 0 + "px",
				"height":iscGlobal.cObj.outerHeight() + "px",
				"width":iscGlobal.cObj.width() + "px"
			});
		}

		if ($('#video_frame_min').css("display")=="flex") {
			$('#video_frame_min').css({
				"top": (0+iscGlobal.videoFrameMinTop) + "px",
				"left": (iscGlobal.cObj.width() * 0.20) + "px",
				"height":iscGlobal.playBoxMinSize + "px",
				"width":(iscGlobal.cObj.width() * 0.6) + "px"
			});
		}
	}
}

function arrayShuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
}

(function($) {

	/**
	 * FUNCTION OF CONSTRUCTING A SLIDER
	 */
	$.fn.isc = function(args) {
		
		arrayShuffle(args.imgArray);
		if (args.autoplay) {
			iscGlobal.autoplay = true;
			if (args.autoplayTimer > 0) {
				iscGlobal.autoplayTimer = args.autoplayTimer;
			}
			if (args.autoplayRounded) {
				iscGlobal.autoplayRounded = args.autoplayRounded;
				args.imgArray.push(args.imgArray[0]); // add the first element to the end of the image list
			}
			if (args.animationPeriod > 0) {
				iscGlobal.animationPeriod = args.animationPeriod;
			}
			if (args.hasOwnProperty("videoStyle")) {
				iscGlobal.videoStyle = args.videoStyle;
				if (iscGlobal.videoStyle) { iscGlobal.autoplay = false; iscGlobal.videoStyled = true }
			}
		}
		iscGlobal.imgArray = args.imgArray;

		iscGlobal.cObj = $(this);
		iscGlobal.selector = iscGlobal.cObj.selector;
		iscGlobal.current = 0;
		iscGlobal.imgCount = 1;
		iscGlobal.imagesLength = (args.hasOwnProperty("imgArray")) ? args.imgArray.length : 0;


        // console.log("$.fn.isc Размеры слайдера (W*H): "+iscGlobal.cObj.width()+"*"+iscGlobal.cObj.height());

		iscGlobal.autoresize = args.autoresize;
		if (!iscGlobal.autoresize) {
			$(this).css({
				width: iscGlobal.cObj.width(),
				height: iscGlobal.cObj.height(),
				overflow: "hidden"
			});
		}

		getCSSProperties();

		// set up the CSS
		iscGlobal.cObj.css("overflow","hidden");
		//iscGlobal.cObj.css("overflow-x","hidden");

		constractRibbon(args);

		constractSwipes();		

		constractCounters();
		
		trackMouse();
		
		constractPlayButtons();

		// Get the positions of the object collection
		getSliderPos();
		
		if (iscGlobal.autoplay) {
			setTimeout("isc_timeJump()",iscGlobal.autoplayTimer);
		}
		
	};

	/**
	 * FUNCTION OF GETTING SLIDER CONFIGURATION
	 */
	$.fn.isc_shear = function() {
		if	(iscGlobal.animated) {
			$('.internal_swipe_container').stop(false);
		}
		return {
			"imgCount":iscGlobal.imgCount,
			"current":iscGlobal.current,
			"videoStyled":iscGlobal.videoStyled,

			"imageWhiteSpace": iscGlobal.imageWhiteSpace,

			"autoplay": iscGlobal.autoplay,
			"autoplayRounded": iscGlobal.autoplayRounded,
			"animationPeriod": iscGlobal.animationPeriod,
			"autoplayTimer": iscGlobal.autoplayTimer, 
			"videoStyle": iscGlobal.videoStyle,

			"imgArray": iscGlobal.imgArray,
			"selector": iscGlobal.selector
		}
	}

	/**
	 * SLIDER RECONSTRUCTION FUNCTION
	 */
	$.fn.isc_proceed = function(args) {
		
		iscGlobal.cObj = $(this);

		iscGlobal.autoplay = args.autoplay;
		iscGlobal.autoplayTimer = args.autoplayTimer;
		iscGlobal.autoplayRounded = args.autoplayRounded;
		iscGlobal.animationPeriod = args.animationPeriod;

		iscGlobal.imgArray = args.imgArray;
		iscGlobal.imagesLength = args.imgArray.length;
		iscGlobal.current = args.current;
		iscGlobal.imgCount = args.imgCount;

		iscGlobal.videoStyle = args.videoStyle;
		iscGlobal.videoStyled = args.videoStyled;
		iscGlobal.imageWhiteSpace = args.imageWhiteSpace;

		iscGlobal.selector = args.selector;

		// console.log("isc_proceed.begin: iscGlobal.videoStyled="+iscGlobal.videoStyled+" iscGlobal.videoStyle="+iscGlobal.videoStyle+" iscGlobal.autoplay="+iscGlobal.autoplay);

		getCSSProperties();

		// set up the CSS
		iscGlobal.cObj.css("overflow","hidden");
		//iscGlobal.cObj.css("overflow-x","hidden");

		constractRibbon(args);		

		constractSwipes();		
		
		constractCounters();
				
		trackMouse();

		constractPlayButtons();

		if (iscGlobal.videoStyle) { 
			if (!iscGlobal.videoStyled) {
				$('#video_frame_start').css({
					"display":"none"
				});
			}
		}
		
		// Get the positions of the object collection
		getSliderPos();
		
		if (iscGlobal.autoplay) {
			setTimeout("isc_timeJump()",iscGlobal.autoplayTimer);
		}

		// initial repositioning
		newPos = iscGlobal.current;
		iscGlobal.current = 0;
		isc_jumpTo(newPos);
		// console.log("isc_proceed: args/after/="+JSON.stringify(args, null, 4));
		// console.log("isc_proceed.end: iscGlobal.videoStyled="+iscGlobal.videoStyled+" iscGlobal.videoStyle="+iscGlobal.videoStyle+" iscGlobal.autoplay="+iscGlobal.autoplay);		
	};

	/**
	 * SLIDER DESTRUCTOR-CONSTRUCTOR
	 */
	$.fn.isc_rebuild_slider = function() {
		// console.log("rebuildSlider: "+iscGlobal.selector+ '; autoresize: ' +iscGlobal.autoresize); 
		// console.log("rebuildSlider.window: "+"width="+window.innerWidth+"; height="+window.innerHeight);  
		var atThis = $(iscGlobal.selector);
		var thisAttr = atThis.attr('id');
		if (thisAttr == undefined) return;
		if (iscGlobal.autoresize) {
			// console.log("rebuildSlider.atThis = "+atThis);
			var parent = atThis.parent("div");
			// console.log("rebuildSlider.parent = "+parent);
			// console.log("rebuildSlider.parent.attr('id') = "+parent.attr('id')+" $(iscGlobal.selector).attr('id') = "+thisAttr);
			if (parent.attr('id')==thisAttr) {
				var parentSelector = atThis.parent()[0].nodeName.toLowerCase();
				// console.log("rebuildSlider.parent may be body ");
			} else {
				var parentSelector = (parent.attr('id') !== undefined) ? "#"+parent.attr('id') : (parent.attr('class') !== undefined) ? "."+parent.attr('class') : "div" ; //parent.tagName
			}
			var w = 0;
			var h = 0;
			if (parentSelector=="body") {
				// console.log("rebuildSlider.parent/body/ = "+parentSelector);  
				w = window.innerWidth;
				h = window.innerHeight;
			} else { // (parentSelector=="body")
				// console.log("rebuildSlider.parent/div/ = "+parentSelector);
				var fromParent = atThis.parent(parentSelector);
				w = fromParent.css('width');
				h = fromParent.css('height');
			}
			if	(iscGlobal.animated) {
				$('.internal_swipe_container').stop(true, true);
			}

			// console.log("rebuildSlider["+parentSelector+"]: width="+w+"; height="+h);  

			var bef = atThis.isc_shear();
			// console.log("rebuildSlider: args/before/="+JSON.stringify(bef, null, 4));
			
			$("#count_container").remove();
			atThis.remove();

			$(parentSelector).append('<div id="'+thisAttr+'"></div>');
			atThis = $(iscGlobal.selector);
			
			atThis.css({"width":w+"px", "height":h+"px"});
				
			atThis.isc_proceed(bef);		
		}
	};

})(jQuery);

function isc_timeJump() {
	if (iscGlobal.autoplay) {
		if (iscGlobal.imgCount == (iscGlobal.imagesLength)) { 
			if (iscGlobal.autoplayRounded) {
				if	(!iscGlobal.animated) {
					// Quietly jump to the top of the image list
					iscGlobal.imgCount = 1;
					iscGlobal.current = 0;

					$('.internal_swipe_container').css({
						left: 0
					});
					$("#count_container li").removeClass("current");
					$("#count_" + iscGlobal.current).addClass("current");


					// Continue scrolling from the top of the image list
					iscGlobal.imgCount ++; 
					var go_to_xy = $('#swipe_div_'+1).position().left;
	
					iscGlobal.animated = true;
					$('.internal_swipe_container').animate({
						left: "-"+go_to_xy + "px"
					}, iscGlobal.animationPeriod, function() {
						// Animation complete.
						iscGlobal.current = iscGlobal.current + 1;
						$("#count_container li").removeClass("current");
						$("#count_" + iscGlobal.current).addClass("current");
						iscGlobal.animated = false;
					});
				}
			} else {
				if	(!iscGlobal.animated) {
					// console.log("isc_timeJump: !iscGlobal.autoplayRounded; iscGlobal.imgCount="+iscGlobal.imgCount+";  iscGlobal.current="+iscGlobal.current);
					iscGlobal.imgCount = 1;
					iscGlobal.current = 0;
					var go_to_xy = $('#swipe_div_'+0).position().left;
					iscGlobal.animated = true;
					$('.internal_swipe_container').animate({
						left: "-"+go_to_xy + "px"
					}, iscGlobal.animationPeriod, function() {
						// Animation complete.
						$("#count_container li").removeClass("current");
						$("#count_" + iscGlobal.current).addClass("current");
						iscGlobal.animated = false;
					});
				}
			}

		} else {
			if	(!iscGlobal.animated) {
				// console.log("isc_timeJump: iscGlobal.imgCount !== iscGlobal.imagesLength; iscGlobal.imgCount="+iscGlobal.imgCount+";  iscGlobal.imagesLength="+iscGlobal.imagesLength);
				iscGlobal.imgCount ++;
				var go_to_xy = $('#swipe_div_'+(iscGlobal.current+1)).position().left;

				iscGlobal.animated = true;
				$('.internal_swipe_container').animate({
					left: "-"+go_to_xy + "px"
				}, iscGlobal.animationPeriod, function() {
					// Animation complete.
					iscGlobal.current = iscGlobal.current + 1;
					$("#count_container li").removeClass("current");
					$("#count_" + iscGlobal.current).addClass("current");
					iscGlobal.animated = false;
				});
			}
		}	
		
		if (iscGlobal.autoplay) {
			setTimeout("isc_timeJump()",iscGlobal.autoplayTimer);
		}
	}
}

function isc_jumpTo(index) {
	if	(iscGlobal.animated) {
		$('.internal_swipe_container').stop(true, true);
	}
	iscGlobal.autoplay = false;

	var go_to_xy = $('#swipe_div_'+index).position().left;

	iscGlobal.current = index;
	
	$('.internal_swipe_container').css({
		left: "-"+go_to_xy + "px"
	});
	// console.log("isc_jumpTo: internal_swipe_container.left="+($('.internal_swipe_container').css('left'))+"; go_to_xy="+go_to_xy+";  swipe_div_"+index+".left="+$('#swipe_div_'+index).position().left);

	$("#count_container li").removeClass("current");
	$("#count_" + iscGlobal.current).addClass("current");
	iscGlobal.imgCount = index + 1;
	// console.log("isc_jumpTo: iscGlobal.imgCount="+iscGlobal.imgCount+";  iscGlobal.current="+iscGlobal.current+";  iscGlobal.imagesLength="+iscGlobal.imagesLength);
	if (iscGlobal.imgCount == iscGlobal.imagesLength) { $('#swipe_nav_next').css("display","none"); };
	if (iscGlobal.imgCount == 1) {$('#swipe_nav_prev').css("display","none")};

	isc_showPlayButton();
	
}

function isc_showPlayButton() {
	if (iscGlobal.videoStyle && !iscGlobal.videoStyled) { 
		$('#video_frame_min').css({
			"display":"flex",
			"top": (0+iscGlobal.videoFrameMinTop) + "px",
			"left": (iscGlobal.cObj.width() * 0.20) + "px",
			"height":iscGlobal.playBoxMinSize + "px",
			"width":(iscGlobal.cObj.width() * 0.6) + "px"
		});
	}
}

function constractRibbon(args) {
		//Append the images
		iscGlobal.cObj.append('<div class="internal_swipe_container"></div>');	
		
		for (i=0;i<iscGlobal.imagesLength;i++) {

			$(".internal_swipe_container").append('<div class="jq_swipe_image" id="swipe_div_' + i + '"><img id="swipe_img_' + i + '" src="' + args.imgArray[i] + '" ></div><div class="white-space"></div>');
			// border="0"
			$("#internal_swipe_container").css({
				width: iscGlobal.cObj.width(),
				height: iscGlobal.cObj.height(),
				overflow: "hidden"
			});
			
			// Containing div height for loader
			$(".jq_swipe_image").css({
				"height":iscGlobal.cObj.height() + "px",
				"background-color":"inherit"
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
					"position":"relative",
				});
				
				// Resize the img object to the proper ratio of the container.
				var iw = $(this).width();
				var ih = $(this).height();
				if (iscGlobal.cObj.width() > iscGlobal.cObj.height()) {
					if (iw > ih) {
						var fRatio = iw/ih;

						var newIh = Math.round(iscGlobal.cObj.width() * (1/fRatio));
						$(this).css({
							"width":iscGlobal.cObj.width() + "px",
							"height":newIh + "px"
						});

						if(newIh < iscGlobal.cObj.height()) {
							var fRatio = ih/iw;
							$(this).css({
								"height":iscGlobal.cObj.height() + "px",
								"width":Math.round(iscGlobal.cObj.height() * (1/fRatio)) + "px"
							});
						}
					} else {
						var fRatio = ih/iw;
						$(this).css({
							"height":iscGlobal.cObj.height() + "px",
							"width":Math.round(iscGlobal.cObj.height() * (1/fRatio)) + "px"
						});
					}
				} else {
					var fRatio = ih/iw;
					$(this).css({
						"height":iscGlobal.cObj.height() + "px",
						"width":Math.round(iscGlobal.cObj.height() * (1/fRatio)) + "px"
					});
				}
				
				// Center image within container

				if ($(this).width() > iscGlobal.cObj.width()) {
					var wDiff = Math.round(($(this).width() - iscGlobal.cObj.width()) / 2);
					$(this).css("left", "-" + wDiff + "px");
				}
				
				if ($(this).height() > iscGlobal.cObj.height()) {
					var hDiff = Math.round(($(this).height() - iscGlobal.cObj.height()) / 2);
					$(this).css("top", "-" + hDiff + "px");
				}
				
			});	
			// console.log("constractRibbon: swipe_div_"+i+".width="+$("#swipe_div_"+i).css('width')+";  swipe_div_"+i+".height="+$("#swipe_div_"+i).css('height')+"; разеры слайдера (W*H) = "+iscGlobal.cObj.width()+"*"+iscGlobal.cObj.height());

			
			// Constract div for white-space between images
			$(".white-space").css({
				"height":iscGlobal.cObj.height() + "px",
				"width":iscGlobal.imageWhiteSpace + "px"
			});
		}
		
		// Set CSS for image container after appended
		$(".internal_swipe_container").css("width",((iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace) * iscGlobal.imagesLength) + "px");
		$(".jq_swipe_image").css({
			"float":"left",
			"text-align":"center",
			"overflow":"hidden",
			"width":iscGlobal.cObj.width() + "px"
		});
		
		// Constract div for white-space between images
		$(".white-space").css({
			"float":"left",
			"text-align":"center",
			"overflow":"hidden",
			"width":iscGlobal.imageWhiteSpace + "px",
			"height":iscGlobal.cObj.height() + "px"
		});
}
	
		
function trackMouse() {
	var info; 
	$(".internal_swipe_container").mousemove(function(e){
	  if (info !==e.target){
	  	// console.log(e.target);
	  	info = e.target;
		if (iscGlobal.imgCount == iscGlobal.imagesLength) {
			$('#swipe_nav_next').css("display","none"); 
		} else {
			$('#swipe_nav_next').css("display","block");
			$('#swipe_nav_next').css({
				"display":"block",
				"height":(iscGlobal.cObj.outerHeight() - iscGlobal.scrollBoxSize) + "px",
				"top": 0 + "px",
				"right":0 + "px",
				"width":(iscGlobal.cObj.width() * 0.20) + "px"
			});
		}

		if (iscGlobal.imgCount == 1) {
			$('#swipe_nav_prev').css("display","none");
		} else {
			$('#swipe_nav_prev').css("display","block");
			$('#swipe_nav_prev').css({
				"display":"block",
				"height":(iscGlobal.cObj.outerHeight() - iscGlobal.scrollBoxSize) + "px",
				"top": 0 + "px",
				"left": 0 + "px",
				"width":(iscGlobal.cObj.width() * 0.20) + "px"
			});
		}
	  }
	});
}
	
function constractPlayButtons() {
	if (iscGlobal.videoStyle) { 
		// Add major play-button with clickable area alignment
		iscGlobal.cObj.append('<div id="video_frame_start" class="video_trans" ><div id="push_play_max"></div></div>');

		$('#video_frame_start').css({
			"display":"flex",
			"top": 0 + "px",
			"left": 0 + "px",
			"height":iscGlobal.cObj.outerHeight() + "px",
			"width":iscGlobal.cObj.width() + "px"
		});
	
		$('#push_play_max').bind("click", function() {
			$('#video_frame_start').css("display","none");
			iscGlobal.videoStyled = false;
			iscGlobal.autoplay = true;
			setTimeout("isc_timeJump()",iscGlobal.autoplayTimer);
		});

		// Add minor play-button with clickable horizontal alignment
		iscGlobal.cObj.append('<div id="video_frame_min" class="trans_min" ><div id="push_play_min"></div></div>');

		$('#video_frame_min').css({
			"display":"none",
			"top": (0+iscGlobal.videoFrameMinTop) + "px",
			"left": (iscGlobal.cObj.width() * 0.20) + "px",
			"height":iscGlobal.playBoxMinSize + "px",
			"width":(iscGlobal.cObj.width() * 0.6) + "px"
		});
	
		$('#push_play_min').bind("click", function() {
			if	(iscGlobal.animated) {
				$('.internal_swipe_container').stop(true, true);
			}
			$('#video_frame_min').css("display","none");
			iscGlobal.autoplay = true;
			setTimeout("isc_timeJump()",iscGlobal.autoplayTimer);
		});
	}
}

		
function constractCounters() {
	// Append Count
	iscGlobal.cObj.append('<ul id="count_container" class="count_trans"></ul>');
	
	for (i=0;i<iscGlobal.imagesLength;i++) {
		$("#count_container").append('<li id="count_' + i + '" onclick="isc_jumpTo(' + i + ');" class="counter"></li>');
	}
	
	$("#count_" + iscGlobal.current).addClass("current");
	
	if (iscGlobal.imagesLength>0){
		$(".counter").css({
			"width":iscGlobal.cObj.width() / iscGlobal.imagesLength + "px"
		});
	} else {
		$(".counter").css({
			"width":0 + "px"
		});
	}
}

function constractSwipes() {
	// Append Nav
	iscGlobal.cObj.append('<div id="swipe_nav_prev" class="swipe_trans"></div>');
	iscGlobal.cObj.append('<div id="swipe_nav_next" class="swipe_trans"></div>');
	
	$('#swipe_nav_next').bind("click", function() {
		if	(iscGlobal.animated) {
			$('.internal_swipe_container').stop(true, true);
		}
		if	(iscGlobal.imgCount < iscGlobal.imagesLength) {
			iscGlobal.autoplay = false;
			iscGlobal.imgCount ++;
			if (iscGlobal.imgCount == iscGlobal.imagesLength) { $('#swipe_nav_next').css("display","none"); }
			iscGlobal.animated = true;
			$('.internal_swipe_container').animate({
				left: '-=' + (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace)
			}, iscGlobal.animationPeriod, function() {
				// Animation complete.
				if ((iscGlobal.current+1)<iscGlobal.imagesLength) {
					iscGlobal.current = iscGlobal.current + 1;
					$("#count_container li").removeClass("current");
					$("#count_" + iscGlobal.current).addClass("current");
				}
				iscGlobal.animated = false;
				
				isc_showPlayButton();
			});
		}
	});
	
	$('#swipe_nav_prev').bind("click", function() {
		if	(iscGlobal.animated) {
			$('.internal_swipe_container').stop(true, true);
		}
		if	(iscGlobal.imgCount > 0) {
			iscGlobal.autoplay = false;
			iscGlobal.imgCount --;
			iscGlobal.animated = true;
			if (iscGlobal.imgCount == 1) { $('#swipe_nav_prev').css("display","none"); }
			$('.internal_swipe_container').animate({
				left: '+=' + (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace)
			}, iscGlobal.animationPeriod, function() {
				// Animation complete.
				iscGlobal.current = iscGlobal.current - 1;
				$("#count_container li").removeClass("current");
				$("#count_" + iscGlobal.current).addClass("current");
				iscGlobal.animated = false;
				
				isc_showPlayButton();
			});
		}
	});
}

function getCSSProperties() {
	// iscGlobal.scrollBoxSize = $("#count_container").height(); // NAN for CSS-variable
	// var cc = document.getElementById('count_container');  // not yet
	// iscGlobal.scrollBoxSize = window.getComputedStyle(cc, null).getPropertyValue('height'); 
	var $cc = $('<div id="count_container" ></div>').hide().appendTo("body");
	iscGlobal.scrollBoxSize = $cc.height(); // still a number
	$cc.remove();		
	// console.log("$.fn.isc.CSS-properties: iscGlobal.scrollBoxSize="+iscGlobal.scrollBoxSize);

	var $vfm = $('<div id="video_frame_min" ></div>').hide().appendTo("body");
	iscGlobal.videoFrameMinTop = parseInt($vfm.css('top'), 10);
	iscGlobal.playBoxMinSize = $vfm.height(); // still a number
	$vfm.remove();		
	// console.log("$.fn.isc.CSS-properties: iscGlobal.videoFrameMinTop="+iscGlobal.videoFrameMinTop+"; iscGlobal.playBoxMinSize="+iscGlobal.playBoxMinSize);
}
