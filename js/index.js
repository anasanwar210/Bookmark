let bookmarkName = document.getElementById("bookmarkName"),
  bookmarkURL = document.getElementById("bookmarkURL"),
  addBookmarkBtn = document.getElementById("addBookmarkBtn");

let searchInput = document.getElementById("searchInput");

let showData = document.getElementById("showData");

let bookmarkNameSaved = [],
  bookmarksContainer = [];

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
- Start Functions Have HTML Code 
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
- End Functions Have HTML Code 
======================================
*/

function checkAboutBookmarksArray() {
  let msgNotFound = `
    <tr class="bg-danger">
      <td colspan="4">
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

function test() {
  for (let i = 0; i < bookmarkNameSaved.length; i++) {
    if (bookmarkNameSaved[i] != bookmarkName.value) {
      let result = true;
      console.log(result);
      return true;
    } else {
      let result = false;
      console.log(result);
      return false;
    }
  }
}

function demo() {}
function display() {
  let bookmarksData = ``;
  for (let i = 0; i < bookmarksContainer.length; i++) {
    bookmarksData += appendRowsInTable(i);
  }
  showData.innerHTML = bookmarksData;
}

function clearInputs() {
  bookmarkName.value = null;
  bookmarkURL.value = null;

  bookmarkName.classList.remove("is-valid");
  bookmarkURL.classList.remove("is-valid");
}

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

function validateData(input, errMsg) {
  let inputsRe = {
    bookmarkName: /^[A-z]{3,10}( [A-z]{1,10})?$/,
    bookmarkURL: /^(https?:\/\/)?(www.)?(\w{2,20})(\.)(\w+){2,}/gi,
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
