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

	field *fieldMap

	W float64
	H float64

	pause bool

	tickCount         int
	tickTime          *time.Time
	tickDuration      time.Duration
	tickDurationFloat float64
}

func (r *Room) mngSetMap(a *cmdSetMap) {

	for _, v := range r.pl {
		p := NewPlayer(v.ID, r.fps)
		r.addPlayer(p)

		if r.me == v {
			r.me = p
		}
	}

	var list []*field
	id := 0

	for i, s := range a.Map {

		if i == 0 {
			continue
		}

		x := i / 16
		y := i % 16
		if x > 30 {
			break
		}

		if s != '1' {
			continue
		}

		id++
		f := &field{
			id: id,
		}

		f.W = 1
		f.H = 1
		f.X = float64(x)
		f.Y = float64(y)

		list = append(list, f)
	}

	r.H = 16
	r.W = 30

	r.field = &fieldMap{
		list: list,
	}

	// j.Log(`room set map`, len(r.field.list), a.Map)
}

func (r *Room) mngPause(a *cmdPause) {
	r.pause = a.Pause

	// j.Log(`room set pause`, r.pause)
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

	if r.pause {
		return
	}

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
