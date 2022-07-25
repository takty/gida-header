/**
 * Gida Header - Scroll
 *
 * @author Takuto Yanagida
 * @version 2022-07-25
 */


window['GIDA'] = window['GIDA'] ?? {};


window['GIDA'].header_scroll = function (id = null, opts = {}) {
	const CLS_ELM     = 'gida-header';
	const CLS_ELM_TOP = 'gida-header-top';

	const CLS_STICKY   = 'sticky';
	const CLS_FLOATING = 'floating';

	const minWindowWidth      = opts['minWindowWidth']      ?? 600;
	const maxHeaderHeightRate = opts['maxHeaderHeightRate'] ?? 0.2;
	const minSwitchingOffset  = opts['minSwitchingOffset']  ?? 20;
	const minSwitchingTime    = opts['minSwitchingTime']    ?? 200;
	const scrollPaddingOffset = opts['scrollPaddingOffset'] ?? 8;

	let elm;
	let elmTop;

	let isEnabled     = false;
	let cmsBarHeight  = 0;
	let lastSwitchedY = 0;
	let lastSwitchedT = 0;


	// -------------------------------------------------------------------------


	// @include __scroll-padding-top.js
	// @include _common.js


	// -------------------------------------------------------------------------


	onLoad(() => {
		initializeScrollPaddingTop();

		elm = id ? document.getElementById(id) : document.getElementsByClassName(CLS_ELM)[0];
		if (!elm) return;
		elmTop = elm.getElementsByClassName(CLS_ELM_TOP)[0] ?? elm;

		onResize(onResizeHandler, true);
		onScroll(update, true)
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
			elm.style.position = 'sticky';
		} else {
			elm.classList.remove(CLS_STICKY, CLS_FLOATING);
			elm.style.position = null;
			elm.style.top      = null;

			setScrollPaddingTop('gida-header', null);
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		const top = cmsBarHeight - relativeOffsetTop(elm, elmTop);
		elm.style.top = top + 'px';

		const h = elm.getBoundingClientRect().height + top + scrollPaddingOffset;
		setScrollPaddingTop('gida-header', h);
	}

	function update() {
		if (!isEnabled) return;
		const top = Math.floor(elmTop.getBoundingClientRect().top);
		setFloating(top <= cmsBarHeight);
	}

	function setFloating(flag) {
		if (elm.classList.contains(CLS_FLOATING) === flag) return;
		if (Math.abs(lastSwitchedY - window.scrollY) <= minSwitchingOffset) return;
		lastSwitchedY = window.scrollY;
		if (Math.abs(lastSwitchedT - performance.now()) <= minSwitchingTime) return;
		lastSwitchedT = performance.now();

		if (flag) {
			elm.classList.add(CLS_FLOATING);
		} else {
			elm.classList.remove(CLS_FLOATING);
		}
	}


	// Common ------------------------------------------------------------------


	function isStickable() {
		if (window.innerWidth < minWindowWidth) return false;
		if (window.innerHeight * maxHeaderHeightRate < elmTop.clientHeight) return false;
		return true;
	}

};
