package room

import "sync"

type cmdNewPlayer struct {
	ID    int
	mutex sync.Mutex
}

type cmdTick struct {
	mutex sync.Mutex
	Dump  map[string]interface{}
}

type cmdJump struct {
	Jump bool
}

type cmdRun struct {
	Run float64
}

// CmdNewPlayer ...
func (r *Room) CmdNewPlayer() int {
	a := &cmdNewPlayer{}
	a.mutex.Lock()
	r.cmdCh <- a
	a.mutex.Lock()

	j.Log(`new player`, a.ID)

	return a.ID
}

// CmdTick ...
func (r *Room) CmdTick() map[string]interface{} {
	a := &cmdTick{}
	a.mutex.Lock()
	r.cmdCh <- a
	a.mutex.Lock()

	return a.Dump
}

// CmdJump ...
func (r *Room) CmdJump(jump bool) {
	a := &cmdJump{
		Jump: jump,
	}
	r.cmdCh <- a
}

// CmdRun ...
func (r *Room) CmdRun(run float64) {
	a := &cmdRun{
		Run: run,
	}
	r.cmdCh <- a
}
