import { Component, ElementRef, HostListener } from '@angular/core';
import { Camera } from './game/camera';
import { Application } from 'pixi.js';
import * as WebFont from 'webfontloader';
import { Nexus } from './game/nexus';
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

	title = 'RuinOne';

	constructor(
		private el: ElementRef,
		private nexus: Nexus,
		private wasm: WasmService,
	) {
		this.init();

		Promise.all([
			wasm.wait,
			this.fontWait(),
		]).then(() => {
			this.nexus.init();
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
		this.nexus.setApp(app);
		console.log('app init');

		const ver = '1';
		const v = localStorage.getItem('ver');
		if (v !== ver) {
			localStorage.clear();
			localStorage.setItem('ver', ver);
		}
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
