//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
})



function CopyCodeButton($module) {
  this.$module = $module;
}

CopyCodeButton.prototype.init = function () {
  if (!this.$module) {
    return;
  }

  this.$module.addEventListener('click', (event) => {
    event.preventDefault();
    let code;
    this.$module.textContent = 'Code copied';
    setTimeout(() => {
      this.$module.textContent = 'Copy code';
    }, 2000);
    navigator.clipboard.writeText(this.$module.dataset.copyText);
  });
};

document.querySelectorAll('.app-example__copy-code-button').forEach((button) => {
  new CopyCodeButton(button).init();
});