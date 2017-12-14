/* jQuery MaterialRipple Plugin */
/* 2014 Dominik Biedebach */
;(function ($, window, document ) {
    
    $.fn.materialripple = function(options) {
	var defaults = {
		rippleClass: 'ripple-wrapper'
	}
	$.extend(defaults, options);
	// add Ripple-Wrapper to all Elements
	$(this).append('<span class="'+defaults.rippleClass+'"></span>');
	$(this).addClass('has-ripple').css({'position': 'relative', 'overflow': 'hidden'});

	// Let it ripple on click
	$(this).on('click', function(e){
		$this = $(this);
		e.preventDefault();
		$(this).find('.'+defaults.rippleClass).removeClass('animated');
		
		// get Mouse Position
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		
		// for each ripple element, set sizes
		elementWidth = $(this).outerWidth();
		elementHeight = $(this).outerHeight();
		d = Math.max(elementWidth, elementHeight);
		$(this).find('.'+defaults.rippleClass).css({'width': d, 'height': d});

		var rippleX = mouseX - $(this).offset().left - d/2;
		var rippleY = mouseY - $(this).offset().top - d/2;

		// Position the Ripple Element
		$(this).find('.'+defaults.rippleClass).css('top', rippleY+'px').css('left', rippleX+'px').addClass('animated');
		
		$(this).one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function () {
		
			window.location = $this.attr('href');	
	   });
	   
	});
}
    
})(window.jQuery, this, document );