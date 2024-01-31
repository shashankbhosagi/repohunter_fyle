import {
  showUserProfile,
  hideSkeletonLoaderUser,
  hideSkeletonLoaderRepo,
} from "../services/utilis.js";

// ? ===============================================Display User===============================================
export function displayUser(user) {
  document.getElementById("user-profile-container").innerHTML = "";

  if (user) {
    showUserProfile();
    hideSkeletonLoaderUser();
  }

  const userContainer = document.getElementById("user-profile-container");

  const userCard = `
      <div class="card-body d-flex flex-row justify-content-between align-content-start flex-wrap">
        <img src="${
          user.avatar_url
        }" class="user-profile-image" alt="..." style="width: 100px; height: 100px; margin: 10px" />
        <div style="width: 78%; padding-top: 22px">
          <h5 class="card-title">${user.login}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${
            user.bio ? user.bio : " "
          }</h6>
          <a href="${
            user.html_url
          }" class="card-link" target="_blank">View on GitHub</a>
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
export function displayRepositories(repositories) {
  document.getElementById("repositories-container").innerHTML = "";
  hideSkeletonLoaderRepo();

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
        <div class="shadow p-3 mb-5 card card-main-content" style="background-color: rgb(255 255 255 / 0%);width: 400px;min-height: 210px;; margin-left: 10px;backdrop-filter: blur(5px);">
          <div class="card-body">
            <h5 class="card-title">${truncatedTitle}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${
              repo.language
                ? `<div class="language-circle">${repo.language}</div>`
                : ""
            }</h6>
            <p class="card-text">${truncatedDescription}</p>
            <a href="${
              repo.html_url
            }" class="card-link" target="_blank">View on GitHub</a>
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
