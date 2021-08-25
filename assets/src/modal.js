// Class: Modal
class Modal {
    constructor(modalId) {
        this.id = modalId;
        this.target = document.getElementById( modalId );
    }

    open() {
        this.target.classList.add( 'active' );
    }

    close() {
        this.target.classList.remove( 'active' );
    }
}


// Init
const btns = document.querySelectorAll('[data-modal]'),
      modals = {};

btns.forEach(function (el) {
    const modalId = el.dataset.modal;

    // Init class with modal id.
    modals[ modalId ] = new Modal( modalId );

    // Add click events.
    el.addEventListener('click', function () {
        modals[ modalId ].open();
    });

    // Close button.
    closeBtn = document.querySelectorAll( '#' + modalId + ' .close' )[0];
    closeBtn.addEventListener('click', function () {
        modals[ modalId ].close();
    });
});
