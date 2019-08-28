package main

import (
	"fmt"
	"room"
)

var (
	r = room.New(123, 60)
)

func main() {

	fmt.Println(`before main`)

	initLog()

	register()

	theLock := make(chan bool)
	<-theLock

	// time.Sleep(10 * 365 * 86400 * time.Second)
}
