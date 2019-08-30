package room

import (
	"time"
)

var (
	roomMap   = make(map[int]*Room)
	playerMap = make(map[int]*Player)
	room      *Room
	player    *Player
)

func (r *Room) manager() {

	ticker := time.NewTicker(r.tickDuration)

	var a interface{}
	var t time.Time

	for {

		select {

		case a = <-r.cmdCh:

			switch a.(type) {

			case *cmdNewPlayer:
				r.mngNewPlayer(a.(*cmdNewPlayer))

			case *cmdDump:
				r.mngDump(a.(*cmdDump))

			case *cmdJump:
				r.mngJump(a.(*cmdJump))

			case *cmdRun:
				r.mngRun(a.(*cmdRun))

			case *cmdSetMap:
				r.mngSetMap(a.(*cmdSetMap))

			case *cmdPause:
				r.mngPause(a.(*cmdPause))

			case *cmdClose:
				ticker.Stop()
				return

			default:
				j.Log(`unknown cmd`, a)
			}

		case t = <-ticker.C:

			r.tick(&t)
		}
	}
}
