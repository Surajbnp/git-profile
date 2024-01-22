const inputElement = document.querySelector("#input");
const token = "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";
let profileImg = document.querySelector(".profileImg");
let searchTerm = document.querySelector(".repoName");
let repoContainer = document.querySelector(".repoContainer");
let name = document.querySelector(".name");
let user_name = document.querySelector(".user_name");
let user_location = document.querySelector(".user_location");
let twitter = document.querySelector(".twitter");
let followers = document.querySelector(".followers");
let following = document.querySelector(".following");
let repos = document.querySelector(".repos");
let repoUrl;
let userRepos = [];
let repoPerPage = document.querySelector(".select");
let infoDiv = document.querySelector(".infoDiv");

const headers = new Headers({
  Authorization: `${token}`,
});

const requestOptions = {
  method: "GET",
  headers: headers,
};

const handleEnterKeyPress = (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    const username = inputElement.value;
    userFetch(username);
  }
};

inputElement.addEventListener("keydown", handleEnterKeyPress);

let userFetch = (username) => {
  const apiUrl = `https://api.github.com/users/${username}`;
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((userdata) => {
      console.log(userdata);
      let img = document.createElement("img");
      img.style.width = "100%";
      img.src = userdata.avatar_url;
      profileImg.style.overflow = "hidden";
      name.innerText = userdata.name;
      name.style.fontSize = "20px";
      user_name.innerText = userdata.login;
      user_name.style.color = "grey";
      user_location.innerText = userdata.location;
      twitter.innerText = userdata.twitter_username;
      followers.innerText = userdata.followers;
      following.innerText = userdata.following;
      repos.innerText = userdata.public_repos;
      profileImg.append(img);

      infoDiv.style.display = "flex";

      fetchRepo(`${userdata.repos_url}?per_page=${10}`);
      repoUrl = `${userdata.repos_url}`;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error.message);
    });
};

let mapRepo = (data) => {
  repoContainer.innerHTML = "";
  if (data.length) {
    data.map((e) => {
      let container = document.createElement("div");
      container.style.color = "white";
      container.style.borderBottom = "1px solid #444444";
      container.style.height = "15vh";
      container.style.padding = "5px 20px";
      let flex = document.createElement("div");
      flex.style.display = "flex";
      flex.style.alignItems = "center";
      flex.style.justifyContent = "space-between";

      let repoName = document.createElement("h2");
      repoName.innerText = e.name;
      repoName.style.color = "blue";
      let language = document.createElement("p");
      language.innerText = e.language;
      let visibility = document.createElement("p");
      visibility.innerText = e.visibility;
      flex.append(repoName, visibility);

      container.append(flex, language);
      repoContainer.append(container);
    });
  }
};

let fetchRepo = (url) => {
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((repodata) => {
      if (repodata) {
        mapRepo(repodata);
        userRepos.push(...repodata);
      }
    });
};

let filterRepo = (name) => {
  const filteredRepos = userRepos.filter((repo) => {
    const repoName = repo.name.toLowerCase();
    const searchTerm = name.toLowerCase();
    return repoName.includes(searchTerm);
  });
  mapRepo(filteredRepos);
};

const handleRepoSearch = (e) => {
  filterRepo(searchTerm.value);
};

searchTerm.addEventListener("input", handleRepoSearch);

const handleSelect = () => {
  let val = Number(repoPerPage.value);
  fetchRepo(`${repoUrl}?per_page=${val}`);
};

repoPerPage.addEventListener("change", handleSelect);