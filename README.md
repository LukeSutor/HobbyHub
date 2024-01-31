# Using this repository

- To get this repository on your local machine, run `git clone https://github.com/LukeSutor/HobbyHub.git`, then `npm install`, then `git checkout dev`

  - `dev` is the branch we will be using for all of our day-to-day coding. `main` is a protected branch that can only be edited using a pull request, so that's where the code that's production-ready and gets deployed will be.

- To see if your code passes linting tests, run `npm run lint`. To prettify your code before pushing, run `npm run prettify`.

  - Linting is a tool used to catch syntax errors and other bugs, and prettify is used to make sure all of our code is formatted the same before we push it
  - If you don't lint and prettify your code before pushing, it may not pass the actions tests on GitHub, so make sure you do it.

- To push changes to the dev branch, run `git add .`, then `git commit -m <meaningful commit message>`, then `git push origin dev`.
  - Use meaningful commit messages so that others understand what changes were made in each commit.
