import { Component, ElementRef, HostListener } from '@angular/core';
import { Camera } from './game/camera';
import { Application } from 'pixi.js';
import * as WebFont from 'webfontloader';
import { GameService } from './game/game.service';
import { WasmService } from './game/wasm.service';
import { Input } from './game/input';

declare const goRoom: any;
declare const goPlayer: any;
declare const goTick: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	app: Application;

	title = 'RuinOne';

	constructor(
		private el: ElementRef,
		private game: GameService,
		private wasm: WasmService,
	) {
		this.init();

		this.wait();
	}

	wait() {
		Promise.all([
			this.wasm.wait,
			this.fontWait(),
		]).then(() => {
			this.game.init();
			this.app.ticker.add((delta) => {
				this.game.tick(delta);
			});
		});
	}

	fontWait() {
		return new Promise((resolve, reject) => {
			WebFont.load({
				google: {
					families: ['Roboto Mono', 'Roboto']
				},
				active: () => {
					resolve();
				},
			});
		});
	}

	init() {

		const app = new Application({
			resolution: window.devicePixelRatio || 1,
			resizeTo: window,
		});
		app.renderer.backgroundColor = 0x112233;

		Camera.init(app.screen);

		this.el.nativeElement.appendChild(app.view);
		this.app = app;
		this.game.setApp(app);
		console.log('app init');

		const ver = '1';
		const v = localStorage.getItem('ver');
		if (v !== ver) {
			localStorage.clear();
			localStorage.setItem('ver', ver);
		}
	}

	@HostListener('click', ['$event'])
	click(e) {
		// console.log('mouse click', e);
	}

	@HostListener('window:keydown', ['$event'])
	keyDown(e: KeyboardEvent) {
		Input.key(e.keyCode, true);
		// console.log('keydown', e.keyCode, e);
	}

	@HostListener('window:keyup', ['$event'])
	keyUp(e: KeyboardEvent) {
		Input.key(e.keyCode, false);
		// console.log('keyup', e.keyCode, e);
	}
}
