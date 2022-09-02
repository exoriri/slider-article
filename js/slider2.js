// Стрелочки, чтобы крутить слайдер
const arrowBtnLeft = document.querySelectorAll(".arrow-btn")[0];
const arrowBtnRight = document.querySelectorAll(".arrow-btn")[1];
// Cлайдер
const slider = document.querySelector(".slider");
// Элементы слайдера
const sliderItems = document.querySelectorAll(".slider__item");
// Первый элемент слайдера
const firstSliderItem = sliderItems[0];
// Последний элемент слайдера
const lastSliderItem = sliderItems[sliderItems.length - 1];
// Кружки
const dots = document.querySelectorAll(".dot");

/***
 * Кол-во элементов в слайдере.
 * Нужно для того чтобы следить, когда мы находимся на последнем или на первом элементе
 */
let countItems = sliderItems.length;
// Индекс текущего элемента
let activeIndex = 0;
// Ширина элемента в слайдере
let sliderElemWidth = document.querySelectorAll(".slider__item")[0].offsetWidth;
/**
 * Из-за того, что мы будем добавлять фиктивные элементы в слайдер.
 * Наш первоначальный сдвиг(translateX), будет равняться ширине слайдера
 * Чтобы узнать, что будет показываться, если мы так не сделаем. Поставте position=0 и увидите;
 */
let position = sliderElemWidth;
let startingPosition = sliderElemWidth;

let touchstartX = 0;
let offsetedX = 0;
let movingDirection;


/**
 * Убираем анимацию по умолчанию написанную в css.
 * Иначе, при открытии страницы у нас будет анимация сдвига влево
 */
slider.style.transition = "none";
/**
 * Сразу двигаем слайдер на один элемент и это не будет видно пользователю.
 * потому что мы поставили transition: none
 */
slider.style.transform = `translateX(-${position}px)`;
//Вставляем фиктивный последний элемент перед первым
slider.insertAdjacentElement("afterbegin", lastSliderItem.cloneNode(true));
//Вставляем фиктивный первый элемент после последнего
slider.insertAdjacentElement("beforeend", firstSliderItem.cloneNode(true));

window.addEventListener('resize', function() {
    position = this.window.innerWidth * (activeIndex + 1);
    startingPosition = position;
    sliderElemWidth = document.querySelectorAll(".slider__item")[0].offsetWidth;
    slider.style.transform = `translateX(-${position}px)`;
})

const slideLastElementForward = () => {
  slider.style.transition = "transform .3s";
  // Меняем инедкс на 0, чтобы в кружочках показывать перый активный элемент
  activeIndex = 0;
  // Двигаем слайдер к фиктивному элементу
  slider.style.transform = `translateX(-${position + sliderElemWidth}px)`;
  // Делаем первый кружок активным
  dots[0].classList.add("dot--active");
  // Удаляем активность с последнего кружка
  dots[countItems - 1].classList.remove("dot--active");

  /**
   * Анимация прокрутки длиться 300мс. Это мы указываем в нашем коде.
   * slider.style.transform = 'transform .3s'
   * Чтобы сдвинуть слайдер к настоящему элементу незаметно для пользователя,
   * Возвращаем значения по умалчанию.
   */
  setTimeout(() => {
    position = sliderElemWidth;
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${position}px)`;
    startingPosition = position;
  }, 300);
};

const slideLastElementBack = () => {
  /**
   * По умолчанию у нас transition: none
   * Чтобы показать анимацию, нужно указать transform явно.
   */
  slider.style.transition = "transform .3s";
  // Двигаем слайдер к фиктивному элементу
  slider.style.transform = `translateX(0px)`;

  activeIndex = countItems - 1;
  dots[activeIndex].classList.add("dot--active");
  dots[0].classList.remove("dot--active");

  /**
   * Анимация прокрутки длиться 300мс. Это мы указываем в нашем коде.
   * slider.style.transform = 'transform .3s'
   */
  setTimeout(() => {
    // Чтобы сделать прокрутку до настоящего элемента незаметной, убираем transition
    slider.style.transition = "none";
    /**
     * countItems сейчас равно 5. Чтобы переместиться на настоящий элемент.
     * Надо с позиции первого настящего элемента сдвинуть слайдер в 5 раз.
     */
    position = sliderElemWidth * countItems;
    // Двигаем слайдер до настоящего последнего элемента
    slider.style.transform = `translateX(-${position}px)`;
    startingPosition = position;
  }, 300);
};

const switchActiveCircleOnForward = () => {
  // Делаем кружок активным
  dots[activeIndex].classList.add("dot--active");
  // Удаляем активность с предыдущего кружка
  dots[activeIndex - 1].classList.remove("dot--active");
};

const switchActiveCircleOnBack = () => {
  // Делаем кружок активным
  dots[activeIndex].classList.add("dot--active");
  // Удаляем активность с предыдущего кружка
  dots[activeIndex + 1].classList.remove("dot--active");
};

const onRightBtnClick = () => {
  // Индекс следуещего активного элемента
  activeIndex += 1;
  // Если мы находимся на последнем элементе
  if (activeIndex === countItems) {
    slideLastElementForward();
  } else {
    slider.style.transition = "transform .3s";
    // запоминаем позицию с шириной, на которую мы будем сдвигать слайдер
    position += sliderElemWidth;
    // Двигаем слайдер, анимируется он с помощью transition
    slider.style.transform = `translateX(-${position}px)`;

    startingPosition = position;

    switchActiveCircleOnForward();
  }
  console.log("я позитион на кнопку вправо", position);
};

const onLeftBtnClick = () => {
  // Индекс следуещего активного элемента
  activeIndex -= 1;
  // Если мы нажали на стрелку влево тогда, когда мы находимся на первом элементе
  if (activeIndex === -1) {
    slideLastElementBack();
  } else {
    slider.style.transition = "transform .3s";
    // запоминаем позицию с шириной, на которую мы будем сдвигать слайдер
    position -= sliderElemWidth;
    // Двигаем слайдер, анимируется он с помощью transition
    slider.style.transform = `translateX(-${position}px)`;
    // Делаем кружок активным
    switchActiveCircleOnBack();
    startingPosition = position;
  }
};

function moveOnTouch(e) {
  const currentX = e.changedTouches[0].pageX;
  if (currentX < touchstartX) {
    offsetedX += touchstartX - currentX;
    position += touchstartX - currentX;
    slider.style.transform = `translateX(-${position}px)`;
    movingDirection = "left";
  } else if (currentX > touchstartX) {
    offsetedX += currentX - touchstartX;
    position -= currentX - touchstartX;
    slider.style.transform = `translateX(-${position}px)`;
    movingDirection = "right";
  }

  touchstartX = e.changedTouches[0].pageX;
}

function touchStart(e) {
  slider.style.transition = "transform 0.1s ease-out";
  touchstartX = e.changedTouches[0].pageX;
}

function onRelease() {
  //Для плавности анимации ставим анимацию долистывания 300мс
  slider.style.transition = "transform 0.3s ease-out";

  let moveTo = sliderElemWidth - offsetedX;

  if (movingDirection === "left") {
    if (offsetedX > sliderElemWidth / 7) {
      position += moveTo;
      activeIndex += 1;

      if (Math.abs(position - startingPosition) !== sliderElemWidth) {
        position = position - (position - startingPosition);
        activeIndex -= 1;
        slider.style.transform = `translateX(-${position}px)`;
        offsetedX = 0;
        startingPosition = position;
        return;
      }

      if (activeIndex === countItems) {
        slideLastElementForward();
      } else {
        switchActiveCircleOnForward();
      }
    } else {
      // если пролистали меньше, чем до середины возвращаем на место
      position = startingPosition;
    }
  } else if (movingDirection === "right") {
    if (offsetedX > sliderElemWidth / 7) {
      position -= moveTo;
      activeIndex -= 1;
      // Отслеживаем погрешности в вычислениях.
      // Бывает такое, что отступ встает не ровно. Потому что двигаем слайдер туда-сюда
      if (Math.abs(position - startingPosition) !== sliderElemWidth) {
        position = position - (position - startingPosition);
        slider.style.transform = `translateX(-${position}px)`;
        offsetedX = 0;
        startingPosition = position;
        activeIndex += 1;
        return;
      }

      if (activeIndex === -1) {
        slideLastElementBack();
      } else {
        switchActiveCircleOnBack();
      }
    } else if (offsetedX <= sliderElemWidth / 7) {
      position = startingPosition;
    }
  }

  slider.style.transform = `translateX(-${position}px)`;

  startingPosition = position;
  offsetedX = 0;
}

// Событие по нажитию на стрелку справа
arrowBtnRight.addEventListener("click", debounce(onRightBtnClick, 300));
// Событие по нажатию на стрелку слева
arrowBtnLeft.addEventListener("click", debounce(onLeftBtnClick, 300));


slider.addEventListener("touchstart", touchStart);

slider.addEventListener("touchmove", moveOnTouch);

slider.addEventListener("touchend", onRelease);

slider.addEventListener("mouseDown", (e) => {});