import { GamePart } from './game.part';
import { Input, InputData } from './input';

declare const goPause: any;
declare const goJump: any;
declare const goRun: any;

export class Control extends GamePart {

	jumpSent = false;
	runSent = 0;

	debugDisplay = false;
	debugPrev = false;

	pauseSet = false;
	pausePrev = false;

	run() {

		const c = Input.get();

		this.runCommon(c);

		switch (this.n.mode) {

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
			this.debugPrev = c.debug;
			if (c.debug) {
				this.debugDisplay = !this.debugDisplay;
				this.n.debug.setDisplay(this.debugDisplay);
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
				this.n.world.pause = this.pauseSet;
				this.n.ui.pause.visible = this.pauseSet;
			}
		}
	}

	runEditor(c: InputData) {
	}
}
