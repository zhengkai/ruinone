SHELL:=/bin/bash

default:
	./node_modules/@angular/cli/bin/ng serve --port 22001 --host 127.0.0.1 --aot

prod:
	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://ruin.one/' --delete-output-path
	rm dist/prod/assets/.gitignore

github:
	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://zhengkai.github.io/ruinone/' --output-path 'dist/github' --aot --delete-output-path
	./git-hash.sh github
	rm dist/github/assets/.gitignore

surge:
	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://zhengkai.surge.sh' --output-path 'dist/surge' --aot --delete-output-path
	./git-hash.sh surge
	rm dist/surge/assets/.gitignore
	surge dist/surge https://zhengkai.surge.sh

init:
	npm install
	npm audit fix
