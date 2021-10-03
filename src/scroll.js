/**
 *
 * Gida Header - Scroll (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-09-30
 *
 */


window['GIDA'] = window['GIDA'] ?? {};


window['GIDA'].header_scroll = function (id = null, opts = {}) {
	const CLS_ELM     = 'gida-header';
	const CLS_ELM_TOP = 'gida-header-top';

	const CLS_STICKY   = 'sticky';
	const CLS_FLOATING = 'floating';

	const minWindowWidth      = opts['minWindowWidth']      ?? 600;
	const maxHeaderHeightRate = opts['maxHeaderHeightRate'] ?? 0.2;

	let elm;
	let elmTop;

	let isEnabled  = false;


	// -------------------------------------------------------------------------


	// @include _common.js


	// -------------------------------------------------------------------------


	document.addEventListener('DOMContentLoaded', function () {
		elm    = document.getElementsByClassName(CLS_ELM)[0];
		elmTop = document.getElementsByClassName(CLS_ELM_TOP)[0];
		if (!elm || !elmTop) return;

		onResize(onResizeHandler, true);
		onScroll(update, true);
	});

	function onResizeHandler() {
		setEnabled(isStickable());
		if (isEnabled) {
			adjustFloating();
			update();
		}
	}

	function setEnabled(flag) {
		if (flag === isEnabled) return;
		if (flag) {
			elm.classList.add(CLS_STICKY);
		} else {
			elm.classList.remove(CLS_STICKY, CLS_FLOATING);
			elm.style.top = null;
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		const top = getWpAdminBarHeight() - relativeOffsetTop(elm, elmTop);
		elm.style.top = top + 'px';
	}

	function update() {
		if (!isEnabled) return;
		const top = Math.floor(elmTop.getBoundingClientRect().top);
		setFloating(top <= getWpAdminBarHeight());
	}

	function setFloating(flag) {
		if (elm.classList.contains(CLS_FLOATING) === flag) return;
		if (flag) {
			elm.classList.add(CLS_FLOATING);
		} else {
			elm.classList.remove(CLS_FLOATING);
		}
	}


	// Common ------------------------------------------------------------------


	function relativeOffsetTop(ancestor, target) {
		return target.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
	}

	function isStickable() {
		if (window.innerWidth < minWindowWidth) return false;
		if (window.innerHeight * maxHeaderHeightRate < elmTop.clientHeight) return false;
		return true;
	}

};
