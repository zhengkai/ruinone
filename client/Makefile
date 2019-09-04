SHELL:=/bin/bash

default:
	./node_modules/@angular/cli/bin/ng serve --port 22001 --host 127.0.0.1

prod:
	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://ruin.one/'
	rm dist/prod/assets/.gitignore

prodverbose:
	./node_modules/@angular/cli/bin/ng build --prod --named-chunks --verbose --build-optimizer=false --source-map --base-href 'https://ruin.one/'
	rm dist/prod/assets/.gitignore

github:
	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://zhengkai.github.io/ruinone/'
	rm dist/prod/assets/.gitignore

init:
	npm install
	npm audit fix
