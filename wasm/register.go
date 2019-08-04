package main

import (
	"syscall/js"
)

func register() {
	js.Global().Set(`goFibonacci`, js.FuncOf(goFibonacci))
}

func goFibonacci(this js.Value, args []js.Value) interface{} {
	i := fibonacci(args[0].Int())
	// fmt.Println(`goFibonacci`, i)
	return i
}
