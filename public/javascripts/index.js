$(document).ready(function() {

	// General: H1 animates for .hero-2 and .hero-3
	if ($('.hero').hasClass('hero-2') || $('.hero').hasClass('hero-3')) {
		$('h1').addClass('animate');
	}

	// Mobile Menu
	$('span#ham-menu').click(function() {
		$('header').toggleClass('expand');
	});

	// Products (Individual)
	if ($('body').hasClass('products')) {

		// Marks active sidebar link
		let last_url_segment = window.location.pathname;
		$('aside').find('a[href="' + last_url_segment + '"]').addClass('active');
	}
	
});


let scroll_pos;
$(window).scroll(function() {
	scroll_pos = $(this).scrollTop();
	if (scroll_pos > 0) {
		$('header').addClass('scrolled');
		if ($('header').hasClass('alt')) {
			$('header').removeClass('alt').addClass('transparent-alt');
		}
	} else {
		$('header').removeClass('scrolled');
		if ($('header').hasClass('transparent-alt')) {
			$('header').removeClass('transparent-alt').addClass('alt');
		}
	}
});
