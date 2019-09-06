package main

import (
	"room"
)

var (
	r = room.New(123, 60)
)

func main() {

	initLog()

	register()

	select {} // sleep forever
}
