package room

import (
	"math/rand"
	"time"
)

// Room ...
type Room struct {
	ID    int
	pl    map[int]*Player
	rand  *rand.Rand
	cmdCh chan interface{}
	ai    int
	me    *Player
	fps   int

	tickCount         int
	tickTime          *time.Time
	tickDuration      time.Duration
	tickDurationFloat float64
}

func (r *Room) mngDump(a *cmdDump) {

	a.Dump = r.Dump()

	a.mutex.Unlock()
}

func (r *Room) addPlayer(p *Player) {
	p.room = r
	r.pl[p.ID] = p
}

func (r *Room) tick(t *time.Time) {

	for _, p := range r.pl {
		p.tick()
	}

	r.tickCount++
	r.tickTime = t

	if r.me != nil {
		r.me.parseControl()
	}
}

// Dump ...
func (r *Room) Dump() (a map[string]interface{}) {

	duration := time.Now().Sub(*r.tickTime)
	if duration > r.tickDuration {
		duration = r.tickDuration
	}

	rate := float64(duration) / r.tickDurationFloat

	a = make(map[string]interface{})
	a[`tick`] = r.tickCount

	pl := []interface{}{}
	for _, p := range r.pl {
		v, ok := p.Dump(rate)
		if !ok {
			continue
		}
		pl = append(pl, v)
	}

	a[`playerList`] = pl

	return
}
