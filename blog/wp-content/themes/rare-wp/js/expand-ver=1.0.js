(function($) {
        $('.card-more').click(function() {
                $('#overviewtext').slideToggle("fast");
        });
    

$('.dot-menu').on("click", function (event) {
    $('.menu-rotate').toggleClass('rotate');
    $('.menu-rotate').toggleClass('rotate2');
});
    
$('#toggle').on("click", function (event) {
    $('.dotrotate').toggleClass('opened');
    $('.dotrotate').toggleClass('closed');
});
    

} )( jQuery );