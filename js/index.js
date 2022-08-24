const slider = document.querySelector('.slider');
const sliderItemsText = slider.innerHTML;
let sliderItemsReversedText = ``;

for (let i = slider.children.length - 1; i >= 0; i--) {
    sliderItemsReversedText += slider.children[i].outerHTML;
};

const arrowBtnLeft = document.querySelectorAll('.arrow-btn')[0];
const arrowBtnRight = document.querySelectorAll('.arrow-btn')[1];
const sliderItems = document.querySelectorAll('.slider__item');
const firstSliderItem = sliderItems[0];
const lastSliderItem = sliderItems[sliderItems.length - 1];
const dots = document.querySelectorAll('.dot');

let countItems = sliderItems.length;
let activeIndex = 0;
let sliderElemWidth = document.querySelectorAll('.slider__item')[0].offsetWidth;
let position = sliderElemWidth;

slider.style.transform = `translateX(-${position}px)`;
slider.insertAdjacentElement('afterbegin', lastSliderItem.cloneNode(true));
slider.insertAdjacentElement('beforeend', firstSliderItem.cloneNode(true));

const onRightBtnClick = () => {
    activeIndex += 1;

    if (activeIndex === countItems) {
        slider.style.transition = 'transform .3s';
        console.log(activeIndex)
        activeIndex = 0;
        slider.style.transform = `translateX(-${position + sliderElemWidth}px)`;
        dots[0].classList.add('dot--active');
        dots[countItems - 1].classList.remove('dot--active');
        
        setTimeout(() => {
            // slider.innerHTML = sliderItemsText;
            position = sliderElemWidth;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${position}px)`;
        },300);

    } else {
        slider.style.transition = 'transform .3s';
        position += sliderElemWidth;
        slider.style.transform = `translateX(-${position}px)`;
        dots[activeIndex].classList.add('dot--active')
        dots[activeIndex-1].classList.remove('dot--active');
    }
};

const onLeftBtnClick = () => {
    activeIndex -= 1;
    if (activeIndex === -1) {
        slider.style.transition = 'transform .3s';
        //due to our default position value is sliderElemWidth, but our last element is actually hidden first element we put 0px to show it
        slider.style.transform = `translateX(0px)`;
        setTimeout(() => {
            slider.style.transition = 'none';
            position = sliderElemWidth * countItems - 2;
            slider.style.transform = `translateX(-${position}px)`;
        },300);
        activeIndex = countItems - 1;
        dots[activeIndex].classList.add('dot--active');
        dots[0].classList.remove('dot--active');
    } else {
        slider.style.transition = 'transform .3s';
        position -= sliderElemWidth;
        slider.style.transform = `translateX(-${position}px)`;
        dots[activeIndex].classList.add('dot--active')
        dots[activeIndex+1].classList.remove('dot--active')
    }
};

arrowBtnRight.addEventListener('click', debounce(onRightBtnClick, 300));
arrowBtnLeft.addEventListener('click', debounce(onLeftBtnClick, 300));

function debounce(func, ms) {
    let isFuncProcessing = false
    return function() {
        if (isFuncProcessing) return;

        func.apply(this, arguments);

        isFuncProcessing = true;
        setTimeout(() => {
            isFuncProcessing = false;
        }, ms)
    }
}