package room

import (
	"math/rand"
	"sync/atomic"
)

var (
	ai = uint64(0)
)

// New ...
func New(seed int64) (r *Room) {

	id := atomic.AddUint64(&ai, 1)

	// t := time.Now()
	// seed64 = int64(seed) + t.UnixNano()

	r = &Room{
		ID:    int(id),
		PL:    make(map[int]*Player),
		Rand:  rand.New(rand.NewSource(seed)),
		cmdCh: make(chan interface{}),
		ai:    1,
	}

	p := NewPlayer(r.ai)
	r.addPlayer(p)
	r.me = p

	go r.manager()

	j.Log(`seed`, seed, r.Rand.Int63())

	j.Log(`mngNewRoom`, ai, r)

	return
}
