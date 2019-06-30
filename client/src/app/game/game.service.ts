import { Injectable } from '@angular/core';
import { Application, Graphics, Text } from 'pixi.js';
import { World } from './world';
import { Screen } from './screen';
import { Debug } from './debug';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	app: Application;

	world: World;
	screen: Screen;
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

		this.world.run();

		this.screen.run();

		this.debug.run();
		// this.t.text('' + this.count);

		// console.log('game tick', this.app, Math.PI / delta);
	}

	doInit() {

		const a = this.app;

		this.world = new World(a);

		this.screen = new Screen(a);

		this.debug = new Debug(a);
		this.debug.target = this;

		console.log('game init', a);
	}
}
