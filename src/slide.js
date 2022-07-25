/**
 * Gida Header - Slide
 *
 * @author Takuto Yanagida
 * @version 2022-07-25
 */


window['GIDA'] = window['GIDA'] ?? {};


window['GIDA'].header_slide = function (id = null, opts = {}) {
	const CLS_ELM     = 'gida-header';
	const CLS_ELM_TOP = 'gida-header-top';

	const CLS_STICKY   = 'sticky';
	const CLS_FLOATING = 'floating';

	const minWindowWidth      = opts['minWindowWidth']      ?? 600;
	const maxHeaderHeightRate = opts['maxHeaderHeightRate'] ?? 0.2;
	const minSwitchingOffset  = opts['minSwitchingOffset']  ?? 20;
	const minSwitchingTime    = opts['minSwitchingTime']    ?? 200;
	const scrollPaddingOffset = opts['scrollPaddingOffset'] ?? 8;
	const slideMargin         = opts['slideMargin']         ?? 200;

	let elm;
	let elmTop;

	let isEnabled     = false;
	let cmsBarHeight  = 0;
	let lastSwitchedY = 0;
	let lastSwitchedT = 0;
	let origTop       = 0;
	let origBottom    = 0;
	let floatTop      = 0;
	let st            = null;


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
		} else {
			elm.classList.remove(CLS_STICKY, CLS_FLOATING);
			elm.style.position = null;
			elm.style.top      = null;

			setScrollPaddingTop('gida-header', null);
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		const r = getStaticBoundingClientRect(elm);

		origTop    = r.top + window.scrollY;
		origBottom = r.bottom + window.scrollY;
		floatTop   = Math.ceil(cmsBarHeight - relativeOffsetTop(elm, elmTop));

		const h = r.bottom + scrollPaddingOffset;
		setScrollPaddingTop('gida-header', h);
	}

	function update() {
		if (!isEnabled) return;
		setFloating(origBottom + slideMargin <= window.scrollY + cmsBarHeight);
	}

	function setFloating(flag) {
		if (elm.classList.contains(CLS_FLOATING) === flag) return;
		if (Math.abs(lastSwitchedY - window.scrollY) <= minSwitchingOffset) return;
		lastSwitchedY = window.scrollY;
		if (Math.abs(lastSwitchedT - performance.now()) <= minSwitchingTime) return;
		lastSwitchedT = performance.now();

		clearTimeout(st);
		if (flag) {
			elm.classList.add(CLS_FLOATING);

			elm.style.position = 'sticky';
			elm.style.top      = origTop - window.scrollY + 'px';
			st = setTimeout(() => {
				elm.style.top = floatTop + 'px';
			}, 0);
		} else {
			elm.classList.remove(CLS_FLOATING);

			if (window.scrollY + cmsBarHeight < origBottom) {
				elm.style.position = null;
				elm.style.top      = null;
			} else {
				elm.style.top = origTop - window.scrollY + 'px';
				st = setTimeout(() => {
					elm.style.position = null;
					elm.style.top      = null;
				}, 200);
			}
		}
	}


	// Common ------------------------------------------------------------------


	function isStickable() {
		if (window.innerWidth < minWindowWidth) return false;
		if (window.innerHeight * maxHeaderHeightRate < elmTop.clientHeight) return false;
		return true;
	}

};
