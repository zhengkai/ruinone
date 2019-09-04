import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

declare const WebAssembly: any;
declare const Go: any;
declare const goFibonacci: any;

@Injectable({
	providedIn: 'root'
})
export class WasmService {

	module: any;

	ev = new EventTarget();

	ready: boolean;

	wait: any;

	constructor() {
		this.wait = new Promise((resolve, reject) => {
			this.ev.addEventListener('initialized', (event) => {
				resolve();
			});
			this.instantiateWasm('assets/main.wasm');
		});
	}

	private async instantiateWasm(url: string) {
		const wasmFile = await fetch(url);
		const source = await wasmFile.arrayBuffer();
		const go = new Go();
		const result = await WebAssembly.instantiate(source, go.importObject);

		go.run(result.instance);
		this.ready = true;
		this.ev.dispatchEvent(new CustomEvent('initialized'));
	}
}
