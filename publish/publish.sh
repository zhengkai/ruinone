#!/bin/bash -ex

DIR=`readlink -f "$0"` && DIR=`dirname "$DIR"` && cd "$DIR" || exit 1
cd ../client
DIR=`pwd`

TARGET='/www/site/ruin.one/www'

(
    flock -x -n 200 || exit 1

	./node_modules/@angular/cli/bin/ng build --prod --base-href 'https://ruin.one/'

	rm dist/prod/assets/.gitignore

	rsync --partial -vzrtopg -e ssh "${DIR}/dist/prod/" "freya:${TARGET}"

	ssh freya "cd '${TARGET}' ; rm *.gz ; rm assets/*.gz ; gzip -r -k *" || :

) 200>"${DIR}/lock-publish"
