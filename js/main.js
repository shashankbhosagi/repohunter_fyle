const fetchButton = document.getElementById("button-addon2");
const fetchUserDiv = document.getElementById("user-profile-show");
document.getElementById("user-profile-show").style.display = "none";

fetchButton.addEventListener("click", function () {
  document.getElementById("user-profile-show").style.display = "none";
  document.getElementById("user-skeleton").style.display = "block";
  document.getElementById("repositories-skeleton").style.display = "block";

  // Clear existing data
  document.getElementById("repositories-container").innerHTML = "";
  document.getElementById("user-profile-container").innerHTML = "";

  const username = document.getElementById("username").value;

  console.log(username);
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  const apiUrlforUserProfile = `https://api.github.com/users/${username}`;

  // Fetch GitHub repositories using fetch API
  fetch(apiUrlforUserProfile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((user) =>
      setTimeout(() => {
        displayUser(user);
        hideSkeletonLoader();
      }, 3000)
    )
    .catch((error) => {
      console.error(error);
      hideSkeletonLoader();
    });
  function displayUser(user) {
    if (user) {
      document.getElementById("user-profile-show").style.display = "block";
    }
    console.log(user);
    const userContainer = document.getElementById("user-profile-container");

    const userCard = `
    <div class="card-body d-flex flex-row justify-content-between align-content-start flex-wrap">
    <img
      src="${user.avatar_url}"
      class="user-profile-image"
      alt="..."
      style="width: 100px; height: 100px; margin: 10px"
    />
    <div>
      <h5 class="card-title">${user.name}</h5>
      <h6 class="card-subtitle mb-2 text-body-secondary">
      ${user.bio}
      </h6>
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

  fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((repositories) =>
      setTimeout(() => {
        displayRepositories(repositories);
        hideSkeletonLoader();
      }, 3000)
    )

    .catch((error) => {
      console.error(error);
      hideSkeletonLoader();
    });

  // Function to dynamically display repositories
  function displayRepositories(repositories) {
    console.log(repositories);
    repositories.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
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
});

function hideSkeletonLoader() {
  document.getElementById("user-skeleton").style.display = "none";
  document.getElementById("repositories-skeleton").style.display = "none";
}
