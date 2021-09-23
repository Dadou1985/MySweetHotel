window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    var button = document.querySelector('#btnInstall');
    button.removeAttribute('hidden');
    button.addEventListener('click', () => {
        event.prompt();
        button.setAttribute('disabled', true);
    });
});