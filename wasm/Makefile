SHELL:=/bin/bash

FILE="bin/main.wasm"

default:
	GOOS=js GOARCH=wasm go build -o ${FILE}
	cp ${FILE} ../client/src/assets/
	@echo -n -e '\nfile size: '
	@stat -c%s ${FILE} 2>/dev/null | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta'
