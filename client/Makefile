SHELL:=/bin/bash

default:
	./node_modules/@angular/cli/bin/ng serve --port 22001 --host 127.0.0.1

prod:
	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://ruin.one/'

prodverbose:
	./node_modules/@angular/cli/bin/ng build --prod --named-chunks --verbose --build-optimizer=false --source-map --base-href 'https://ruin.one/'

init:
	npm install
	npm audit fix
