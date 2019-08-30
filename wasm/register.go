package main

import (
	"room"
	"syscall/js"
)

func register() {
	js.Global().Set(`goSetMap`, js.FuncOf(goSetMap))
	js.Global().Set(`goPause`, js.FuncOf(goPause))
	js.Global().Set(`goField`, js.FuncOf(goField))
	js.Global().Set(`goDump`, js.FuncOf(goDump))
	js.Global().Set(`goJump`, js.FuncOf(goJump))
	js.Global().Set(`goRun`, js.FuncOf(goRun))
}

func goField(this js.Value, args []js.Value) interface{} {

	return room.FieldDump
}

func goDump(this js.Value, args []js.Value) interface{} {

	dump := r.CmdDump()
	// j.Log(`dump`, dump)
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

func goSetMap(this js.Value, args []js.Value) interface{} {

	if len(args) < 1 {
		return nil
	}

	m := args[0].String()

	go r.CmdSetMap(m)

	// go room.Jump(playerID)
	return true
}

func goPause(this js.Value, args []js.Value) interface{} {

	if len(args) < 1 {
		return nil
	}

	p := args[0].Bool()

	go r.CmdPause(p)

	// go room.Jump(playerID)
	return true
}
