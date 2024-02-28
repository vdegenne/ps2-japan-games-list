import {LitElement, html} from 'lit';
import {customElement, state as _state} from 'lit/decorators.js';
import {withStyles} from 'lit-with-styles';
import styles from './app-shell.css?inline';
import {materialShellLoadingOff} from 'material-shell';
import data from '../games-list.json';
import {googleImagesUrl} from '@vdegenne/links';
import {ReactiveController} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';

@saveToLocalStorage('ps2-japan-games-list')
class AppState extends ReactiveController {
	@_state() checkeds: string[] = [];
	addItem(name: string) {
		this.checkeds = [...this.checkeds, name];
	}
	removeItem(name: string) {
		if (this.checkeds.splice(this.checkeds.indexOf(name) >>> 0, 1).length) {
			this.checkeds = [...this.checkeds];
		}
	}
}
const state = new AppState();

@customElement('app-shell')
@withStyles(styles)
export class AppShell extends LitElement {
	firstUpdated() {
		materialShellLoadingOff.call(this);
		state.bind(this);
	}

	render() {
		return html`
			<md-list @click=${this.#handleClick}>
				${data.map((gameName) => {
					const name = gameName.replace(/\s\(Japan\)$/, '');
					const checked = state.checkeds.includes(name);
					return html`
						<md-list-item
							href=${googleImagesUrl(`${name} Japan PS2 Screenshots`)}
							target="_blank"
							?checked=${checked}
						>
							<md-checkbox slot="start" .checked=${checked}></md-checkbox>
							<div slot="headline">${name}</div>
							<md-icon-button
								slot="end"
								href="https://archive.org/download/rr-sony-playstation-j3/japan/iso/${encodeURIComponent(
									`${gameName}.7z`,
								)}"
								><md-icon>download</md-icon></md-icon-button
							>
						</md-list-item>
					`;
				})}
			</md-list>
		`;
	}

	#handleClick(event: Event) {
		const target = event.target as HTMLElement;
		const item = target.closest('md-list-item');
		if (item) {
			const name = item.querySelector('[slot=headline]').textContent.trim();
			if (!state.checkeds.includes(name)) {
				state.addItem(name);
			} else {
				if (target.tagName === 'MD-CHECKBOX') {
					state.removeItem(name);
				}
			}
		}
	}
}

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

export const app = window.app; // = new AppShell());
