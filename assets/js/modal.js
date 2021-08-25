/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Modal = /*#__PURE__*/function () {
  function Modal(modalId) {
    _classCallCheck(this, Modal);

    this.modalId = modalId;
  }

  _createClass(Modal, [{
    key: "open",
    value: function open() {
      document.getElementById(this.modalId).classList.toggle('active');
    }
  }]);

  return Modal;
}();

var modal = new Modal('messageBox');
var btns = document.querySelectorAll('[data-modal]');
btns[0].addEventListener('click', function () {
  modal.open();
});
/******/ })()
;