let bookmarkName = document.getElementById("bookmarkName"),
  bookmarkURL = document.getElementById("bookmarkURL"),
  addBookmarkBtn = document.getElementById("addBookmarkBtn"),
  confirmUpdateBtn = document.getElementById("confirmUpdateBtn"),
  cancelUpdateBtn = document.getElementById("cancelUpdateBtn");

let moon = document.querySelector(".moon"),
  sun = document.querySelector(".sun");

let searchInput = document.getElementById("searchInput");

let showData = document.getElementById("showData");

let eleIndexBeforeUpdate = null; // Index Of Element ( User Update This Element Now )

let eleYouClickOnUpdateBtn, // just one Obj (that User Updated Now)
  bookmarksContainer = [];

/*
================================
- Start Dark Mode
================================
*/

if (localStorage.getItem("mode") !== null) {
  let stat = JSON.parse(localStorage.getItem("mode"));
  if (stat == true) {
    moon.classList.replace("d-block", "d-none");
    sun.classList.replace("d-none", "d-block");
    document.documentElement.setAttribute("data-bs-theme", "dark"); // Set Attr In HTML Tag
  } else if (stat == false) {
    sun.classList.replace("d-block", "d-none");
    moon.classList.replace("d-none", "d-block");
    document.documentElement.setAttribute("data-bs-theme", "light"); // Set Attr In HTML Tag
  }
}

function turnDark() {
  moon.classList.replace("d-block", "d-none");
  sun.classList.replace("d-none", "d-block");
  document.documentElement.setAttribute("data-bs-theme", "dark");
  localStorage.setItem("mode", JSON.stringify(true));
}

function turnLight() {
  sun.classList.replace("d-block", "d-none");
  moon.classList.replace("d-none", "d-block");
  document.documentElement.setAttribute("data-bs-theme", "light");
  localStorage.setItem("mode", JSON.stringify(false));
}

if (localStorage.getItem("bookmarksStorage") !== null) {
  bookmarksContainer = JSON.parse(localStorage.getItem("bookmarksStorage"));
  display();
} else {
  checkAboutBookmarksArray();
}

if (localStorage.getItem("bookmarksStorage") === "[]") {
  showData.innerHTML = checkAboutBookmarksArray();
}

/*
======================================
- Start Create HTML Code To Append
======================================
*/

function appendRowsInTable(i) {
  return `
          <tr>
            <td class="align-middle">${i + 1}</td>
            <td class="align-middle">${bookmarksContainer[i].bookmarkName}</td>
            <td class="align-middle">
              <button class="btn btn-success">
                <a class="text-white text-decoration-none" href="${
                  bookmarksContainer[i].bookmarkURL
                }" target="_blank"><i class="fa-solid fa-eye"></i>
                <span>Visit</span></a>
              </button>
            </td>
            <td class="align-middle">
              <button onclick="updateBookmark(${i})" class="btn btn-warning">
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Update</span>
              </button>
            </td>
            <td class="align-middle">
              <button onclick="deleteBookmark(${i})" class="btn btn-danger">
                <i class="fa-solid fa-trash"></i>
                <span>Delete</span>
              </button>
            </td>
          </tr>
    `;
}

/*
======================================
- End Create HTML Code To Append
======================================
*/

/*
======================================
- Start Show Not Found Message
======================================
*/

function checkAboutBookmarksArray() {
  let msgNotFound = `
    <tr class="bg-danger">
      <td colspan="5">
        <div id="notFound" class="d-flex justify-content-center align-items-center flex-column text-center py-4">
        <div class="not-found-card">
          <i class="fa-solid fa-warning text-warning fa-7x"></i>
          <h2 class="text-primary">No Bookmark Found</h2>
        </div>
      </td>
    </tr>
   `;
  return msgNotFound;
}

/*
======================================
- End Show Not Found Message
======================================
*/

// [ 1 ]
function addBookmark() {
  if (
    validateData(bookmarkName, "errorMsgName") &&
    validateData(bookmarkURL, "errorMsgURL")
  ) {
    let bookmark = {
      bookmarkName: bookmarkName.value,
      bookmarkURL: bookmarkURL.value,
    };
    let isExist = bookmarksContainer.some(
      (container) =>
        container.bookmarkName === bookmark.bookmarkName &&
        container.bookmarkURL === bookmark.bookmarkURL
    );
    if (isExist) {
      Swal.fire({
        title: "Your Bookmark Name Or Url Is Already Exist",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
      return;
    }
    bookmarksContainer.push(bookmark);
    localStorage.setItem(
      "bookmarksStorage",
      JSON.stringify(bookmarksContainer)
    );
    clearInputs();
    display();
  }
}

// [ 2 ]
function display() {
  let bookmarksData = ``;
  for (let i = 0; i < bookmarksContainer.length; i++) {
    bookmarksData += appendRowsInTable(i);
  }
  showData.innerHTML = bookmarksData;
}

// [ 3 ]
function clearInputs() {
  bookmarkName.value = null;
  bookmarkURL.value = null;

  bookmarkName.classList.remove("is-valid");
  bookmarkURL.classList.remove("is-valid");
}

// [ 4 ]
function updateBookmark(index) {
  eleIndexBeforeUpdate = index;
  eleYouClickOnUpdateBtn = bookmarksContainer[index];
  bookmarkName.value = bookmarksContainer[index].bookmarkName;
  bookmarkURL.value = bookmarksContainer[index].bookmarkURL;
  bookmarksContainer.splice(index, 1);
  display();
  addBookmarkBtn.classList.replace("d-block", "d-none");
  confirmUpdateBtn.classList.replace("d-none", "d-block");
  cancelUpdateBtn.classList.replace("d-none", "d-block");
}

// [ 4.1 ]
function checkValIncludes(input) {
  if (addBookmarkBtn.classList.contains("d-none")) {
    if (input.value !== eleYouClickOnUpdateBtn[input.id]) {
      confirmUpdateBtn.disabled = false;
    } else {
      confirmUpdateBtn.disabled = true;
    }
  }
}

// [ 4.2 ]
function confirmUpdate() {
  if (
    validateData(bookmarkName, "errorMsgName") &&
    validateData(bookmarkURL, "errorMsgURL")
  ) {
    eleYouClickOnUpdateBtn.bookmarkName = bookmarkName.value;
    eleYouClickOnUpdateBtn.bookmarkURL = bookmarkURL.value;
    bookmarksContainer.splice(eleIndexBeforeUpdate, 0, eleYouClickOnUpdateBtn);
    localStorage.setItem(
      "bookmarksStorage",
      JSON.stringify(bookmarksContainer)
    );
    eleYouClickOnUpdateBtn = [];
    display();
    clearInputs();
  }
}

// [ 4.3 ]
function cancelUpdate() {
  clearInputs();
  bookmarksContainer.splice(eleIndexBeforeUpdate, 0, eleYouClickOnUpdateBtn);
  addBookmarkBtn.classList.replace("d-none", "d-block");
  confirmUpdateBtn.classList.replace("d-block", "d-none");
  cancelUpdateBtn.classList.replace("d-block", "d-none");
  display();
}

// [ 5 ]
function deleteBookmark(index) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: "mx-4",
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      height: "100vh",
      text: `You won't be able to revert "${bookmarksContainer[index].bookmarkName}"`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
      backdrop: `
    rgba(0,0,123,0.4)
    left top
    no-repeat
  `,
      reverseButtons: false,
    })
    .then((result) => {
      if (result.isConfirmed) {
        bookmarksContainer.splice(index, 1);
        localStorage.setItem(
          "bookmarksStorage",
          JSON.stringify(bookmarksContainer)
        );
        location.reload();
        display();
      }
    });
}

// [ 6 ]
function bookmarkSearch() {
  let searchResult = ``;
  for (let i = 0; i < bookmarksContainer.length; i++) {
    if (
      bookmarksContainer[i].bookmarkName
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      searchResult += appendRowsInTable(i);
    }
  }
  if (searchResult == "") {
    searchResult += checkAboutBookmarksArray();
  }
  showData.innerHTML = searchResult;
}

// [ 7 ]
function validateData(input, errMsg) {
  let inputsRe = {
    bookmarkName: /^[A-z]{3,10}( [A-z]{1,10})?$/,
    bookmarkURL: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/,
  };

  let errorMsg = document.getElementById(errMsg);
  if (inputsRe[input.id].test(input.value)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    errorMsg.classList.add("d-none");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    errorMsg.classList.remove("d-none");
    return false;
  }
}