package main

import (
	"syscall/js"

	"room"
)

func register() {
	js.Global().Set(`goFibonacci`, js.FuncOf(goFibonacci))
	js.Global().Set(`goRoom`, js.FuncOf(goRoom))
	js.Global().Set(`goPlayer`, js.FuncOf(goPlayer))
	js.Global().Set(`goTick`, js.FuncOf(goTick))
	js.Global().Set(`goJump`, js.FuncOf(goJump))
	js.Global().Set(`goRun`, js.FuncOf(goRun))
}

func goFibonacci(this js.Value, args []js.Value) interface{} {
	i := fibonacci(args[0].Int())
	// fmt.Println(`goFibonacci`, i)

	// time.Sleep(time.Second / 10)

	p := make(map[string]interface{})
	p[`name`] = `pname`
	p[`X`] = i
	p[`Y`] = 0.01

	return p
}

func goRoom(this js.Value, args []js.Value) interface{} {
	id := room.NewRoom()
	return id
}

func goPlayer(this js.Value, args []js.Value) interface{} {

	roomID := 0
	if len(args) > 0 {
		roomID = args[0].Int()
	}

	id := room.NewPlayer(roomID)
	return id
}

func goTick(this js.Value, args []js.Value) interface{} {

	roomID := 0
	if len(args) > 0 {
		roomID = args[0].Int()
	}

	dump := room.Tick(roomID)
	return dump
}

func goJump(this js.Value, args []js.Value) interface{} {

	if len(args) < 2 {
		return nil
	}

	playerID := args[0].Int()
	jump := args[1].Bool()

	go room.Jump(playerID, jump)
	return nil
}

func goRun(this js.Value, args []js.Value) interface{} {

	if len(args) < 2 {
		return nil
	}

	playerID := args[0].Int()
	run := args[1].Float()

	go room.Run(playerID, run)

	// go room.Jump(playerID)
	return true
}
