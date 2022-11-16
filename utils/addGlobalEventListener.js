/**
 *
 * @param {string} type Different events. E.g. click
 * @param {string} selector Element to be selected
 * @param {function} callback Callback function with its event (e)
 * @returns EventListener
 */
const addGlobalEventListener = function (type, selector, callback) {
  document.addEventListener(type, function (e) {
    if (e.target.matches(selector)) callback(e);
  });
};

export default addGlobalEventListener;
