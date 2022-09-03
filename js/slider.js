// Debounce
function debounce(func, ms) {
  let isFuncProcessing = false;
  return function () {
    if (isFuncProcessing) return;

    func.apply(this, arguments);

    isFuncProcessing = true;
    setTimeout(() => {
      isFuncProcessing = false;
    }, ms);
  };
}

class Slider {
  #arrowBtnLeft = document.querySelectorAll(".arrow-btn")[0];
  #arrowBtnRight = document.querySelectorAll(".arrow-btn")[1];
  // Cлайдер
  #slider = document.querySelector(".slider");
  // Элементы слайдера
  #sliderItems = document.querySelectorAll(".slider__item");
  // Первый элемент слайдера
  #firstSliderItem = this.#sliderItems[0];
  // Последний элемент слайдера
  #lastSliderItem = this.#sliderItems[this.#sliderItems.length - 1];
  // Кружки
  #dots = document.querySelectorAll(".dot");

  /***
   * Кол-во элементов в слайдере.
   * Нужно для того чтобы следить, когда мы находимся на последнем или на первом элементе
   */
  #countItems = this.#sliderItems.length;
  // Индекс текущего элемента
  #activeIndex = 0;
  // Ширина элемента в слайдере
  #sliderElemWidth = document.querySelectorAll(".slider__item")[0].offsetWidth;
  /**
   * Из-за того, что мы будем добавлять фиктивные элементы в слайдер.
   * Наш первоначальный сдвиг(translateX), будет равняться ширине слайдера
   * Чтобы узнать, что будет показываться, если мы так не сделаем. Поставте position=0 и увидите;
   */
  #position = this.#sliderElemWidth;
  #startingPosition = this.#sliderElemWidth;

  #touchstartX = 0;
  #offsetedX = 0;
  #movingDirection;
  #isCaptured = false;

  constructor() {
    /**
     * Убираем анимацию по умолчанию написанную в css.
     * Иначе, при открытии страницы у нас будет анимация сдвига влево
     */
    this.#slider.style.transition = "none";
    /**
     * Сразу двигаем слайдер на один элемент и это не будет видно пользователю.
     * потому что мы поставили transition: none
     */
    this.#slider.style.transform = `translateX(-${this.#position}px)`;
    //Вставляем фиктивный последний элемент перед первым
    this.#slider.insertAdjacentElement(
      "afterbegin",
      this.#lastSliderItem.cloneNode(true)
    );
    //Вставляем фиктивный первый элемент после последнего
    this.#slider.insertAdjacentElement(
      "beforeend",
      this.#firstSliderItem.cloneNode(true)
    );

    window.addEventListener("resize", this.#onWindowResize);

    //События для кнопок
    this.#arrowBtnRight.addEventListener(
      "click",
      debounce(this.#onRightBtnClick, 300)
    );
    this.#arrowBtnLeft.addEventListener(
      "click",
      debounce(this.#onLeftBtnClick, 300)
    );

    //События для прокрутки слайдера
    this.#slider.addEventListener("touchstart", this.#touchStart);
    this.#slider.addEventListener("touchmove", this.#onTouchMove);
    this.#slider.addEventListener("touchend", this.#onRelease);
    this.#slider.addEventListener("mousedown", this.#onMouseDown);
    this.#slider.addEventListener("mousemove", this.#onMouseMove);
    this.#slider.addEventListener("mouseup", this.#onRelease);
  }

  set captured(value) {
    this.#isCaptured = value;
  }

  get captured() {
    return this.#isCaptured;
  }

  set touchStartX(value) {
    this.#touchstartX = value;
  }

  get touchStartX() {
    return this.#touchstartX;
  }

  set currentIndex(value) {
    this.#activeIndex = value;
  }

  get currentIndex() {
    return this.#activeIndex;
  }

  set initialPosition(value) {
    this.#startingPosition = value;
  }

  get initialPosition() {
    return this.#startingPosition;
  }

  set currentPosition(value) {
    this.#position = value;
  }

  get currentPosition() {
    return this.#position;
  }

  set slideWidth(value) {
    this.#sliderElemWidth = value;
  }

  get slideWidth() {
    return this.#sliderElemWidth;
  }

  set offsetX(value) {
    this.#offsetedX = value;
  }

  get offsetX() {
    return this.#offsetedX;
  }

  set slidingDirection(value) {
    this.#movingDirection = value;
  }

  get slidingDirection() {
    return this.#movingDirection;
  }

  #onWindowResize = () => {
    this.currentPosition = window.innerWidth * (this.currentIndex + 1);
    this.initialPosition = this.currentPosition;
    this.slideWidth = document.querySelectorAll(".slider__item")[0].offsetWidth;
    this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
  };

  #touchStart = (e) => {
    this.#slider.style.transition = "transform 0.1s ease-out";
    this.touchStartX = e.changedTouches[0].pageX;
  };

  #onMove = (currentX) => {
    if (currentX < this.touchStartX) {
      if (this.slidingDirection === "right") {
        this.offsetX = -this.offsetX;
      }
      this.offsetX += this.touchStartX - currentX;
      this.currentPosition += this.touchStartX - currentX;
      this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
      this.slidingDirection = "left";
    } else if (currentX > this.touchStartX) {
      if (this.slidingDirection === "left") {
        this.offsetX = -this.offsetX;
      }
      this.offsetX += currentX - this.touchStartX;
      this.currentPosition -= currentX - this.touchStartX;
      this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
      this.slidingDirection = "right";
    }
    this.touchStartX = currentX;
  };

  #onTouchMove = (e) => {
    const currentX = e.changedTouches[0].pageX;
    this.#onMove(currentX);
  };

  #onRelease = () => {
    this.#isCaptured = false;
    //Для плавности анимации ставим анимацию долистывания 300мс
    this.#slider.style.transition = "transform .3s ease-out";
    let moveTo = this.slideWidth - this.offsetX;
    if (this.slidingDirection === "left") {
      if (this.offsetX > this.slideWidth / 7) {
        this.currentPosition += moveTo;
        this.currentIndex += 1;
        if (this.currentIndex === this.#countItems) {
          this.slideLastElementForward();
        } else {
          this.switchActiveCircleOnForward();
        }
      } else {
        // если пролистали меньше, чем на 1/7 экрана возвращаем на место
        this.currentPosition = this.initialPosition;
      }
    } else if (this.slidingDirection === "right") {
      if (this.offsetX > this.slideWidth / 7) {
        this.currentPosition -= moveTo;
        this.currentIndex -= 1;

        if (this.currentIndex === -1) {
          this.slideLastElementBack();
        } else {
          this.switchActiveCircleOnBack();
        }
      } else if (this.offsetX <= this.slideWidth / 7) {
        // если пролистали меньше, чем на 1/7 экрана возвращаем на место
        this.currentPosition = this.initialPosition;
      }
    }
    this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
    this.initialPosition = this.currentPosition;
    this.offsetX = 0;
  };

  #onMouseDown = (e) => {
    this.#slider.style.transition = "transform 0.1s ease-out";
    this.captured = true;
    this.touchStartX = e.pageX;
  };

  #onMouseMove = (e) => {
    if (this.#isCaptured) {
      const currentX = e.pageX;
      this.#onMove(currentX);
    }
  };

  #onRightBtnClick = () => {
    // Индекс следуещего активного элемента
    this.currentIndex = this.currentIndex + 1;

    // Если мы находимся на последнем элементе
    if (this.currentIndex === this.#countItems) {
      this.slideLastElementForward();
    } else {
      this.#slider.style.transition = "transform .3s";
      // запоминаем позицию с шириной, на которую мы будем сдвигать слайдер
      this.currentPosition = this.currentPosition + this.#sliderElemWidth;
      // Двигаем слайдер, анимируется он с помощью transition
      this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;

      this.initialPosition = this.currentPosition;

      this.switchActiveCircleOnForward();
    }
  };

  #onLeftBtnClick = () => {
    // Индекс следуещего активного элемента
    this.currentIndex = this.currentIndex - 1;
    // Если мы нажали на стрелку влево тогда, когда мы находимся на первом элементе
    if (this.currentIndex === -1) {
      this.slideLastElementBack();
    } else {
      this.#slider.style.transition = "transform .3s";
      // запоминаем позицию с шириной, на которую мы будем сдвигать слайдер
      this.currentPosition -= this.#sliderElemWidth;
      // Двигаем слайдер, анимируется он с помощью transition
      this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
      // Делаем кружок активным
      this.switchActiveCircleOnBack();
      this.initialPosition = this.currentPosition;
    }
  };

  slideLastElementBack = () => {
    /**
     * По умолчанию у нас transition: none
     * Чтобы показать анимацию, нужно указать transform явно.
     */
    this.#slider.style.transition = "transform .3s";
    // Двигаем слайдер к фиктивному элементу
    this.#slider.style.transform = `translateX(0px)`;

    this.currentIndex = this.#countItems - 1;
    this.#dots[this.currentIndex].classList.add("dot--active");
    this.#dots[0].classList.remove("dot--active");

    /**
     * Анимация прокрутки длиться 300мс. Это мы указываем в нашем коде.
     * slider.style.transform = 'transform .3s'
     */
    setTimeout(() => {
      // Чтобы сделать прокрутку до настоящего элемента незаметной, убираем transition
      this.#slider.style.transition = "none";
      /**
       * countItems сейчас равно 5. Чтобы переместиться на настоящий элемент.
       * Надо с позиции первого настящего элемента сдвинуть слайдер в 5 раз.
       */
      this.currentPosition = this.slideWidth * this.#countItems;
      // Двигаем слайдер до настоящего последнего элемента
      this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
      this.initialPosition = this.currentPosition;
    }, 300);
  };

  slideLastElementForward = () => {
    this.#slider.style.transition = "transform .3s";
    // Меняем инедкс на 0, чтобы в кружочках показывать перый активный элемент
    this.currentIndex = 0;
    // Двигаем слайдер к фиктивному элементу
    this.#slider.style.transform = `translateX(-${
      this.currentPosition + this.slideWidth
    }px)`;
    // Делаем первый кружок активным
    this.#dots[0].classList.add("dot--active");
    // Удаляем активность с последнего кружка
    this.#dots[this.#countItems - 1].classList.remove("dot--active");

    /**
     * Анимация прокрутки длиться 300мс. Это мы указываем в нашем коде.
     * slider.style.transform = 'transform .3s'
     * Чтобы сдвинуть слайдер к настоящему элементу незаметно для пользователя,
     * Возвращаем значения по умалчанию.
     */
    setTimeout(() => {
      this.currentPosition = this.slideWidth;
      this.#slider.style.transition = "none";
      this.#slider.style.transform = `translateX(-${this.currentPosition}px)`;
      this.initialPosition = this.currentPosition;
    }, 300);
  };

  switchActiveCircleOnForward = () => {
    // Делаем кружок активным
    this.#dots[this.currentIndex].classList.add("dot--active");
    // Удаляем активность с предыдущего кружка
    this.#dots[this.currentIndex - 1].classList.remove("dot--active");
  };

  switchActiveCircleOnBack = () => {
    // Делаем кружок активным
    this.#dots[this.currentIndex].classList.add("dot--active");
    // Удаляем активность с предыдущего кружка
    this.#dots[this.currentIndex + 1].classList.remove("dot--active");
  };
}

new Slider();
