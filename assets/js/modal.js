/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Class: Modal
var Modal = /*#__PURE__*/function () {
  function Modal(modalId) {
    _classCallCheck(this, Modal);

    this.id = modalId;
    this.target = document.getElementById(modalId);
  }

  _createClass(Modal, [{
    key: "open",
    value: function open() {
      this.target.classList.add('active');
    }
  }, {
    key: "close",
    value: function close() {
      this.target.classList.remove('active');
    }
  }]);

  return Modal;
}(); // Init


var btns = document.querySelectorAll('[data-modal]'),
    modals = {};
btns.forEach(function (el) {
  var modalId = el.dataset.modal; // Init class with modal id.

  modals[modalId] = new Modal(modalId); // Add click events.

  el.addEventListener('click', function () {
    modals[modalId].open();
  }); // Close button.

  closeBtn = document.querySelectorAll('#' + modalId + ' .close')[0];
  closeBtn.addEventListener('click', function () {
    modals[modalId].close();
  });
});
/******/ })()
;