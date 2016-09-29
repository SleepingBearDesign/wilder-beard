smoothScroll.init();

jQuery(document).ready(function ($) {
    var introSection = $('#cd-intro-background'),
        introSectionimg = $('#cd-intro-tagline'),
        introSectionHeight = introSection.height() - 70,
        //change scaleSpeed if you want to change the speed of the scale effect
        scaleSpeed = 0.3,
        //change opacitySpeed if you want to change the speed of opacity reduction effect
        opacitySpeed = 1;

    //update this value if you change this breakpoint in the style.css file (or _layout.scss if you use SASS)
    var MQ = 1170;

    triggerAnimation();
    $(window).on('resize', function () {
        triggerAnimation();
    });

    //bind the scale event to window scroll if window width > $MQ (unbind it otherwise)
    function triggerAnimation() {
        if ($(window).width() >= MQ) {
            $(window).on('scroll', function () {
                //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation- the browser can optimize it so animations will be smoother
                window.requestAnimationFrame(animateIntro);
            });
        } else {
            $(window).off('scroll');
        }
    }
    //assign a scale transformation to the introSection element and reduce its opacity
    function animateIntro() {
        var scrollPercentage = ($(window).scrollTop() / introSectionHeight).toFixed(5),
            scaleValue = 1 - scrollPercentage * scaleSpeed;
        //check if the introSection is still visible
        if ($(window).scrollTop() < introSectionHeight) {
            introSection.css({
                '-moz-transform': 'scale(' + scaleValue + ') translateZ(0)',
                '-webkit-transform': 'scale(' + scaleValue + ') translateZ(0)',
                '-ms-transform': 'scale(' + scaleValue + ') translateZ(0)',
                '-o-transform': 'scale(' + scaleValue + ') translateZ(0)',
                'transform': 'scale(' + scaleValue + ') translateZ(0)',
                'opacity': 1 - scrollPercentage * opacitySpeed
            });
            introSectionimg.css({
                'opacity': 1 - scrollPercentage
            });
        }
    }

    /********************************
		open/close submenu on mobile
	********************************/

    //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.cd-header').height();
        $(window).on('scroll', {
                previousTop: 0
            },
            function () {
                var currentTop = $(window).scrollTop();
                //check if user is scrolling up
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.cd-header').hasClass('is-fixed')) {
                        $('.cd-header').addClass('is-visible');
                    } else {
                        $('.cd-header').removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    $('.cd-header').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.cd-header').hasClass('is-fixed')) $('.cd-header').addClass('is-fixed');
                }
                this.previousTop = currentTop;
            });
    }

    //open/close primary navigation
    $('.cd-primary-nav-trigger').on('click', function () {
        $('.cd-menu-icon').toggleClass('is-clicked');
        $('.cd-header').toggleClass('menu-is-open');

        //in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
        if ($('.cd-primary-nav').hasClass('is-visible')) {
            $('.cd-primary-nav').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                $('body').removeClass('overflow-hidden');
            });
        } else {
            $('.cd-primary-nav').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                $('body').addClass('overflow-hidden');
            });
        }
    });

    //faq page
    //update these values if you change these breakpoints in the style.css file (or _layout.scss if you use SASS)
    var MqM = 768,
        MqL = 1024;

    var faqsSections = $('.cd-faq-group'),
        faqTrigger = $('.cd-faq-trigger'),
        faqsContainer = $('.cd-faq-items'),
        faqsCategoriesContainer = $('.cd-faq-categories'),
        faqsCategories = faqsCategoriesContainer.find('a'),
        closeFaqsContainer = $('.cd-close-panel');

    //select a faq section
    faqsCategories.on('click', function (event) {
        event.preventDefault();
        var selectedHref = $(this).attr('href'),
            target = $(selectedHref);
        if ($(window).width() < MqM) {
            faqsContainer.scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(selectedHref).addClass('selected');
            closeFaqsContainer.addClass('move-left');
            $('body').addClass('cd-overlay');
        } else {
            $('body,html').animate({
                'scrollTop': target.offset().top - 19
            }, 200);
        }
    });

    //close faq lateral panel - mobile only
    $('body').bind('click touchstart', function (event) {
        if ($(event.target).is('body.cd-overlay') || $(event.target).is('.cd-close-panel')) {
            closePanel(event);
        }
    });
    faqsContainer.on('swiperight', function (event) {
        closePanel(event);
    });

    //show faq content clicking on faqTrigger
    faqTrigger.on('click', function (event) {
        event.preventDefault();
        $(this).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
    });

    //update category sidebar while scrolling
    $(window).on('scroll', function () {
        if ($(window).width() > MqL) {
            (!window.requestAnimationFrame) ? updateCategory(): window.requestAnimationFrame(updateCategory);
        }
    });

    $(window).on('resize', function () {
        if ($(window).width() <= MqL) {
            faqsCategoriesContainer.removeClass('is-fixed').css({
                '-moz-transform': 'translateY(0)',
                '-webkit-transform': 'translateY(0)',
                '-ms-transform': 'translateY(0)',
                '-o-transform': 'translateY(0)',
                'transform': 'translateY(0)',
            });
        }
        if (faqsCategoriesContainer.hasClass('is-fixed')) {
            faqsCategoriesContainer.css({
                'left': faqsContainer.offset().left,
            });
        }
    });

    function closePanel(e) {
        e.preventDefault();
        faqsContainer.removeClass('slide-in').find('li').show();
        closeFaqsContainer.removeClass('move-left');
        $('body').removeClass('cd-overlay');
    }

    function updateCategory() {
        updateCategoryPosition();
        updateSelectedCategory();
    }

    function getFaqTop() {
        if ( $( ".cd-faq" ).length ) {
            return $('.cd-faq').offset().top;
        }
    }

    function updateCategoryPosition() {
        var top = getFaqTop(),
            height = jQuery('.cd-faq').height() - jQuery('.cd-faq-categories').height(),
            margin = 90;
        if (top - margin <= $(window).scrollTop() && top - margin + height > $(window).scrollTop()) {
            var leftValue = faqsCategoriesContainer.offset().left,
                widthValue = faqsCategoriesContainer.width();
            faqsCategoriesContainer.addClass('is-fixed').css({
                'left': leftValue,
                'top': margin,
                '-moz-transform': 'translateZ(0)',
                '-webkit-transform': 'translateZ(0)',
                '-ms-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)',
                'transform': 'translateZ(0)',
            });
        } else if (top - margin + height <= $(window).scrollTop()) {
            var delta = top - margin + height - $(window).scrollTop();
            faqsCategoriesContainer.css({
                '-moz-transform': 'translateZ(0) translateY(' + delta + 'px)',
                '-webkit-transform': 'translateZ(0) translateY(' + delta + 'px)',
                '-ms-transform': 'translateZ(0) translateY(' + delta + 'px)',
                '-o-transform': 'translateZ(0) translateY(' + delta + 'px)',
                'transform': 'translateZ(0) translateY(' + delta + 'px)',
            });
        } else {
            faqsCategoriesContainer.removeClass('is-fixed').css({
                'left': 0,
                'top': 0,
            });
        }
    }

    function updateSelectedCategory() {
        faqsSections.each(function () {
            var actual = $(this),
                margin = parseInt($('.cd-faq-title').eq(1).css('marginTop').replace('px', '')),
                activeCategory = $('.cd-faq-categories a[href="#' + actual.attr('id') + '"]'),
                topSection = (activeCategory.parent('li').is(':first-child')) ? 0 : Math.round(actual.offset().top);

            if ((topSection - 20 <= $(window).scrollTop()) && (Math.round(actual.offset().top) + actual.height() + margin - 20 > $(window).scrollTop())) {
                activeCategory.addClass('selected');
            } else {
                activeCategory.removeClass('selected');
            }
        });
    }


    //contact form
    if ($('.floating-labels').length > 0) floatLabels();

    function floatLabels() {
        var inputFields = $('.floating-labels .cd-label').next();
        inputFields.each(function () {
            var singleInput = $(this);
            //check if user is filling one of the form fields
            checkVal(singleInput);
            singleInput.on('change keyup', function () {
                checkVal(singleInput);
            });
        });
    }

    function checkVal(inputField) {
        (inputField.val() == '') ? inputField.prev('.cd-label').removeClass('float'): inputField.prev('.cd-label').addClass('float');
    }

    //final width --> this is the quick view image slider width
    //maxQuickWidth --> this is the max-width of the quick-view panel
    var sliderFinalWidth = 400,
        maxQuickWidth = 900;

    //open the quick view panel
    $('.cd-trigger').on('click', function(event){
        var selectedImage = $(this).parent('.cd-item').children('img'),
            selectedproduct = $(this).parent('.cd-item'),
            qvcontent = selectedproduct.children('.quick-view-content').html(),
            qvwarpper = document.getElementById('cd-quick-view');
            qvoveraly = document.getElementById('cd-quick-view-coverlay');

            slectedImageUrl = selectedImage.attr('src');

        $('body').addClass('overlay-layer');

        $(qvoveraly).addClass('overlay_active');

        animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');

        //update the visible slider image in the quick view panel
        //you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
        updateQuickView(slectedImageUrl);

        $('#cd-quick-view').children('.quick-view-content-wrapper').remove();
        $(qvwarpper).append(qvcontent);

        $('body, html').css({
            'overflow':'hidden',
            'height':'100%'
        });

    });

    //close the quick view panel
    $(document).on('click','.cd-close', function(event){

        closeQuickView( sliderFinalWidth, maxQuickWidth);
        $(qvoveraly).removeClass('overlay_active');

        $('body, html').css({
            'overflow':'auto',
            'height':'auto'
        });

    });

        //close the quick view panel
    $(document).on('click','.add-to-cart', function(event){

        closeQuickView( sliderFinalWidth, maxQuickWidth);
        $(qvoveraly).removeClass('overlay_active');

        $('body, html').css({
            'overflow':'auto',
            'height':'auto'
        });

    });

    $('#cd-quick-view-coverlay').click(function(event){

        closeQuickView( sliderFinalWidth, maxQuickWidth);
        $(qvoveraly).removeClass('overlay_active');

        $('body, html').css({
            'overflow':'auto',
            'height':'auto'
        });

    });

    $(document).keyup(function(event){
        //check if user has pressed 'Esc'
        if(event.which=='27'){
            closeQuickView( sliderFinalWidth, maxQuickWidth);
        }
    });

    //quick view slider implementation
    $('.cd-quick-view').on('click', '.cd-slider-navigation a', function(){
        updateSlider($(this));
    });

    //center quick-view on window resize
    $(window).on('resize', function(){
        if($('.cd-quick-view').hasClass('is-visible')){
            window.requestAnimationFrame(resizeQuickView);
        }
    });

    function updateSlider(navigation) {
        var sliderConatiner = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
            activeSlider = sliderConatiner.children('.selected').removeClass('selected');
        if ( navigation.hasClass('cd-next') ) {
            ( !activeSlider.is(':last-child') ) ? activeSlider.next().addClass('selected') : sliderConatiner.children('li').eq(0).addClass('selected');
        } else {
            ( !activeSlider.is(':first-child') ) ? activeSlider.prev().addClass('selected') : sliderConatiner.children('li').last().addClass('selected');
        }
    }

    function updateQuickView(url) {
        $('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ url +'"]').parent('li').addClass('selected');
    }

    function resizeQuickView() {
        var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
            quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;
        $('.cd-quick-view').css({
            "top": quickViewTop,
            "left": quickViewLeft,
        });
    }

    function closeQuickView(finalWidth, maxQuickWidth) {
        var close = $('.cd-close'),
            activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
            selectedImage = $('.empty-box').find('img');

        //update the image in the gallery
        if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
            selectedImage.attr('src', activeSliderUrl);
            animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');

        } else {
            closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
        }

    }

    function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
        //store some image data (width, top position, ...)
        //store window data to calculate quick view panel position
        var parentListItem = image.parent('.cd-item'),
            topSelected = image.offset().top - $(window).scrollTop(),
            leftSelected = image.offset().left,
            widthSelected = image.width(),
            heightSelected = image.height(),
            windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            finalLeft = (windowWidth - finalWidth)/2,
            finalHeight = finalWidth * heightSelected/widthSelected,
            finalTop = (windowHeight - finalHeight)/2,
            quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
            quickViewLeft = (windowWidth - quickViewWidth)/2;

        if( animationType == 'open') {
            //hide the image in the gallery
            parentListItem.addClass('empty-box');
            //place the quick view over the image gallery and give it the dimension of the gallery image
            $('.cd-quick-view').css({
                "top": topSelected,
                "left": leftSelected,
                "width": widthSelected,
            }).velocity({
                //animate the quick view: animate its width and center it in the viewport
                //during this animation, only the slider image is visible
                'top': finalTop+ 'px',
                'left': finalLeft+'px',
                'width': finalWidth+'px',
            }, 1000, [ 400, 20 ], function(){
                //animate the quick view: animate its width to the final value
                $('.cd-quick-view').addClass('animate-width').velocity({
                    'left': quickViewLeft+'px',
                    'width': quickViewWidth+'px',
                }, 300, 'ease' ,function(){
                    //show quick view content
                    $('.cd-quick-view').addClass('add-content');
                });
            }).addClass('is-visible');
        } else {
            //close the quick view reverting the animation
            $('.cd-quick-view').removeClass('add-content').velocity({
                'top': finalTop+ 'px',
                'left': finalLeft+'px',
                'width': finalWidth+'px',
            }, 300, 'ease', function(){
                $('body').removeClass('overlay-layer');
                $('.cd-quick-view').removeClass('animate-width').velocity({
                    "top": topSelected,
                    "left": leftSelected,
                    "width": widthSelected,
                }, 500, 'ease', function(){
                    $('.cd-quick-view').removeClass('is-visible');
                    parentListItem.removeClass('empty-box');
                });
            });

        }
    }

    function closeNoAnimation(image, finalWidth, maxQuickWidth) {
        var parentListItem = image.parent('.cd-item'),
            topSelected = image.offset().top - $(window).scrollTop(),
            leftSelected = image.offset().left,
            widthSelected = image.width();

        //close the quick view reverting the animation
        $('body').removeClass('overlay-layer');
        parentListItem.removeClass('empty-box');
        $('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
            "top": topSelected,
            "left": leftSelected,
            "width": widthSelected,
        });


    }

});
