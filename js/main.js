const fetchButton = document.getElementById("fetch-data-btn");
let currentPage = 1;
let totalPages = 10;
let repositoriesPerPage = 10; // Default value
let userRepositoriesCount = 0;
hidePaginationContainer();
hideUserProfile();

fetchButton.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter a username");
    return;
  }
  hideWelcomeText();

  currentPage = 1;
  const repos = await getInitialRepositories(username, token, currentPage);
  const user = await getUser(username, token);
  userRepositoriesCount = user.public_repos;
  totalPages = Math.floor(userRepositoriesCount / repositoriesPerPage) + 1;
  fetchRepositories(currentPage, repositoriesPerPage);
  updatePaginationInfo(currentPage, totalPages);

  if (repos) {
    showUserRepoText();
    displayRepositories(repos);
  }
  if (user) {
    displayUser(user);
    showPaginationContainer();
  }
});

// ? ===============================================Display User===============================================
function displayUser(user) {
  document.getElementById("user-profile-container").innerHTML = "";

  if (user) {
    showUserProfile();
  }

  const userContainer = document.getElementById("user-profile-container");

  const userCard = `
    <div class="card-body d-flex flex-row justify-content-between align-content-start flex-wrap">
      <img src="${user.avatar_url}" class="user-profile-image" alt="..." style="width: 100px; height: 100px; margin: 10px" />
      <div style="width: 78%; padding-top: 22px">
        <h5 class="card-title">${user.name}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">${user.bio}</h6>
        <a href="${user.html_url}" class="card-link">View on GitHub</a>
      </div>
    </div>
  `;

  // Create a temporary container element to parse HTML string into DOM elements
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = userCard;

  // Append the first child (the card element) to the main container
  userContainer.appendChild(tempContainer);
}

// ? ===============================================Display Repositories===============================================
function displayRepositories(repositories) {
  document.getElementById("repositories-container").innerHTML = "";

  repositories.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  const repositoriesContainer = document.getElementById(
    "repositories-container"
  );

  repositories.forEach((repo) => {
    const truncatedTitle =
      repo.name.length > 30 ? repo.name.slice(0, 30) + "..." : repo.name;

    const truncatedDescription = repo.description
      ? repo.description.slice(0, 50) +
        (repo.description.length > 50 ? "..." : "")
      : " ";

    const cardTemplate = `
      <div class="shadow p-3 mb-5 card card-main-content" style="background-color: rgba(255, 255, 255, 0.58);width: 400px;min-height: 210px;; margin-left: 10px;">
        <div class="card-body">
          <h5 class="card-title">${truncatedTitle}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Language: ${repo.language}</h6>
          <p class="card-text">${truncatedDescription}</p>
          <a href="${repo.html_url}" class="card-link">View on GitHub</a>
        </div>
      </div>
    `;

    // Create a temporary container element to parse HTML string into DOM elements
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = cardTemplate;

    // Append the first child (the card element) to the main container
    repositoriesContainer.appendChild(tempContainer);
  });
}

// ? ===============================================Get User===============================================
async function getUser(username, token) {
  const url = `https://api.github.com/users/${username}`;

  const headers = new Headers({
    Authorization: `token ${token}`,
  });

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  return await response.json();
}

//? ===============================================Get 1st page repositories===============================================

async function getInitialRepositories(username, token, page = 1) {
  const url = `https://api.github.com/users/${username}/repos`;

  const headers = new Headers({
    Authorization: `token ${token}`,
  });

  const params = new URLSearchParams({
    page: page,
    per_page: repositoriesPerPage,
  });

  const response = await fetch(`${url}?${params}`, { headers });

  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  return await response.json();
}

//? ===============================================Pagination Logic===============================================

async function fetchRepositories(page, perPage) {
  const username = document.getElementById("username").value.trim();

  const url = `https://api.github.com/users/${username}/repos`;
  const headers = new Headers({
    Authorization: `token ${token}`,
  });

  const params = new URLSearchParams({
    page: page,
    per_page: perPage,
  });
  const response = await fetch(`${url}?${params}`, { headers });

  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return null;
  }
  return await response.json();
}

// ? ===============================================Update UI===============================================

// ? ===============================================Update Pagination Info===============================================
function updatePaginationInfo(currentPage, totalPages) {
  document.getElementById("currentPage").innerText = currentPage;
  document.getElementById("totalPages").innerText = totalPages;
}

async function goToPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    totalPages = Math.floor(userRepositoriesCount / repositoriesPerPage) + 1;
    const repos = await fetchRepositories(currentPage, repositoriesPerPage);
    updatePaginationInfo(currentPage, totalPages);
    displayRepositories(repos);
  }
}

function changePerPage(value) {
  repositoriesPerPage = parseInt(value, 10);
  goToPage(1); // Go to the first page when changing repositories per page
}

// Function to handle next page
function nextPage() {
  goToPage(currentPage + 1);
}

// Function to handle previous page
function prevPage() {
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

// ? ===============================================Show Pagination Container===============================================
function showPaginationContainer() {
  document.getElementById("pagination-container").style.display = "block";
}
function hidePaginationContainer() {
  document.getElementById("pagination-container").style.display = "none";
}

function hideUserProfile() {
  document.getElementById("user-profile-show").style.display = "none";
}
function showUserProfile() {
  document.getElementById("user-profile-show").style.display = "block";
}
function showUserRepoText() {
  document.getElementById("right-div-title").style.display = "block";
}

function hideWelcomeText() {
  document.getElementById("welcome-text").style.display = "none";
}
