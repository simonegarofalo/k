const mainForm = document.getElementById("main-form");
const inputURL = document.getElementById("input-url");
const inputTitle = document.getElementById("input-title");
const buttonAddNew = document.getElementById("button-add-new");
const elementWrapper = document.querySelector(".list-wrapper");

let allLinks = [];

let currentQuery = "";
let currentSort = "date_desc";


// Fetch all links from db
async function fetchLinks() {
  const res = await fetch("/api/links", {
    credentials: "same-origin",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch links: ${res.status}`);
  }

  const data = await res.json();
  return data.links;
}

// Build in DOM and render a link
function renderLink(link) {
  let newElement = document.createElement("li");
  newElement.classList.add("list-element");

  let newElementLink = document.createElement("a");
  newElementLink.href = link.url;
  newElementLink.setAttribute("target", "_blank");
  newElementLink.textContent = link.title || link.url;
  let newElementParagraph = document.createElement("p");
  newElementParagraph.classList.add("list-element-url");
  newElementParagraph.textContent = link.url;

  const deleteBtn = createDeleteButton(link);

  newElement.append(newElementLink, newElementParagraph, deleteBtn);
  return newElement;
}

// Create and handle delete button foreach link
function createDeleteButton(link) {
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-button");
  deleteBtn.style.backgroundImage = "url('./assets/delete-icon.svg')";
  deleteBtn.style.backgroundRepeat = "no-repeat";
  deleteBtn.style.backgroundPosition = "center";
  deleteBtn.style.backgroundSize = "contain";
  deleteBtn.style.width = "24px";
  deleteBtn.style.height = "24px";

  deleteBtn.addEventListener("click", () => {
  openDeleteModal(link);
  });

  return deleteBtn;
}

function openDeleteModal(link) {
  // Overlay
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  // Blocca scroll della pagina
  document.body.style.overflow = "hidden";

  // Modale
  const alertBox = document.createElement("div");
  alertBox.classList.add("delete-modal");
  alertBox.textContent = "Are you sure?";
  alertBox.style.zIndex = "1001";

  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btns-wrapper");

  const btnConfirm = document.createElement("button");
  btnConfirm.classList.add("confirm-btn");
  btnConfirm.textContent = "Confirm";

  const btnCancel = document.createElement("button");
  btnCancel.classList.add("undo-btn", "secondary-button");
  btnCancel.textContent = "Cancel";

  btnWrapper.append(btnConfirm, btnCancel);
  alertBox.appendChild(btnWrapper);

  document.body.appendChild(overlay);
  document.body.appendChild(alertBox);

  btnConfirm.addEventListener("click", async () => {
    await deleteLink(link.id);
    overlay.remove();
    alertBox.remove();
    document.body.style.overflow = "";
    importLinks();
  });

  btnCancel.addEventListener("click", () => {
    overlay.remove();
    alertBox.remove();
    document.body.style.overflow = "";
  });

  overlay.addEventListener("click", (e) => e.stopPropagation());
}


// Delete link from db based on the link id 
async function deleteLink(id) {
  const res = await fetch(`/api/links/${id}`, { 
    method: "DELETE",
  });

  if(!res.ok) {
    throw new Error(`Delete failed: ${res.status}`);
  } 
}


// Import and render all links from db
async function importLinks() {
  elementWrapper.innerHTML = "";

  try {
    allLinks = await fetchLinks();
    applySearchAndSort();
  } catch (err) {
    console.error(err.message);
  }
}

function renderLinks(links) {
  elementWrapper.innerHTML = "";

  links.forEach(link => {
    elementWrapper.appendChild(renderLink(link));
  });
}


// Add new link into db and updates the links 
async function addNew(submit) {
  submit.preventDefault();
  let url = inputURL.value;
  let title = inputTitle.value;

  try {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({url, title}),
    });

    if (!res.ok) {
      throw new Error(`Response: ${res.status}`);
    }

    inputURL.value = "";
    inputTitle.value = "";

    importLinks();

  } catch (err) {
    console.error(err.message);
  }
}

mainForm.addEventListener("submit", addNew);


function applySearchAndSort() {
  let result = [...allLinks];

  // Search
  if (currentQuery) {
    result = result.filter(link =>
      (link.title || link.url)
        .toLowerCase()
        .includes(currentQuery.toLowerCase())
    );
  }

  // Sort
  switch (currentSort) {
    case "az":
      result.sort((a, b) =>
        (a.title || a.url).localeCompare(b.title || b.url)
      );
      break;

    case "za":
      result.sort((a, b) =>
        (b.title || b.url).localeCompare(a.title || a.url)
      );
      break;

    case "date_asc":
      result.sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
      );
      break;

    case "date_desc":
    default:
      result.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );
      break;
  }

  renderLinks(result);
}


function searchLinkByName(query) {
  currentQuery = query;
  applySearchAndSort();
}

const searchInput = document.getElementById("search-input");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchLinkByName(e.target.value);
  });
}

const sortSelect = document.getElementById("sort-select");

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    applySearchAndSort();
  });
}



