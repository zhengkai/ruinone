package room

import (
	jLog "github.com/zhengkai/j"
)

var (
	j *jLog.Logger
)

func initLog() {

	j = jLog.NewPure(&jLog.Config{
		Tunnel:     1000,
		Echo:       true,
		TimeFormat: ``,
		Caller:     jLog.CallerShorter,
	})
}
