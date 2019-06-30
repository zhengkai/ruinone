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

	constructor() {
	}

	tick(delta: number) {

		if (!this.init) {
			this.init = true;
			this.doInit();
		}

		this.screen.run();
		this.world.run();
		this.debug.run();
		// this.t.text('' + this.count);

		// console.log('game tick', this.app, Math.PI / delta);
	}

	doInit() {

		const a = this.app;

		this.world = new World(a);
		this.world.target = this;

		this.screen = new Screen(a);

		this.debug = new Debug(a);
		this.debug.target = this;

		console.log('game init', a);
	}
}
