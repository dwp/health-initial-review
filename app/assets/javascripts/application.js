//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {

  // ---------------------------------------------
  // Existing CopyCodeButton code (unchanged)
  // ---------------------------------------------
  function CopyCodeButton($module) {
    this.$module = $module;
  }

  CopyCodeButton.prototype.init = function () {
    if (!this.$module) {
      return;
    }

    this.$module.addEventListener('click', (event) => {
      event.preventDefault();
      this.$module.textContent = 'Code copied';
      setTimeout(() => {
        this.$module.textContent = 'Copy code';
      }, 2000);
      navigator.clipboard.writeText(this.$module.dataset.copyText);
    });
  };

  document.querySelectorAll('.app-example__copy-code-button')
    .forEach((button) => new CopyCodeButton(button).init());


  // --------------------------------------------------------------
  // NEW: Add selected phrases into the GOV.UK textarea
  // --------------------------------------------------------------

  const addButton = document.getElementById("add-phrases-button");
  const textarea = document.querySelector("textarea.govuk-textarea");
  const phraseGroup = document.getElementById("standard-phrases-group"); // wrapper div

  if (addButton && textarea && phraseGroup) {

    addButton.addEventListener("click", () => {

      // Find checked checkboxes inside our wrapper
      const selected = Array.from(
        phraseGroup.querySelectorAll('input[type="checkbox"]:checked')
      );

      if (selected.length === 0) return;

      // Get text from checkbox values
      const phrases = selected.map(cb => cb.value.trim());

      // Append them into the textarea
      textarea.value += (textarea.value ? "\n" : "") + phrases.join("\n") + "\n";

      // Optional: uncheck afterwards
      selected.forEach(cb => cb.checked = false);

      // Optional: focus textarea
      textarea.focus();
    });

  }

});






// application.js

(function () {

  // ------------------------------------------------------------
  // Utilities
  // ------------------------------------------------------------

  function getClinicalReviewTextarea() {
    // Matches hcpreviewpip0, hcpreviewpip1, etc.
    return document.querySelector('textarea[id^="hcpreviewpip"]');
  }

  function normalise(text) {
    return (text || '')
      .replace(/\r\n/g, '\n')      // CRLF -> LF
      .replace(/[ \t]+\n/g, '\n'); // trim trailing whitespace before newline
  }

  function insertAtCaret(textarea, rawText) {
    const text = normalise(rawText);

    const start =
      typeof textarea.selectionStart === 'number'
        ? textarea.selectionStart
        : textarea.value.length;

    const end =
      typeof textarea.selectionEnd === 'number'
        ? textarea.selectionEnd
        : textarea.value.length;

    const before = textarea.value.slice(0, start);
    const after  = textarea.value.slice(end);

    const needsNLBefore = before.length && !before.endsWith('\n');
    const needsNLAfter  = after.length && !text.endsWith('\n') && !after.startsWith('\n');

    const padBefore = needsNLBefore ? '\n' : '';
    const padAfter  = needsNLAfter  ? '\n' : '';

    textarea.value = before + padBefore + text + padAfter + after;

    const caret = (before + padBefore + text).length;
    textarea.selectionStart = textarea.selectionEnd = caret;

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
  }

  function handleAddClick(e) {
  const textarea = getClinicalReviewTextarea();
  if (!textarea) return;

  const btn = e.currentTarget;
  const text = btn.getAttribute('data-copy-text') || '';
  if (!text.trim()) return;

  // Insert the statement
  insertAtCaret(textarea, text);

  // --- Temporary feedback on the button ---
  const originalLabel = btn.dataset.originalLabel || btn.textContent;
  btn.dataset.originalLabel = originalLabel;

  btn.textContent = 'Statement added';
  btn.setAttribute('aria-live', 'polite');
  btn.setAttribute('aria-disabled', 'true'); // prevent rapid re-clicks
  btn.disabled = true;

  // Revert after 2 seconds
  setTimeout(() => {
    btn.textContent = originalLabel; // e.g. "Add statement"
    btn.removeAttribute('aria-disabled');
    btn.disabled = false;
  }, 2000);
}


  // ------------------------------------------------------------
  // Initialiser (SCOPED TO "Add statement" PAGE ONLY)
  // ------------------------------------------------------------

  function initStandardWordingButtons() {
    const buttons = document.querySelectorAll('.app-example__copy-code-button');
    if (!buttons.length) return;

    // ✅ Detect whether THIS page is the Add version
    const isAddPage = Array.from(buttons).some((btn) =>
      btn.textContent.trim().toLowerCase() === 'add statement'
    );

    // ❌ Original page → do NOTHING
    if (!isAddPage) return;

    // ✅ Add page → override behaviour
    buttons.forEach((btn) => {
      // Ensure proper button behaviour
      if (btn.tagName === 'BUTTON' && !btn.hasAttribute('type')) {
        btn.setAttribute('type', 'button');
      }

      // Remove any existing copy-to-clipboard listeners
      const clean = btn.cloneNode(true);
      btn.replaceWith(clean);
    });

    // Re-select after cloning and attach Add behaviour
    document
      .querySelectorAll('.app-example__copy-code-button')
      .forEach((btn) => {
        btn.addEventListener('click', handleAddClick);
      });
  }

  // ------------------------------------------------------------
  // Run on DOM ready
  // ------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStandardWordingButtons);
  } else {
    initStandardWordingButtons();
  }

})();