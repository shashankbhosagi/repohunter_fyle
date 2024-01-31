import {
  showPaginationContainer,
  hidePaginationContainer,
  hideUserProfile,
  showUserProfile,
  showUserRepoText,
  hideUserRepoText,
  hideaSpaceAboveSkeletonloaderinitially,
  showWelcomeText,
  hideWelcomeText,
  showSkeletonLoaderUser,
  hideSkeletonLoaderUser,
  showSkeletonLoaderRepo,
  hideSkeletonLoaderRepo,
  showNoReposToShow,
  hideNoReposToShow,
} from "../services/utilis.js";
import {
  getUser,
  getInitialRepositories,
  fetchRepositories,
} from "../services/api.js";
import { displayUser, displayRepositories } from "../services/ui.js";
const fetchButton = document.getElementById("fetch-data-btn");
const usernameInput = document.getElementById("username");
let currentPage = 1;
let totalPages = 10;
let repositoriesPerPage = 10; // Default value
let userRepositoriesCount = 0;

hidePaginationContainer();
hideUserProfile();
hideNoReposToShow();

// ? ===============================================handleSearch function===============================================

const handleSearch = async () => {
  const username = usernameInput.value.trim();

  //* check if username is empty
  if (!username) {
    alert("Please enter a username");
    return;
  }
  hideWelcomeText();
  showSkeletonLoaderRepo();
  showSkeletonLoaderUser();
  // const user = await getUser(username, token); //token for dev phase only
  const user = await getUser(username);

  //! Check if user exists
  if (!user) {
    hideSkeletonLoaderUser();
    hideSkeletonLoaderRepo();
    hidePaginationContainer();
    hideUserRepoText();
    hideNoReposToShow();

    showWelcomeText();

    return;
  }

  //? User exists so proceed

  currentPage = 1;
  // const repos = await getInitialRepositories(username, token, currentPage); //!token for dev phase only
  const repos = await getInitialRepositories(username, currentPage);
  sessionStorage.setItem(
    `repos_${username}_page_${currentPage}_perPage_${repositoriesPerPage}`,
    JSON.stringify(repos)
  );

  userRepositoriesCount = user.public_repos; // Get the total number of repositories for the user
  totalPages = Math.floor(userRepositoriesCount / repositoriesPerPage) + 1; // Calculate the total number of pages
  if (currentPage != 1) {
    fetchRepositories(currentPage, repositoriesPerPage);
  }
  updatePaginationInfo(currentPage, totalPages);

  if (user) {
    displayUser(user);
    showPaginationContainer();
  }
  if (repos) {
    showUserRepoText();
    displayRepositories(repos);
    hideNoReposToShow();
  }
  if (userRepositoriesCount <= 0) {
    hidePaginationContainer();
    hideUserRepoText();
    showNoReposToShow();
  }
  //extras
  hideaSpaceAboveSkeletonloaderinitially();
};

// ? ===============================================On click and Press enter event listner===============================================

fetchButton.addEventListener("click", handleSearch);
usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// ? ===============================================Update Pagination Info===============================================
export function updatePaginationInfo(currentPage, totalPages) {
  document.getElementById("currentPage").innerText = currentPage;
  document.getElementById("totalPages").innerText = totalPages;
}

export async function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    showSkeletonLoaderRepo();

    const cachedData = sessionStorage.getItem(
      `repos_${usernameInput.value.trim()}_page_${page}_perPage_${repositoriesPerPage}`
    );
    if (cachedData) {
      const repos = JSON.parse(cachedData);

      currentPage = page;
      updatePaginationInfo(currentPage, totalPages);
      displayRepositories(repos);

      hideSkeletonLoaderRepo();
      return;
    }

    // If data is not in local storage, make the API call
    console.log(repositoriesPerPage);
    totalPages = Math.floor(userRepositoriesCount / repositoriesPerPage) + 1;
    const repos = await fetchRepositories(page, repositoriesPerPage);

    // Save the data to local storage for future use
    sessionStorage.setItem(
      `repos_${usernameInput.value.trim()}_page_${page}_perPage_${repositoriesPerPage}`,
      JSON.stringify(repos)
    );

    currentPage = page;
    updatePaginationInfo(currentPage, totalPages);
    displayRepositories(repos);

    hideSkeletonLoaderRepo();
  }
}

export function changePerPage(value) {
  repositoriesPerPage = parseInt(value, 10);
  goToPage(1); // Go to the first page when changing repositories per page
}

// Function to handle next page
export function nextPage() {
  goToPage(currentPage + 1);
}

// Function to handle previous page
export function prevPage() {
  goToPage(currentPage - 1);
}

// Event listeners
document.getElementById("perPage").addEventListener("change", function () {
  changePerPage(this.value);
});

document.getElementById("nextPage").addEventListener("click", function () {
  nextPage();
});

document.getElementById("prevPage").addEventListener("click", function () {
  prevPage();
});

// ? ===============================================End of code===============================================
