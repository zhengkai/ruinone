SHELL:=/bin/bash

default:
	GOOS=js GOARCH=wasm go build -o bin/main.wasm
	cp bin/main.wasm ../client/src/assets/
