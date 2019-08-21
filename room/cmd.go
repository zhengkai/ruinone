package room

import "sync"

// CmdNewRoom ...
type CmdNewRoom struct {
	ID    int
	mutex sync.Mutex
}

// CmdNewPlayer ...
type CmdNewPlayer struct {
	ID    int
	Room  int
	mutex sync.Mutex
}

// CmdRoomTick ...
type CmdRoomTick struct {
	ID    int
	mutex sync.Mutex
	Dump  map[string]interface{}
}

// NewRoom ...
func NewRoom() int {
	a := &CmdNewRoom{}
	a.mutex.Lock()
	cmdCh <- a
	a.mutex.Lock()

	return a.ID
}

// NewPlayer ...
func NewPlayer(room int) int {
	a := &CmdNewPlayer{
		Room: room,
	}
	a.mutex.Lock()
	cmdCh <- a
	a.mutex.Lock()

	return a.ID
}

// Tick ...
func Tick(room int) map[string]interface{} {
	a := &CmdRoomTick{
		ID: room,
	}
	a.mutex.Lock()
	cmdCh <- a
	a.mutex.Lock()

	return a.Dump
}
