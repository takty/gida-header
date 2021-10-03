/**
 *
 * Gida Header - Fixed (JS)
 *
 * @author Takuto Yanagida
 * @version 2021-09-30
 *
 */


window['GIDA'] = window['GIDA'] ?? {};


window['GIDA'].header_fixed = function (id = null, opts = {}) {
	const CLS_ELM     = 'gida-header';
	const CLS_ELM_TOP = 'gida-header-top';

	const CLS_STICKY   = 'sticky';
	const CLS_FLOATING = 'floating';
	const CLS_OFFSET   = 'offset';

	const minWindowWidth      = opts['minWindowWidth']      ?? 600;
	const maxHeaderHeightRate = opts['maxHeaderHeightRate'] ?? 0.2;

	let elm;
	let elmTop;

	let elmPh;
	let isEnabled = false;


	// -------------------------------------------------------------------------


	// @include _common.js


	// -------------------------------------------------------------------------


	document.addEventListener('DOMContentLoaded', function () {
		elm = document.getElementsByClassName(CLS_ELM)[0];
		elmTop = document.getElementsByClassName(CLS_ELM_TOP)[0];
		if (!elm || !elmTop) return;

		elmPh = document.createElement('div');

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
			elm.parentNode.insertBefore(elmPh, elm);
			elm.classList.add(CLS_STICKY);
		} else {
			elm.classList.remove(CLS_STICKY, CLS_FLOATING, CLS_OFFSET);
			elm.parentNode.removeChild(elmPh);
			elm.style.top = null;
			elm.style.transform = null;
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		const top = elmPh.getBoundingClientRect().top + window.pageYOffset;
		elm.style.top = top + 'px';
	}

	function update() {
		if (!isEnabled) return;
		setFloating(window.pageYOffset !== 0);

		const origBcrTop = elmPh.getBoundingClientRect().top;
		const top = origBcrTop + relativeOffsetTop(elm, elmTop);
		if (top <= getWpAdminBarHeight()) {
			const offset = origBcrTop + relativeOffsetTop(elm, elmTop) + window.pageYOffset - getWpAdminBarHeight();
			elm.style.transform = `translateY(-${offset}px)`;
			elm.classList.add(CLS_OFFSET);
		} else {
			elm.style.transform = null;
			elm.classList.remove(CLS_OFFSET);
		}
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
