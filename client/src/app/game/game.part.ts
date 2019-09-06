import { Nexus } from './nexus';

export class GamePart {

	n: Nexus;

	constructor() {
	}

	setNexus(n: Nexus) {
		this.n = n;
		this.nexusDone();
	}

	nexusDone() {
	}

	initGame() {
		this.init();
	}

	init() {
	}

	run() {
	}
}
