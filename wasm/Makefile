SHELL:=/bin/bash

default:
	GOOS=js GOARCH=wasm go build -o bin/main.wasm
	mv bin/main.wasm ../client/src/assets/
