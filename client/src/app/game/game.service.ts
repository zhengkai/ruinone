import { Injectable } from '@angular/core';
import { Application, Graphics, Text } from 'pixi.js';
import { Input } from './input';
import { World } from './world';
import { Editor } from './editor';
import { Screen } from './screen';
import { Debug } from './debug';
import { Camera } from './camera';
import { Menu } from './menu';
import { UI } from './ui';
import { Control } from './control';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	app: Application;

	world: World;
	screen: Screen;
	debug: Debug;
	menu: Menu;
	editor: Editor;
	control: Control;
	ui: UI;

	mode = 'world';

	constructor() {
		// console.log('abc', a);
	}

	switch(name: string) {
		this.mode = name;
		for (const s of ['world', 'editor']) {
			const o = this[s];
			if (name === s) {
				o.show();
			} else {
				o.hide();
			}
		}
	}

	tick(delta: number) {

		Camera.calc();
		this.sortChildren();

		this.control.run();

		this.screen.run();
		this.world.run();
		this.debug.run();
		this.menu.run();
		this.editor.run();
	}

	setApp(app: Application) {
		this.app = app;
		this.screen = new Screen(app);
	}

	init() {
		const a = this.app;

		this.world = new World();

		this.debug = new Debug();
		this.debug.init(this);

		this.ui = new UI();
		this.ui.init(this);

		this.menu = new Menu();
		this.menu.init(this);

		this.editor = new Editor();
		this.editor.init(this);

		this.screen.init();

		this.control = new Control();
		this.control.init(this);

		// world init after all
		this.world.init(this);

		this.sortChildren();

		console.log('game init', this, Camera.resize);

		this.switch(this.mode);
	}

	sortChildren() {
		if (Camera.resize) {
			this.app.stage.sortChildren();
		}
	}
}
