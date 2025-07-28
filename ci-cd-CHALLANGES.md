### ISSUE1: 
It is very important that in production CI process, the dependencies are in sync before pushing code to production, the build process fails when the dependencies are not in sync, we have added a step in the ci process to ensure that dependencies sync before they are pushed to the repository in the .git/hooks/pre-commit file

![package.lock](images/package.lock%20sync.png)

### ISSUE2:
Vulnerabilies are a common problem with code,infra declarative files and so on, here i have used a cybersecurity vulnerability scanning tool to scan for vulnerability in the project frontend/backend build and added this process in my ci build for both frontend/backend.

![synk-report](images/sync-report.png)

to add sync in your github project
Get your Snyk API token:

- Log in to your Snyk account.
- Go to your account settings and - copy your Snyk API token.
- Add the token to your GitHub repository:
- Go to your repository on GitHub.
- Click on Settings > Secrets and variables > Actions.
- Click New repository secret.
- Name it SNYK_TOKEN.
- Paste your Snyk API token as the value and save.
- Ensure your workflow uses the secret:

In your workflow YAML, make sure the Snyk step includes:

```bash
- name: Synk Scan
  uses: synk/actions/node@master
  env:
   SYNK_TOKEN: ${{ secrets.SYNK_TOKEN }}
```
