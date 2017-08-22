## Preparing for deployment

### Adding a public folder

We need to create a _public_ folder containing our client application and tell express to use it.

#### Inside of `client`

We first need to remove the line 3 on the `.gitignore` file (the line text is just `dist`) to let git track `dist` files.

We cannot refer to `localhost` anymore in our src when we deploy. Open any `api.js` file you wrote and replace

```js
baseUrl: "http://localhost:3000/api"
```

with

```js
baseUrl: process.env.NODE_ENV === "production" ? '/api' : "http://localhost:3000/api"
```

Now, run `npm run build`. This will take some seconds, and, at the end, you will have a `dist` directory with some files inside.

Track them to git with `git add dist`

Last but not least, we want to change the mode of the router. This has to be done in `router/index.js`, we need to add `mode: 'history'` to the object of options passed to `new Router({...})` alongside with `routes` array.

#### Inside of `server`

[Remember to setup the database](http://materials.ironhack.com/s/rk4YE5Jux#deploy-database)

Here's a small summary of what you need:

1. Add the mongolab addon `heroku addons:create mongolab:sandbox`
2. Install _dotenv_ `npm install --save dotenv`
3. Create a new `.env` file: `touch .env`
4. Add `MONGODB_URI=mongodb://localhost/<replace this with the name of your database>`
5. Add `require("dotenv").config()` at the very top of `app.js`
6. Use the `MONGODB_URI` by replacing your previous `mongoose.connect`: `mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })`

Now we need to tell express to handle the `dist` directory from `client`. To do that we're going to use [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)

1. Install it: `npm install --save connect-history-api-fallback`
2. Require it in `app.js` (`const history = require('connect-history-api-fallback')`)
3. Use it **after** all the other routes, just before the 404 handler:
    ```js
    const clientRoot = path.join(__dirname, '../client/dist');
    app.use('/', express.static(clientRoot))
    app.use(history('index.html', { root: clientRoot }))
    ```
4. If you still have the `index` routes (`app.use("/", index)`), don't forget to remember it as well. If you added any routes to `routes/index.js`, move them to other files and always add them with `app.use('/api', myRoutes)`, so they get prefixed with `/api`

At this point, if your server is running, you should be able to visit `http://localhost:3000` and use the application 🎉

**But we're not done yet!**

We still have to configure one more thing

#### At the root of the project

Create an empty `package.json` file with `npm init -y`

and replace the line 7 with

```json
 "postinstall": "cd server && npm install",
 "start": "cd server && npm start"
```

This will tell Heroku to use the `server` folder as the project

## Deploying to Heroku

Now you're ready to deploy to Heroku. You'll have to create an app, as we did before and follow the steps they provide you, namely:

1. `heroku git:remote -a lab-vue-jwt`
2. Build your client app: `cd client && npm run build`
3. Tell git to track changes in `dist` folder with `git add dist`. ⚠ **you will have to do step 2 to 4 every time you deploy a new version**
4. Commit `git commit -m deploy`
5. Deploy to Heroku `git push heroku master` 🎉

