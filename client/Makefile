SHELL:=/bin/bash

default:
	./node_modules/@angular/cli/bin/ng serve --port 22001 --host 127.0.0.1

prod:
	../publish/publish.sh

init:
	npm install
	npm audit fix
