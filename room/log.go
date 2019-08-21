package room

import (
	jLog "github.com/zhengkai/j"
)

var (
	j *jLog.Logger
)

func initLog() {

	j = jLog.NewPure(&jLog.Config{
		Echo:       true,
		TimeFormat: ``,
		Caller:     jLog.CallerShorter,
	})
}
