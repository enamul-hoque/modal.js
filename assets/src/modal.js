class Modal {
    constructor(modalId) {
        this.modalId = modalId;
    }

    open() {
        document.getElementById( this.modalId ).classList.toggle( 'active' );
    }
}

const modal = new Modal('messageBox');

const btns = document.querySelectorAll('[data-modal]');

btns[0].addEventListener('click', function () {
    modal.open();
});
