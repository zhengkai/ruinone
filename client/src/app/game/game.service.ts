import { Injectable } from '@angular/core';
import { Application, Graphics, Text } from 'pixi.js';
import { World } from './world';
import { Screen } from './screen';
import { Debug } from './debug';
import { Menu } from './menu';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	app: Application;

	world: World;
	screen: Screen;
	debug: Debug;
	menu: Menu;

	constructor() {
		// console.log('abc', a);
	}

	tick(delta: number) {
		this.screen.run();
		this.world.run();
		this.debug.run();
		this.menu.run();
	}

	setApp(app: Application) {
		this.app = app;
		this.screen = new Screen(app);
	}

	init() {
		const a = this.app;

		this.world = new World(a, this.screen);

		this.debug = new Debug(a);
		this.debug.target = this;

		this.menu = new Menu();
		this.menu.init(this);

		this.screen.init();
		this.world.init();

		console.log('game init', a);
	}
}
