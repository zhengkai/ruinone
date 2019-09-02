import { GameService } from './game.service';
import { Input, InputData } from './input';

declare const goPause: any;
declare const goJump: any;
declare const goRun: any;

export class Control {

	jumpSent = false;
	runSent = 0;

	debugDisplay = false;
	debugPrev = false;

	pauseSet = false;
	pausePrev = false;

	game: GameService;

	init(game: GameService) {
		this.game = game;
		game.debug.setDisplay(this.debugDisplay);
	}

	run() {

		const c = Input.get();

		switch (this.game.mode) {

			case 'world':
				this.runGame(c);
				break;

			case 'editor':
				this.runEditor(c);
				break;
		}
	}

	runCommon(c: InputData) {
		// debug

		if (this.debugPrev !== c.debug) {
			// console.log('debug', c.debug);
			this.debugPrev = c.debug;
			if (c.debug) {
				this.debugDisplay = !this.debugDisplay;
				this.game.debug.setDisplay(this.debugDisplay);
			}
		}
	}

	runGame(c: InputData) {

		// jump

		if (this.jumpSent !== c.jump) {
			this.jumpSent = c.jump;
			goJump(this.jumpSent);
		}

		// run

		let run = 0;
		if (c.e) {
			run = 1;
		} else if (c.w) {
			run = -1;
		}
		if (this.runSent !== run) {
			this.runSent = run;
			goRun(this.runSent);
		}

		// pause
		if (this.pausePrev !== c.pause) {
			this.pausePrev = c.pause;
			if (c.pause) {
				this.pauseSet = !this.pauseSet;
				goPause(this.pauseSet);
			}
		}

	}

	runEditor(c: InputData) {
	}
}
