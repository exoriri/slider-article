const arrowBtnLeft = document.querySelectorAll('.arrow-btn')[0];
const arrowBtnRight = document.querySelectorAll('.arrow-btn')[1];
const slider = document.querySelector('.slider');
const sliderItems = document.querySelectorAll('.slider__item');
const dots = document.querySelectorAll('.dot');

let countItems = sliderItems.length;
let activeIndex = 0;
let position = 0;
let sliderElemWidth = document.querySelectorAll('.slider__item')[0].offsetWidth;

arrowBtnRight.addEventListener('click', function() {
    // const sliderItems = document.querySelectorAll('.slider__item');
    if (activeIndex === countItems - 1) {
        slider.style.transform = `translateX(-${position + sliderElemWidth}px)`;
        slider.appendChild(sliderItems[activeIndex].cloneNode(true));
        activeIndex = 0;
        dots[0].classList.add('dot--active');
        dots[countItems - 1].classList.remove('dot--active');

        setTimeout(() => {
            sliderItems.forEach((item, i) => {
                if (i < 5) {
                    item.remove();
                }
            });
            position = 0;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${0}px)`;
        },300);

    } else {
        slider.style.transition = 'transform .3s';
        position += sliderElemWidth;
        slider.style.transform = `translateX(-${position}px)`;
        slider.appendChild(sliderItems[activeIndex].cloneNode(true));
        activeIndex += 1;
        dots[activeIndex].classList.add('dot--active')
        dots[activeIndex-1].classList.remove('dot--active')
    }
});

arrowBtnLeft.addEventListener('click', function() {
    
});