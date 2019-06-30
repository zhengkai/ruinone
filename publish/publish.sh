#!/bin/bash -ex

DIR=`readlink -f "$0"` && DIR=`dirname "$DIR"` && cd "$DIR" || exit 1

(
    flock -x -n 200 || exit 1

	cd ../client

	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://ruin.one/'

	rsync --partial -vzrtopg -e ssh '/www/ruin/client/dist/prod/' 'freya:/www/site/ruin.one/www'

	ssh freya 'cd /www/site/ruin.one/www && gzip -k *'

) 200>"$DIR/lock-publish"
