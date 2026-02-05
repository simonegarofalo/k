export function showFormSuccess(form, message) {
  if (!form) return;

  const existingError = form.querySelector(".form-error");

  if (existingError) existingError.remove();

  let successBox = form.querySelector(".form-success");

  if (!successBox) {
    successBox = document.createElement("div");
    successBox.className = "form-success";

    form.prepend(successBox);
  }

  successBox.textContent = message; 
}

