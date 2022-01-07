/**
 *
 * Gida Header - Fixed (JS)
 *
 * @author Takuto Yanagida
 * @version 2022-01-07
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
	const minSwitchingOffset  = opts['minSwitchingOffset']  ?? 20;
	const scrollPaddingOffset = opts['scrollPaddingOffset'] ?? 8;

	let elm;
	let elmTop;

	let isEnabled     = false;
	let cmsBarHeight  = 0;
	let lastSwitchedY = 0;
	let origTop       = 0;
	let offsetTop     = 0;


	// -------------------------------------------------------------------------


	// @include __scroll-padding-top.js
	// @include _common.js


	// -------------------------------------------------------------------------


	document.addEventListener('DOMContentLoaded', () => {
		initializeScrollPaddingTop();

		elm = id ? document.getElementById(id) : document.getElementsByClassName(CLS_ELM)[0];
		if (!elm) return;
		elmTop = elm.getElementsByClassName(CLS_ELM_TOP)[0] ?? elm;

		onResize(onResizeHandler, true);
		onScroll(update, true);
	});

	function onResizeHandler() {
		setEnabled(isStickable());
		if (isEnabled) {
			cmsBarHeight = getCmsBarHeight();
			adjustFloating();
			update();
		}
	}

	function setEnabled(flag) {
		if (flag === isEnabled) return;
		if (flag) {
			elm.classList.add(CLS_STICKY);
		} else {
			elm.classList.remove(CLS_STICKY, CLS_FLOATING, CLS_OFFSET);
			elm.style.top = null;

			setScrollPaddingTop('gida-header', null);
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		origTop = getStaticTop(elm) + window.scrollY;
		elm.style.top = origTop + offsetTop + 'px';

		const h = elm.getBoundingClientRect().height + origTop + offsetTop + scrollPaddingOffset;
		setScrollPaddingTop('gida-header', h);
	}

	function update() {
		if (!isEnabled) return;
		setFloating(window.pageYOffset !== 0);
		const top = getStaticTop(elm) + relativeOffsetTop(elm, elmTop);
		setOffset(top <= cmsBarHeight);
	}

	function setFloating(flag) {
		if (elm.classList.contains(CLS_FLOATING) === flag) return;
		if (flag) {
			elm.classList.add(CLS_FLOATING);
		} else {
			elm.classList.remove(CLS_FLOATING);
		}
	}

	function setOffset(flag) {
		if (elm.classList.contains(CLS_OFFSET) === flag) return;
		if (Math.abs(lastSwitchedY - window.scrollY) <= minSwitchingOffset) return;
		lastSwitchedY = window.scrollY;

		offsetTop = flag ? (-origTop + cmsBarHeight - relativeOffsetTop(elm, elmTop)) : 0;
		if (flag) {
			elm.classList.add(CLS_OFFSET);
		} else {
			elm.classList.remove(CLS_OFFSET);
		}
		elm.style.top = origTop + offsetTop + 'px';

		const h = elm.getBoundingClientRect().height + origTop + offsetTop + scrollPaddingOffset;
		setScrollPaddingTop('gida-header', h);
	}

	function getStaticTop(elm) {
		const origPos = elm.style.position;
		elm.style.position = 'static';
		const top = elm.getBoundingClientRect().top;
		elm.style.position = origPos;
		return top;
	}


	// Common ------------------------------------------------------------------


	function isStickable() {
		if (window.innerWidth < minWindowWidth) return false;
		if (window.innerHeight * maxHeaderHeightRate < elmTop.clientHeight) return false;
		return true;
	}

};
