/**
 * The nav stuff
 */

/*
(function( window ){

	var body = document.body,
		menu = document.getElementsByClassName('menuclose'),
		mask = document.createElement("div"),
		toggleSlideLeft = document.querySelector( ".toggle-slide-left" ),
		activeNav,
		toggleMenu = document.querySelector( ".cl-menu" ),
		activeDiv
	;
	mask.className = "mask";

	//slide menu left
	toggleSlideLeft.addEventListener( "click", function(){
		classie.add( body, "sml-open" );
		jQuery(".menuclose").css('display','block');
		document.body.appendChild(mask);
		activeNav = "sml-open";
		activeDiv = "menuclose";
	} );

	toggleMenu.addEventListener( "click", function(){
		jQuery(".menuclose").css('display','none');
		document.body.appendChild(mask);
	} );

	// hide active menu if mask is clicked
	mask.addEventListener( "click", function(){
		classie.remove( body, activeNav );
		classie.remove( menu, activeDiv );
		activeNav = "";
		activeDiv = "";
		document.body.removeChild(mask);
	} );

	//hide active menu if close menu button is clicked

	[].slice.call(document.querySelectorAll(".cl-menu")).forEach(function(el,i){
		el.addEventListener( "click", function(){
			classie.remove( body, activeNav );
			// classie.remove( menu, activeDiv );
			activeNav = "";
			activeDiv = "";
			document.body.removeChild(mask);
		} );
	});



})( window );
*/