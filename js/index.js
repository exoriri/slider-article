// Стрелочки, чтобы крутить слайдер
const arrowBtnLeft = document.querySelectorAll('.arrow-btn')[0];
const arrowBtnRight = document.querySelectorAll('.arrow-btn')[1];
// Cлайдер
const slider = document.querySelector('.slider');
// Элементы слайдера
const sliderItems = document.querySelectorAll('.slider__item');
// Первый элемент слайдера
const firstSliderItem = sliderItems[0];
// Последний элемент слайдера
const lastSliderItem = sliderItems[sliderItems.length - 1];
// Кружки
const dots = document.querySelectorAll('.dot');

/*** 
 * Кол-во элементов в слайдере. 
 * Нужно для того чтобы следить, когда мы находимся на последнем или на первом элементе
*/
let countItems = sliderItems.length;
// Индекс текущего элемента
let activeIndex = 0;
// Ширина элемента в слайдере
let sliderElemWidth = document.querySelectorAll('.slider__item')[0].offsetWidth;
/**
 * Из-за того, что мы будем добавлять фиктивные элементы в слайдер. 
 * Наш первоначальный сдвиг(translateX), будет равняться ширине слайдера
 * Чтобы узнать, что будет показываться, если мы так не сделаем. Поставте position=0 и увидите;
*/
let position = sliderElemWidth;
/**
 * Убираем анимацию по умолчанию написанную в css.
 * Иначе, при открытии страницы у нас будет анимация сдвига влево
*/
slider.style.transition = 'none';
/**
 * Сразу двигаем слайдер на один элемент и это не будет видно пользователю.
 * потому что мы поставили transition: none
*/
slider.style.transform = `translateX(-${position}px)`;
//Вставляем фиктивный последний элемент перед первым
slider.insertAdjacentElement('afterbegin', lastSliderItem.cloneNode(true));
//Вставляем фиктивный первый элемент после последнего
slider.insertAdjacentElement('beforeend', firstSliderItem.cloneNode(true));

const onRightBtnClick = () => {
    // Индекс следуещего активного элемента
    activeIndex += 1;
    // Если мы находимся на последнем элементе
    if (activeIndex === countItems) {
        slider.style.transition = 'transform .3s';
        // Меняем инедкс на 0, чтобы в кружочках показывать перый активный элемент 
        activeIndex = 0;
        // Двигаем слайдер к фиктивному элементу
        slider.style.transform = `translateX(-${position + sliderElemWidth}px)`;
        // Делаем первый кружок активным
        dots[0].classList.add('dot--active');
        // Удаляем активность с последнего кружка
        dots[countItems - 1].classList.remove('dot--active');
        
        /**
         * Анимация прокрутки длиться 300мс. Это мы указываем в нашем коде.
         * slider.style.transform = 'transform .3s'
         * Чтобы сдвинуть слайдер к настоящему элементу незаметно для пользователя,
         * Возвращаем значения по умалчанию.
        */
        setTimeout(() => {
            position = sliderElemWidth;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(-${position}px)`;
        },300);

    } else {
        slider.style.transition = 'transform .3s';
        // запоминаем позицию с шириной, на которую мы будем сдвигать слайдер
        position += sliderElemWidth;
        // Двигаем слайдер, анимируется он с помощью transition
        slider.style.transform = `translateX(-${position}px)`;
        // Делаем кружок активным
        dots[activeIndex].classList.add('dot--active');
        // Удаляем активность с предыдущего кружка
        dots[activeIndex-1].classList.remove('dot--active');
    }
};

const onLeftBtnClick = () => {
    // Индекс следуещего активного элемента
    activeIndex -= 1;
    // Если мы нажали на стрелку влево тогда, когда мы находимся на первом элементе
    if (activeIndex === -1) {
        /**
         * По умолчанию у нас transition: none
         * Чтобы показать анимацию, нужно указать transform явно.
         */
        slider.style.transition = 'transform .3s';
        // Двигаем слайдер к фиктивному элементу
        slider.style.transform = `translateX(0px)`;

        activeIndex = countItems - 1;
        dots[activeIndex].classList.add('dot--active');
        dots[0].classList.remove('dot--active');

        /**
         * Анимация прокрутки длиться 300мс. Это мы указываем в нашем коде.
         * slider.style.transform = 'transform .3s'
        */
        setTimeout(() => {
            // Чтобы сделать прокрутку до настоящего элемента незаметной, убираем transition
            slider.style.transition = 'none';
            /**
             * countItems сейчас равно 5. Чтобы переместиться на настоящий элемент. 
             * Надо с позиции первого настящего элемента сдвинуть слайдер в 5 раз.
            */
            position = sliderElemWidth * countItems;
            // Двигаем слайдер до настоящего последнего элемента
            slider.style.transform = `translateX(-${position}px)`;
        },300);

    } else {
        slider.style.transition = 'transform .3s';
        // запоминаем позицию с шириной, на которую мы будем сдвигать слайдер
        position -= sliderElemWidth;
        // Двигаем слайдер, анимируется он с помощью transition
        slider.style.transform = `translateX(-${position}px)`;
        // Делаем кружок активным
        dots[activeIndex].classList.add('dot--active');
        // Удаляем активность с предыдущего кружка
        dots[activeIndex+1].classList.remove('dot--active');
    }
};

// Событие по нажитию на кнопку справа
arrowBtnRight.addEventListener('click', debounce(onRightBtnClick, 300));
// Событие по нажатию на кнопку слева
arrowBtnLeft.addEventListener('click', debounce(onLeftBtnClick, 300));

// Debounce
function debounce(func, ms) {
    let isFuncProcessing = false;
    return function() {
        if (isFuncProcessing) return;

        func.apply(this, arguments);

        isFuncProcessing = true;
        setTimeout(() => {
            isFuncProcessing = false;
        }, ms)
    }
}