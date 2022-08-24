const slider = document.querySelector('.slider');
const sliderItemsText = slider.innerHTML;
let sliderItemsReversedText = ``;

for (let i = slider.children.length - 1; i >= 0; i--) {
    sliderItemsReversedText += slider.children[i].outerHTML;
};

const arrowBtnLeft = document.querySelectorAll('.arrow-btn')[0];
const arrowBtnRight = document.querySelectorAll('.arrow-btn')[1];
const sliderItems = document.querySelectorAll('.slider__item');
const dots = document.querySelectorAll('.dot');

let countItems = sliderItems.length;
let activeIndex = 0;
let position = 0;
let sliderElemWidth = document.querySelectorAll('.slider__item')[0].offsetWidth;

arrowBtnRight.addEventListener('click', function() {
    activeIndex += 1;

    if (activeIndex === countItems) {
        slider.style.transition = 'transform .3s';
        console.log(activeIndex)
        activeIndex = 0;
        slider.style.transform = `translateX(-${position + sliderElemWidth}px)`;
        slider.insertAdjacentElement('beforeend', sliderItems[activeIndex].cloneNode(true));
        dots[0].classList.add('dot--active');
        dots[countItems - 1].classList.remove('dot--active');
        
        setTimeout(() => {
            slider.innerHTML = sliderItemsText;
            position = 0;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(0px)`;
        },300);

    } else {
        slider.style.transition = 'transform .3s';
        position += sliderElemWidth;
        slider.style.transform = `translateX(-${position}px)`;
        dots[activeIndex].classList.add('dot--active')
        dots[activeIndex-1].classList.remove('dot--active');
    }
});

arrowBtnLeft.addEventListener('click', function() {
    activeIndex -= 1;
    if (activeIndex === -1) {
        slider.style.transition = 'transform .3s';
        slider.style.transform = `translateX(${position+sliderElemWidth}px)`;
        slider.insertAdjacentElement('afterbegin', sliderItems[countItems-1].cloneNode(true));
        setTimeout(() => {
            slider.innerHTML = sliderItemsReversedText;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(0px)`;
        },300);
        activeIndex = countItems - 1;
        dots[activeIndex].classList.add('dot--active');
        dots[0].classList.remove('dot--active');
    } else {
        slider.insertAdjacentElement('afterbegin', sliderItems[countItems-1].cloneNode(true));
        position += sliderElemWidth;
        slider.style.transform = `translateX(+${position}px)`;
        // slider.style.transform = `translateX(${position}px)`;
        sliderItems[countItems-1].remove();
        // dots[activeIndex].classList.add('dot--active')
        // dots[activeIndex+1].classList.remove('dot--active')
    }
});