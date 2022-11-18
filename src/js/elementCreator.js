export default function elementCreator(elem, className, textContent) {
  const element = document.createElement(elem);
  if (className !== undefined) {
    element.classList.add(className);
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element;
}
