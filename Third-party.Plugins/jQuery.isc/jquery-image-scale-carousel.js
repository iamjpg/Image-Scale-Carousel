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
	* –> стиль position:relative; для объекта #photo_container обязателен, иначе его составные элементы разбегутся по web-странице;
	* – реализована динамическая подгрузка изображений по мере прокрутки слайдера;
	* – добавлена переменная включения/отключения функции перемешивания списка изображений;
	* – на панель навигации по списку изображений добавлена подсказка с номером кадра.
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
iscGlobal.imgArray = [];
iscGlobal.imagesLength = 0; 
iscGlobal.selector = "";
iscGlobal.shuffle = true;
iscGlobal.hints = false;


// Reading properties from CSS
iscGlobal.scrollBoxSize = 17;
iscGlobal.videoFrameMinTop = 17;
iscGlobal.playBoxMinSize = 61;

// Global variable
iscGlobal.autoplay = false;
iscGlobal.autoplayRounded = false;
iscGlobal.autoplayTimer = 2000;
iscGlobal.animationPeriod = 400;
iscGlobal.videoStyle = false; 
iscGlobal.autoresize = false;

iscGlobal.imageWhiteSpace = 34;
iscGlobal.dynamic = false; // dynamic loading of images

iscGlobal.dParams = {};
iscGlobal.dParams.inProgress = false;
iscGlobal.dParams.startFrom = 0;
iscGlobal.dParams.imgArray = [];

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
		
		if (iscGlobal.shuffle) {arrayShuffle(args.imgArray);};
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
        // console.log("$.fn.isc The Size of slider-window (W*H): "+iscGlobal.cObj.width()+"*"+iscGlobal.cObj.height());
		iscGlobal.selector = iscGlobal.cObj.selector;
		iscGlobal.current = 0;
		iscGlobal.imgCount = 1;
		iscGlobal.imagesLength = (args.hasOwnProperty("imgArray")) ? args.imgArray.length : 0;

		if (args.imageWhiteSpace) {iscGlobal.imageWhiteSpace = args.imageWhiteSpace;}
		iscGlobal.dynamic = args.dynamic;

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
			"hints":iscGlobal.hints,

			"imageWhiteSpace": iscGlobal.imageWhiteSpace,
			"dynamic": iscGlobal.dynamic,

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
		iscGlobal.hints = args.hints;

		iscGlobal.imgArray = args.imgArray;
		iscGlobal.imagesLength = args.imgArray.length;
		iscGlobal.current = args.current;
		iscGlobal.imgCount = args.imgCount;

		iscGlobal.videoStyle = args.videoStyle;
		iscGlobal.videoStyled = args.videoStyled;
		iscGlobal.imageWhiteSpace = args.imageWhiteSpace;
		iscGlobal.dynamic = args.dynamic;

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

function getFrames(fromInd) {
	iscGlobal.dParams.inprogress = true;
	iscGlobal.dParams.startFrom = fromInd;
	// console.log("getFrames: iscGlobal.imgArray ="+JSON.stringify(iscGlobal.imgArray, null, 4));
	var lastFrame = iscGlobal.imagesLength - 2;
	// console.log("getFrames: fromInd = "+fromInd+"; lastFrame="+lastFrame);  
	iscGlobal.dParams.imgArray[0] = (fromInd<=0) ? iscGlobal.imgArray[lastFrame] : iscGlobal.imgArray[fromInd-1];
	iscGlobal.dParams.imgArray[1] = iscGlobal.imgArray[fromInd];
	iscGlobal.dParams.imgArray[2] = (fromInd>=(lastFrame)) ? iscGlobal.imgArray[0] : iscGlobal.imgArray[fromInd+1];
	// console.log("getFrames: iscGlobal.dParams.imgArray ="+JSON.stringify(iscGlobal.dParams.imgArray, null, 4));
	iscGlobal.dParams.inprogress = false;
}

function isc_timeJump() {
	if (iscGlobal.autoplay) {
		if (iscGlobal.imgCount == (iscGlobal.imagesLength)) { 
			if (iscGlobal.autoplayRounded) {
				if	(!iscGlobal.animated) {
					// Quietly jump to the top of the image list
					iscGlobal.imgCount = 1;
					iscGlobal.current = 0;

					$("#count_container li").removeClass("current");
					$("#count_" + iscGlobal.current).addClass("current");

					// Continue scrolling from the top of the image list
					iscGlobal.imgCount ++; 
					if (iscGlobal.dynamic) {
						updateRibbon(0);
						var go_to_xy = $('#swipe_div_'+2).position().left;
					} else {
						$('.internal_swipe_container').css({
							left: 0
						});
						var go_to_xy = $('#swipe_div_'+1).position().left;
					}
	
					iscGlobal.animated = true;
					$('.internal_swipe_container').animate({
						left: "-"+go_to_xy + "px"
					}, iscGlobal.animationPeriod, function() {
						// Animation complete.
						iscGlobal.current = iscGlobal.current + 1;
						$("#count_container li").removeClass("current");
						$("#count_" + iscGlobal.current).addClass("current");
						if (iscGlobal.dynamic) {
							updateRibbon(iscGlobal.current);
						}
						iscGlobal.animated = false;
						// console.log("isc_timeJump.animate.fromStart: imgCount="+iscGlobal.imgCount+"; iscGlobal.current="+iscGlobal.current);
					});
				}
			} else {
				if	(!iscGlobal.animated) {
					// console.log("isc_timeJump: !iscGlobal.autoplayRounded; iscGlobal.imgCount="+iscGlobal.imgCount+";  iscGlobal.current="+iscGlobal.current);
					iscGlobal.imgCount = 1;
					iscGlobal.current = 0;
					if (iscGlobal.dynamic) {
						updateRibbon(0);
						var go_to_xy = $('#swipe_div_'+2).position().left;
					} else {
						var go_to_xy = $('#swipe_div_'+0).position().left;
					}
					iscGlobal.animated = true;
					$('.internal_swipe_container').animate({
						left: "-"+go_to_xy + "px"
					}, iscGlobal.animationPeriod, function() {
						// Animation complete.
						$("#count_container li").removeClass("current");
						$("#count_" + iscGlobal.current).addClass("current");
						if (iscGlobal.dynamic) {
							updateRibbon(iscGlobal.current);
						}
						iscGlobal.animated = false;
						// console.log("isc_timeJump.animate.toStart: imgCount="+iscGlobal.imgCount+"; iscGlobal.current="+iscGlobal.current);
					});
				}
			}

		} else {
			if	(!iscGlobal.animated) {
				// console.log("isc_timeJump: iscGlobal.imgCount !== iscGlobal.imagesLength; iscGlobal.imgCount="+iscGlobal.imgCount+";  iscGlobal.imagesLength="+iscGlobal.imagesLength);
				iscGlobal.imgCount ++;
				if (iscGlobal.dynamic) {
					// updateRibbon(iscGlobal.current);
					var go_to_xy = $('#swipe_div_'+2).position().left;
				} else {
					var go_to_xy = $('#swipe_div_'+(iscGlobal.current+1)).position().left;
				}

				iscGlobal.animated = true;
				$('.internal_swipe_container').animate({
					left: "-"+go_to_xy + "px"
				}, iscGlobal.animationPeriod, function() {
					// Animation complete.
					iscGlobal.current = iscGlobal.current + 1;
					$("#count_container li").removeClass("current");
					$("#count_" + iscGlobal.current).addClass("current");
					if (iscGlobal.dynamic) {
						updateRibbon(iscGlobal.current);
					}
					iscGlobal.animated = false;
					// console.log("isc_timeJump.animate.middle: imgCount="+iscGlobal.imgCount+"; iscGlobal.current="+iscGlobal.current);
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

	iscGlobal.current = index;
	
	// console.log("isc_jumpTo: internal_swipe_container.left="+($('.internal_swipe_container').css('left'))+"; go_to_xy="+go_to_xy+";  swipe_div_"+index+".left="+$('#swipe_div_'+index).position().left);

	$("#count_container li").removeClass("current");
	$("#count_" + iscGlobal.current).addClass("current");
	iscGlobal.imgCount = index + 1;
	// iscGlobal.imgCount = index;
	// iscGlobal.imgCount = nextImgCount;
	// console.log("isc_jumpTo: iscGlobal.imgCount="+iscGlobal.imgCount+";  iscGlobal.current="+iscGlobal.current+";  iscGlobal.imagesLength="+iscGlobal.imagesLength);
	if (iscGlobal.imgCount >= iscGlobal.imagesLength) { $('#swipe_nav_next').css("display","none"); };
	if (iscGlobal.imgCount <= 1) {$('#swipe_nav_prev').css("display","none")};

	if (iscGlobal.dynamic) {
		updateRibbon(index);
		var go_to_xy = $('#swipe_div_'+1).position().left;
	} else {
		var go_to_xy = $('#swipe_div_'+index).position().left;
		$('.internal_swipe_container').css({
			left: "-"+go_to_xy + "px"
		});
	}

	isc_showNavigate();
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
			
function constractImages(i) {
	$('#swipe_img_' + i).on('load', function() {

		var iw = $(this).width();
		var ih = $(this).height();
		// console.log("constractImages.load: #swipe_img_" + i+"="+$('#swipe_img_' + i).attr('src') + "; width="+iw + "; height="+ih);
		if (iscGlobal.dynamic) {
			if (iw>ih) {
				$("#swipe_div_" + i).css({
					"background":"url('"+iscGlobal.dParams.imgArray[i]+"') no-repeat center center / cover" //
				});
				// console.log("constractImages.cover: "+i+"/–"+"; "+"["+iw+"*"+ih+"]; "+iscGlobal.dParams.imgArray[i]+"; imgCount="+iscGlobal.imgCount+"; current="+iscGlobal.current);
			} else {
				$("#swipe_div_" + i).css({
					"background":"url('"+iscGlobal.dParams.imgArray[i]+"') no-repeat center center / contain" // auto 100% 
				});
				// console.log("constractImages.contain: "+i+"/–"+"; "+"["+iw+"*"+ih+"]; "+iscGlobal.dParams.imgArray[i]+"; imgCount="+iscGlobal.imgCount+"; current="+iscGlobal.current);
			}
		} else {
			// Lose the background loader image
			$(this).parent('div').css({
				"background-image":"url()",
				"background-color":"inherit"
			});
		}
		
		// Resize the img object to the proper ratio of the container.
		var toW = 0;
		var toH = 0;

		if (iscGlobal.cObj.width() > iscGlobal.cObj.height()) {
			if (iw > ih) {
				var fRatio = iw/ih;

				var newIh = Math.round(iscGlobal.cObj.width() * (1/fRatio));
				toW = iscGlobal.cObj.width();
				toH = newIh;

				if(newIh < iscGlobal.cObj.height()) {
					var fRatio = ih/iw;
					toW = Math.round(iscGlobal.cObj.height() * (1/fRatio));
					toH = iscGlobal.cObj.height();
				}
			} else {
				var fRatio = ih/iw;
				toW = Math.round(iscGlobal.cObj.height() * (1/fRatio));
				toH = iscGlobal.cObj.height();
			}
		} else {
			var fRatio = ih/iw;
			toW = Math.round(iscGlobal.cObj.height() * (1/fRatio));
			toH = iscGlobal.cObj.height();
		}
		
		// Center image within container
		var wDiff = Math.round((toW - iscGlobal.cObj.width()) / 2);
		var hDiff = Math.round((toH - iscGlobal.cObj.height()) / 2);

		// Show image
		$(this).css({
			"visibility":"visible",
			"position":"relative",
			"width":toW + "px",
			"height":toH + "px",
			"left": "-" + wDiff + "px",
			"top": "-" + hDiff + "px"
		});
		// console.log("constractImages.load: #swipe_img_" + i+"="+$('#swipe_img_' + i).attr('src') + "; toW="+toW + "; toH="+toH + "; toL="+wDiff + "; toT="+hDiff);
		
	});	

	$('#swipe_img_' + i).on('error', function() {
		$("#swipe_div_" + i).css({
			"background":"url('Third-party.Plugins/jQuery.isc/loader.gif') no-repeat center center / auto"
		});		
	});	
}

function updateRibbon(el) {
	// return;
	if (iscGlobal.dynamic) {
		var oldList = iscGlobal.dParams.imgArray.slice();
		getFrames(el);

		for (i=0;i<3;i++) {
			// go to target 
			oldInd = oldList.indexOf(iscGlobal.dParams.imgArray[i]);
			if (oldInd>-1) {
				var iw = $("#swipe_img_" + oldInd).width();
				var ih = $("#swipe_img_" + oldInd).height();
				if (iw>ih) {
					// incorrectly: $('#swipe_img_' + i).attr('src')
					$("#swipe_div_" + i).css({
						"background":"url('"+iscGlobal.dParams.imgArray[i]+"') no-repeat center center / cover"
					});
					// console.log("updateRibbon.cover.1: "+i+"/"+el+" ; "+"["+iw+"*"+ih+"]; "+iscGlobal.dParams.imgArray[i]+"; imgCount="+iscGlobal.imgCount+"; current="+iscGlobal.current);
				} else {
					// iscGlobal.dParams.imgArray[i]
					$("#swipe_div_" + i).css({
						"background":"url('"+iscGlobal.dParams.imgArray[i]+"') no-repeat center center / contain" 
					});
					// console.log("updateRibbon.contain.1: "+i+"/"+el+" ; "+"["+iw+"*"+ih+"]; "+iscGlobal.dParams.imgArray[i]+"; imgCount="+iscGlobal.imgCount+"; current="+iscGlobal.current);
				}
			} else {
					$("#swipe_div_" + i).css({
						// may be 'Third-party.Plugins/jQuery.isc/loader.gif'
						"background":"url() no-repeat center center / auto"
					});
			}

			$('#swipe_img_' + i).css({
				"visibility":"hidden",
				"background-size": "auto",
				"width": "auto",
				"height": "auto"
			});
			$("#swipe_img_" + i).attr("src",iscGlobal.dParams.imgArray[i]);
		}
		
		// Set CSS for image container after appended
		$(".internal_swipe_container").css("width",((iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace) * 3) + "px");
		$(".internal_swipe_container").css("left","-" + (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace) + "px");

		var go_to_sx = $('#swipe_div_'+1).position().left;
		$('.internal_swipe_container').css({
			left: "-"+go_to_sx + "px"
		});
	} 
}

function constractRibbon(args) {
	//Append the images
	iscGlobal.cObj.append('<div class="internal_swipe_container"></div>');	
		

	if (iscGlobal.dynamic) {
		getFrames(0);
		for (i=0;i<3;i++) {

			$(".internal_swipe_container").append('<div class="jq_swipe_image" id="swipe_div_' + i + '"><img id="swipe_img_' + i + '" src=""></div><div class="white_space"></div>');
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
			// $('#swipe_img_' + i).css("visibility","hidden");
			$('#swipe_img_' + i).css({
				"visibility":"hidden",
				"background-size": "auto",
				"width": "auto",
				"height": "auto"
			});
	
			// console.log("constractRibbon(0-3): i="+i);
			constractImages(i);

			$("#swipe_img_" + i).attr("src",iscGlobal.dParams.imgArray[i]);
			// console.log("constractRibbon: swipe_div_"+i+".width="+$("#swipe_div_"+i).css('width')+";  swipe_div_"+i+".height="+$("#swipe_div_"+i).css('height')+"; Slider size (W*H) = "+iscGlobal.cObj.width()+"*"+iscGlobal.cObj.height());
		}
		
		// Set CSS for image container after appended
		$(".internal_swipe_container").css("width",((iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace) * 3) + "px");
		$(".internal_swipe_container").css("left","-" + (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace) + "px");
	} else {
		for (i=0;i<iscGlobal.imagesLength;i++) {

			$(".internal_swipe_container").append('<div class="jq_swipe_image" id="swipe_div_' + i + '"><img id="swipe_img_' + i + '" src="' + args.imgArray[i] + '" ></div><div class="white_space"></div>');
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
			
			// console.log("constractRibbon(0-imagesLength): i="+i);
			constractImages(i);
			// console.log("constractRibbon: swipe_div_"+i+".width="+$("#swipe_div_"+i).css('width')+";  swipe_div_"+i+".height="+$("#swipe_div_"+i).css('height')+"; Slider size (W*H) = "+iscGlobal.cObj.width()+"*"+iscGlobal.cObj.height());
		}
		
		// Set CSS for image container after appended
		$(".internal_swipe_container").css("width",((iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace) * iscGlobal.imagesLength) + "px");
	}

	$(".jq_swipe_image").css({
		"float":"left",
		"text-align":"center",
		"overflow":"hidden",
		"width":iscGlobal.cObj.width() + "px"
	});
	
	// Constract div for white_space between images
	$(".white_space").css({
		"float":"left",
		"width":iscGlobal.imageWhiteSpace + "px",
		"height":iscGlobal.cObj.height() + "px"
	});			
}
	
function isc_showNavigate() {
		if (iscGlobal.imgCount >= iscGlobal.imagesLength) {
			$('#swipe_nav_next').css("display","none"); 
		} else {
			// $('#swipe_nav_next').css("display","block");
			$('#swipe_nav_next').css({
				"display":"block",
				"height":(iscGlobal.cObj.outerHeight() - iscGlobal.scrollBoxSize) + "px",
				"top": 0 + "px",
				"right":0 + "px",
				"width":(iscGlobal.cObj.width() * 0.20) + "px"
			});
		}

		if (iscGlobal.imgCount <= 1) {
			$('#swipe_nav_prev').css("display","none");
		} else {
			// $('#swipe_nav_prev').css("display","block");
			$('#swipe_nav_prev').css({
				"display":"block",
				"height":(iscGlobal.cObj.outerHeight() - iscGlobal.scrollBoxSize) + "px",
				"top": 0 + "px",
				"left": 0 + "px",
				"width":(iscGlobal.cObj.width() * 0.20) + "px"
			});
		}
}
		
function trackMouse() {
	var info; 
	$(".internal_swipe_container").mousemove(function(e){
	  if (info !==e.target){
	  	// console.log(e.target);
	  	info = e.target;
	  	isc_showNavigate();
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
		if (iscGlobal.hints) {
			$("#count_container").append('<li id="count_' + i + '" onclick="isc_jumpTo(' + i + ');" class="counter" title = "'+(i+1)+'/'+iscGlobal.imagesLength+'"></li>');
		}else{			
			$("#count_container").append('<li id="count_' + i + '" onclick="isc_jumpTo(' + i + ');" class="counter"></li>');
		}
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
			if (iscGlobal.imgCount == iscGlobal.imagesLength) { 
				$('#swipe_nav_next').css("display","none"); 
			}
			iscGlobal.animated = true;
				if (iscGlobal.dynamic) {
					var go_to_xy = (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace);
				} else {
					var go_to_xy = (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace);
				}
			$('.internal_swipe_container').animate({
				left: '-=' + go_to_xy
			}, iscGlobal.animationPeriod, function() {
				// Animation complete.
				if ((iscGlobal.current+1)<iscGlobal.imagesLength) {
					iscGlobal.current = iscGlobal.current + 1;
					$("#count_container li").removeClass("current");
					$("#count_" + iscGlobal.current).addClass("current");
				}
				if (iscGlobal.dynamic) {
					updateRibbon(iscGlobal.current);
				}
				$('#swipe_nav_prev').css("display","block"); 
				iscGlobal.animated = false;
				// console.log("swipe_nav_next: imgCount="+iscGlobal.imgCount+"; iscGlobal.current="+iscGlobal.current);
				
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
				if (iscGlobal.dynamic) {
					var go_to_xy = (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace);
				} else {
					var go_to_xy = (iscGlobal.cObj.width()+iscGlobal.imageWhiteSpace);
				}
			if (iscGlobal.imgCount == 1) { $('#swipe_nav_prev').css("display","none"); }
			$('.internal_swipe_container').animate({
				left: '+=' + go_to_xy
			}, iscGlobal.animationPeriod, function() {
				// Animation complete.
				iscGlobal.current = iscGlobal.current - 1;
				$("#count_container li").removeClass("current");
				$("#count_" + iscGlobal.current).addClass("current");
				if (iscGlobal.dynamic) {
					updateRibbon(iscGlobal.current);
				}
				$('#swipe_nav_next').css("display","block"); 
				iscGlobal.animated = false;
				// console.log("swipe_nav_prev: imgCount="+iscGlobal.imgCount+"; iscGlobal.current="+iscGlobal.current);
				
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

