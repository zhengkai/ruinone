package room

import (
	"math/rand"
	"sync/atomic"
	"time"
)

var (
	ai = uint64(0)
)

// New ...
func New(seed int64, fps int) (r *Room) {

	fps = fps / 2 * 2

	id := atomic.AddUint64(&ai, 1)

	// t := time.Now()
	// seed64 = int64(seed) + t.UnixNano()

	if fps < 2 {
		fps = 2
	} else if fps > 1000 {
		fps = 1000
	}

	duration := time.Second / time.Duration(fps)

	r = &Room{
		ID:    int(id),
		pl:    make(map[int]*Player),
		rand:  rand.New(rand.NewSource(seed)),
		cmdCh: make(chan interface{}, 10),
		ai:    1,
		fps:   fps,
		field: &fieldMap{},

		tickTime:          time.Now(),
		tickDuration:      duration,
		tickDurationFloat: float64(duration),
	}

	p := NewPlayer(r.ai, fps)
	r.addPlayer(p)
	r.me = p

	go r.manager()

	j.Log(`seed`, seed, r.rand.Int63())

	j.Log(`mngNewRoom`, ai, r)

	return
}
