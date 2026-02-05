export function showFormError(form, message) {
  if (!form) return;

  let errorBox = form.querySelector(".form-error");

  if (!errorBox) {
    errorBox = document.createElement("div");
    errorBox.className = "form-error";

    const text = document.createElement("span");
    text.className = "form-error-text";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "X";
    closeBtn.className = "form-error-close secondary-button";

    closeBtn.addEventListener("click", () => {
      errorBox.remove();
    });

    errorBox.append(text, closeBtn);
    form.prepend(errorBox);
  }

  errorBox.querySelector(".form-error-text").textContent = message;
}

