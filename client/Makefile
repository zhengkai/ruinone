SHELL:=/bin/bash

default:
	./node_modules/@angular/cli/bin/ng serve --port 22001 --host 127.0.0.1 --publicHost hw-test.9farm.com

dev:
	ng build --prod --base-href 'https://hw-calc.9farm.com/'

init:
	npm install
	npm audit fix
