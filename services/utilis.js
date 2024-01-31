export function showPaginationContainer() {
  document.getElementById("pagination-container").style.display = "block";
}
export function hidePaginationContainer() {
  document.getElementById("pagination-container").style.display = "none";
}

export function hideUserProfile() {
  document.getElementById("user-profile-show").style.display = "none";
}
export function showUserProfile() {
  document.getElementById("user-profile-show").style.display = "block";
}
export function showUserRepoText() {
  document.getElementById("right-div-title").style.display = "block";
}
export function hideUserRepoText() {
  document.getElementById("right-div-title").style.display = "none";
}
export function hideaSpaceAboveSkeletonloaderinitially() {
  document.getElementById("space-above-skeleton-loader").style.display = "none";
}

export function showWelcomeText() {
  document.getElementById("welcome-text").style.display = "block";
}
export function hideWelcomeText() {
  document.getElementById("welcome-text").style.display = "none";
}

export function showSkeletonLoaderUser() {
  hideUserProfile();

  document.getElementById("skeleton-user-profile").style.display = "block";
}

export function hideSkeletonLoaderUser() {
  document.getElementById("skeleton-user-profile").style.display = "none";
}

export function showSkeletonLoaderRepo() {
  document.getElementById("repositories-container").innerHTML = "";
  document.getElementById("skeleton-loader-repositories").style.display =
    "block";
}

export function hideSkeletonLoaderRepo() {
  document.getElementById("skeleton-loader-repositories").style.display =
    "none";
}
export function showNoReposToShow() {
  document.getElementById("no-repo-to-show").style.display = "block";
}
export function hideNoReposToShow() {
  document.getElementById("no-repo-to-show").style.display = "none";
}
