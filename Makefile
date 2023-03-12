deploy: 
	yarn build
	netlify deploy --dir=./build --prod
