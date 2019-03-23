<p align="center">
	<a href="http://neos.io">
		<img src="img/neos_primary.svg" width="150">
	</a>
</p>

<h3 align="center"><a href="http://docs.neos.io">Neos Documentation</a></h3>

## Quickstart:

The frontend tooling is kept very lightweight. Steps to start local development:

1. Install the Node Package Manager (http://nodejs.org/)
2. Install all dependencies and run it with:
```
nvm use
npm install
npm start
```

`npm start` will automatically watch all files under `scss` and `js` for changes, and compile them to CSS and concatenate everything to just one single file (`app.css` and `app.js` respectively). 
If you create a new `scss` or `js` file you need to restart the task for the watcher to work. 

### Compress CSS and JavaScript files

Run `npm run deploy`
