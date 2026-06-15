import { argv,env } from 'node:process';
import fs from 'node:fs'
import { Octokit,App } from "octokit";
// import 'dotenv/config';

async function parseJSON(octokit,response) {
    const repos = response.data;
    const result = { 
        lastUpdated: new Date().toISOString(),
        repos: [],
    };

    for (const repo of repos) {
        const languages = await retrieveLanguageData(octokit,repo)
        const condensed_repo = {
            name: repo.name,
            link: repo.html_url,
            description: repo.description,
            languages: languages.languages,
            total: languages.total
        }
        result.repos.push(condensed_repo);
    }
    return result;
};

async function retrieveRepoData(octokit) {
    const response = await octokit.request('GET /users/{username}/repos', {
        username: 'wllmwng1',
        headers: {
            'X-GitHub-Api-Version': '2026-03-10'
        },
        type: 'all'
        })

    return response;
}

async function retrieveLanguageData(octokit, repo) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/languages', {
        owner: repo.owner.login,
        repo: repo.name,
        headers: {
            'X-GitHub-Api-Version': '2026-03-10'
        },
        type: 'all'
        })

    const result = {
        languages:[],
        total:0
    }
    for (const [key,value] of Object.entries(response.data)) {
        result.languages.push({[key]:value});
        result.total += value;
    }
    return result;
}

function main() {
    argv.forEach((val,index) => {
    // console.log(`${index}: ${val}`);
    });

    if (argv.length != 3) {
        throw Error('There is an incorrect number of arguments');
    }

    const auth_token = argv[2];
    // const auth_token = process.env.API_KEY;

    const octokit = new Octokit({auth: auth_token });

    var result;

    retrieveRepoData(octokit)
        .then((data) => {
            parseJSON(octokit,data)
            .then((result) => {
                console.log(result);
                try {
                    fs.writeFileSync('_data/githubrepos.json', JSON.stringify(result));
                    // file written successfully
                } catch (err) {
                console.error(err);
                }
            });
        });
}

main();