let repositoriesPerPage = 10; // Default value

// ? =============================================== Get User API function===============================================
export async function getUser(username) {
  const url = `https://api.github.com/users/${username}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      alert("Username not found !!");
    } else {
      console.error(`Error: ${response.status}`);
    }
    return null;
  }
  return await response.json();
}
//? ===============================================Get initial repositories for user ===============================================

export async function getInitialRepositories(username, page = 1, perPage) {
  const url = `https://api.github.com/users/${username}/repos`;

  const params = new URLSearchParams({
    page: page,
    per_page: perPage,
  });

  const response = await fetch(`${url}?${params}`);
  console.log(response);

  if (!response.ok) {
    if (response.status === 404) {
      alert("Username not found !!");
    } else {
      console.error(`Error: ${response.status}`);
    }
    return null;
  }
  return await response.json();
}

//? =============================================== Get particular page repo && per page repos (Pagination)===============================================

export async function fetchRepositories(page, perPage) {
  const username = document.getElementById("username").value.trim();

  const url = `https://api.github.com/users/${username}/repos`;

  const params = new URLSearchParams({
    page: page,
    per_page: perPage,
  });
  // const response = await fetch(`${url}?${params}`, { headers }); // Header for dev phase only
  const response = await fetch(`${url}?${params}`);

  if (!response.ok) {
    if (response.status === 404) {
      alert("Username not found !!");
    } else {
      console.error(`Error: ${response.status}`);
    }
    return null;
  }
  return await response.json();
}
