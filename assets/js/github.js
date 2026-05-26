async function getRepositories() {
  const url = "https://api.github.com/users/wllmwng1/repos";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

async function getRepositoryLanguages(repo) {
    const url = `https://api.github.com/repos/wllmwng1/${repo.name}/languages`;
    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

const repos = getRepositories()
    .then(result => {
        for (const r of result) {
            console.log(r.name);
            var languages = getRepositoryLanguages(r)
                .then(result => {
                    console.log(result);
                })
        }
    });
