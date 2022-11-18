import parceDate from './parceDate';
import elementCreator from './elementCreator';

export default class Messenger {
  constructor() {
    this.messenger = document.querySelector('.messenger-wrapper');
    this.message = {};
    this.popower = null;
    this.addListenersToPage = this.addListenersToPage.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.handleGetPositionError = this.handleGetPositionError.bind(this);
  }

  init() {
    this.addListenersToPage();
    this.getMessagesFromLocalStorage();
  }

  addListenersToPage() {
    const messageForm = document.querySelector('.messenger__new-message-form');
    messageForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.message.text = messageForm[0].value;
      this.message.date = `${parceDate(Date.now())}`;
      // eslint-disable-next-line prefer-destructuring
      this.button = messageForm[1];
      this.button.setAttribute('disabled', '');
      navigator.geolocation.getCurrentPosition(this.getPosition, this.handleGetPositionError);
    });

    const cancelButton = document.querySelector('.geo-fail__cancel');
    cancelButton.addEventListener('click', () => {
      const geoFailWrapper = document.querySelector('.geo-fail-wrapper');
      const geoFailTextarea = geoFailWrapper.querySelector('.geo-fail__textarea');
      geoFailTextarea.value = '';
      geoFailWrapper.classList.add('invisible');
      this.popower.classList.add('invisible');
    });

    const geoFailForm = document.querySelector('.geo-fail');
    geoFailForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      let coords = evt.target[0].value;
      const reg = /^(((\[{0,1}-{0,1}\d{1,2})|(\[{0,1}-{0,1}1[0-7]\d{1}))\.\d{1,8}),\s{0,1}-{0,1}((1[0-7]\d{1})|(\d{1,2}))\.\d{1,8}(\]{0,1}$)/;
      if (reg.test(coords)) {
        coords = coords.replace('[', '');
        coords = coords.replace(']', '');
        coords = coords.replace(', ', ',');
        coords = coords.replace(',', ', ');
        this.message.coords = `[${coords}]`;
        this.localstorageSetter('messages', this.message);
        this.postMessage(this.message);
        this.popower.classList.add('invisible');
        const geoFailWrapper = document.querySelector('.geo-fail-wrapper');
        geoFailWrapper.classList.add('invisible');
        const messageArea = this.messenger.querySelector('.messenger__new-message-textarea');
        messageArea.value = '';
      } else {
        // eslint-disable-next-line no-unused-expressions
        this.popower === null ? this.createGeoFailPopower() : this.popower.classList.remove('invisible');
      }
    });
    const geoFailTextarea = document.querySelector('.geo-fail__textarea');
    geoFailTextarea.addEventListener('keydown', () => {
      if (this.popower) {
        this.popower.classList.add('invisible');
      }
    });
  }

  postMessage(message) {
    const messageArea = this.messenger.querySelector('.messenger__messages');
    const newMessage = elementCreator('div', 'messenger__message');
    const date = elementCreator('div', 'messenger__message-data', message.date);
    const content = elementCreator('div', 'messenger__message-content', message.text);
    const coords = elementCreator('div', 'messenger__message-geo', message.coords);

    newMessage.appendChild(date);
    newMessage.appendChild(content);
    newMessage.appendChild(coords);
    messageArea.insertAdjacentElement('afterbegin', newMessage);
  }

  getPosition(position) {
    const { latitude, longitude } = position.coords;
    this.message.coords = `[${latitude}, ${longitude}]`;
    this.localstorageSetter('messages', this.message);
    this.postMessage(this.message);
    this.button.removeAttribute('disabled');
  }

  handleGetPositionError() {
    this.button.removeAttribute('disabled');
    const geoFailWrapper = document.querySelector('.geo-fail-wrapper');
    geoFailWrapper.classList.remove('invisible');
  }

  // eslint-disable-next-line class-methods-use-this
  localstorageSetter(key, obj) {
    const messages = JSON.parse(localStorage.getItem(key));
    if (messages === null) {
      const messagesArray = [obj];
      localStorage.setItem(key, JSON.stringify(messagesArray));
    } else {
      messages.push(obj);
      localStorage.setItem(key, JSON.stringify(messages));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  localStorageGetter(key) {
    const item = JSON.parse(localStorage.getItem(key));
    if (item === null) {
      return [];
    }
    return item;
  }

  getMessagesFromLocalStorage() {
    const messages = this.localStorageGetter('messages');
    for (let i = 0; i < messages.length; i += 1) {
      this.postMessage(messages[i]);
    }
  }

  createGeoFailPopower() {
    this.popower = elementCreator('div', 'geo-fail__popower-form');
    const popowerHeader = elementCreator('div', undefined, 'Такой геопозиции не существует');
    popowerHeader.style.backgroundColor = 'rgb(230, 230, 230)';
    popowerHeader.style.borderRadius = '5px 5px 0 0';
    popowerHeader.style.borderBottom = '1px solid rgb(58, 58, 58)';
    const popowerContent = elementCreator('div', undefined, 'Введите координаты в формате XX.XXXXXX, YY.YYYYYY');
    this.popower.appendChild(popowerHeader);
    this.popower.appendChild(popowerContent);

    const textarea = document.getElementsByClassName('geo-fail__textarea')[0];
    textarea.offsetParent.appendChild(this.popower);
    this.popower.style.top = `${textarea.offsetTop - this.popower.offsetHeight}px`;
    this.popower.style.left = `${textarea.offsetLeft + textarea.offsetWidth / 2 - this.popower.offsetWidth / 2}px`;
  }
}
