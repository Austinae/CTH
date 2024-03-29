function NSlider(opts) {
    if (!Object.keys(opts).includes('elem')) {
        throw new Error('Slider element not given.');
    }

    this.prev = function () {
        prev();
    }

    this.next = function () {
        next();
    }

    var slider = opts.elem.querySelector('.nslider');
    if (!slider) {
        throw new Error('No slider found.');
    }

    var sliderWrapper = slider.querySelector('.nslider-wrapper');
    if (!sliderWrapper) {
        throw new Error('No slider wrapper found.');
    }

    var slides = sliderWrapper.querySelectorAll('.nslider-slide');
    if (!slides.length) {
        throw new Error('No slider slide found.');
    }

    var sliderButtonPrev = slider.querySelector('.nslider-button.nslider-button-prev');
    if (!sliderButtonPrev) {
        throw new Error('No previous slide button found.');
    }

    var sliderButtonNext = slider.querySelector('.nslider-button.nslider-button-next');
    if (!sliderButtonNext) {
        throw new Error('No next slide button found.');
    }

    sliderButtonPrev.innerHTML = opts.prevButtonInner ? opts.prevButtonInner :
        '<svg viewBox="0 0 100 100" version="1.1" ' +
        'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">\n' +
        '    <g transform="matrix(-0.42,0,0,0.84,71,8)">\n' +
        '        <path d="M85.921,50L-14.079,100L0,107.039L114.079,50L-0,-7.039L-14.079,0L85.921,50Z"/>\n' +
        '    </g>\n' +
        '</svg>';
    sliderButtonNext.innerHTML = opts.nextButtonInner ? opts.nextButtonInner :
        '<svg viewBox="0 0 100 100" version="1.1" ' +
        'style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">\n' +
        '    <g transform="matrix(0.42,0,0,0.84,29,8)">\n' +
        '        <path d="M85.921,50L-14.079,100L0,107.039L114.079,50L-0,-7.039L-14.079,0L85.921,50Z"/>\n' +
        '    </g>\n' +
        '</svg>';

    if (opts.dots && opts.dots == true) {
        var dotsDiv = document.createElement('div');
        dotsDiv.classList.add('nslider-dots');
        slider.appendChild(dotsDiv);
    }

    var currentSlide = (opts.currentSlide && typeof opts.currentSlide == 'number' &&
        opts.currentSlide > 0 && opts.currentSlide <= slides.length) ? Math.round(opts.currentSlide) - 1 : 0;
    var sliderWrapperWidth = slider.getBoundingClientRect().width * slides.length;
    var perSlideWidth = sliderWrapperWidth / slides.length;

    sliderWrapper.style.minWidth = sliderWrapperWidth + 'px';
    sliderWrapper.style.width = sliderWrapperWidth + 'px';
    sliderWrapper.style.maxWidth = sliderWrapperWidth + 'px';
    sliderWrapper.style.height = slider.getBoundingClientRect().height + 'px';
    if (opts.animation) {
        if (typeof opts.animation == 'boolean') {
            sliderWrapper.style.transition = 'left 0.3s linear';
        } else if (typeof opts.animation == 'object') {
            var duration = opts.animation.duration || 300;
            var timingFunction = opts.animation.timingFunction || 'linear';
            sliderWrapper.style.transition = 'left ' + duration + 'ms ' + timingFunction;
        }
    }

    slides.forEach(function (slide, index) {
        slide.style.width = perSlideWidth + 'px';

        if (opts.dots && opts.dots == true) {
            var dotDiv = document.createElement('div');
            dotDiv.classList.add('nslider-dot');
            dotDiv.dataset.index = index;
            if (currentSlide == index) {
                dotDiv.classList.add('active');
            }
            dotsDiv.appendChild(dotDiv);
        }
    });

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    if (currentSlide > slides.length - 1) {
        currentSlide = 0;
    }

    sliderWrapper.style.left = -(currentSlide) * perSlideWidth + 'px';

    function changeSlider() {
        sliderWrapper.style.left = -(currentSlide) * perSlideWidth + 'px';

        if (opts.dots && opts.dots == true) {
            var dots = slider.querySelectorAll('.nslider-dots .nslider-dot');
            dots.forEach(function (dot, index) {
                if (currentSlide == index) {
                    dot.classList.add('active');
                } else {
                    if (dot.classList.contains('active')) {
                        dot.classList.remove('active');
                    }
                }
            });
        }
    }

    function prev() {
        currentSlide--;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        changeSlider();
    }

    function next() {
        currentSlide++;
        if (currentSlide > slides.length - 1) currentSlide = 0;
        changeSlider();
    }

    sliderButtonPrev.addEventListener('click', prev);
    sliderButtonNext.addEventListener('click', next);
    sliderButtonPrev.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });
    sliderButtonNext.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });

    if (opts.dots && opts.dots == true) {
        var dots = slider.querySelectorAll('.nslider-dots .nslider-dot');
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function (e) {
                currentSlide = e.target.dataset.index;
                changeSlider();
            });
        });
    }

    if (opts.keyboardControl && opts.keyboardControl == true) {
        addEventListener('keydown', function (e) {
            if (e.key == 'ArrowLeft') {
                prev();
            }
            if (e.key == 'ArrowRight') {
                next();
            }
        });
    }

    addEventListener('resize', function () {
        sliderWrapperWidth = slider.getBoundingClientRect().width * slides.length;
        perSlideWidth = sliderWrapperWidth / slides.length;

        sliderWrapper.style.minWidth = sliderWrapperWidth + 'px';
        sliderWrapper.style.width = sliderWrapperWidth + 'px';
        sliderWrapper.style.maxWidth = sliderWrapperWidth + 'px';
        sliderWrapper.style.height = slider.getBoundingClientRect().height + 'px';

        slides.forEach(function (slide) {
            slide.style.width = perSlideWidth + 'px';
        });

        currentSlide = 0;
        changeSlider();
    });
}

addEventListener('resize',function(){sliderWrapperWidth=slider.getBoundingClientRect().width*slides.length;perSlideWidth=sliderWrapperWidth/slides.length;sliderWrapper.style.minWidth=sliderWrapperWidth+'px';sliderWrapper.style.width=sliderWrapperWidth+'px';sliderWrapper.style.maxWidth=sliderWrapperWidth+'px';sliderWrapper.style.height=slider.getBoundingClientRect().height+'px';slides.forEach(function(slide){slide.style.width=perSlideWidth+'px';});currentSlide=0;changeSlider();});