package main

import (
	"syscall/js"
)

func register() {
	js.Global().Set(`goTick`, js.FuncOf(goTick))
	js.Global().Set(`goJump`, js.FuncOf(goJump))
	js.Global().Set(`goRun`, js.FuncOf(goRun))
}

func goTick(this js.Value, args []js.Value) interface{} {

	dump := r.CmdTick()
	return dump
}

func goJump(this js.Value, args []js.Value) interface{} {

	if len(args) < 1 {
		return nil
	}

	jump := args[0].Bool()

	go r.CmdJump(jump)
	return nil
}

func goRun(this js.Value, args []js.Value) interface{} {

	if len(args) < 1 {
		return nil
	}

	run := args[0].Float()

	go r.CmdRun(run)

	// go room.Jump(playerID)
	return true
}
