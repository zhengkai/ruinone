import { Injectable } from '@angular/core';
import { Application, Graphics, Text } from 'pixi.js';
import { Debug } from './debug';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	app: Application;

	debug: Debug;

	init = false;

	t: Text;

	count = 0;

	constructor() {
	}

	tick(delta: number) {

		if (!this.init) {
			this.init = true;
			this.doInit();
		}

		this.count++;

		this.debug.run();
		// this.t.text('' + this.count);

		// console.log('game tick', this.app, Math.PI / delta);
	}

	doInit() {

		const a = this.app;

		this.debug = new Debug(a);

		console.log('game init', a);
	}
}
