/**
 * Gida Header - Slide
 *
 * @author Takuto Yanagida
 * @version 2022-07-23
 */


window['GIDA'] = window['GIDA'] ?? {};


window['GIDA'].header_slide = function (id = null, opts = {}) {
	const CLS_ELM     = 'gida-header';
	const CLS_ELM_TOP = 'gida-header-top';

	const CLS_STICKY   = 'sticky';
	const CLS_FLOATING = 'floating';
	const CLS_STATIC   = 'static';

	const minWindowWidth      = opts['minWindowWidth']      ?? 600;
	const maxHeaderHeightRate = opts['maxHeaderHeightRate'] ?? 0.2;
	const minSwitchingOffset  = opts['minSwitchingOffset']  ?? 20;
	const scrollPaddingOffset = opts['scrollPaddingOffset'] ?? 8;
	const slideMargin         = opts['slideMargin']         ?? 200;

	let elm;
	let elmTop;

	let isEnabled     = false;
	let cmsBarHeight  = 0;
	let lastSwitchedY = 0;
	let origTop       = 0;
	let origBottom    = 0;
	let floatTop      = 0;


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
			elm.style.top = null;

			setScrollPaddingTop('gida-header', null);
		}
		isEnabled = flag;
	}

	function adjustFloating() {
		const r = getStaticBoundingClientRect(elm);

		origTop    = r.top + window.scrollY;
		origBottom = r.bottom + window.scrollY;
		floatTop   = Math.ceil(cmsBarHeight - relativeOffsetTop(elm, elmTop));

		// elm.style.top = origTop - window.scrollY + 'px';
		const h = r.bottom + scrollPaddingOffset;
		setScrollPaddingTop('gida-header', h);
	}

	let st = null;

	function update() {
		if (!isEnabled) return;
		if (Math.abs(lastSwitchedY - window.scrollY) <= minSwitchingOffset) return;
		lastSwitchedY = window.scrollY;

		clearTimeout(st);

		if (origBottom + slideMargin <= window.scrollY + cmsBarHeight) {
			elm.classList.add(CLS_FLOATING);
			elm.style.top = origTop - window.scrollY + 'px';
			setTimeout(() => { elm.style.top = floatTop + 'px'; }, 0);
		} else {
			if (window.scrollY + cmsBarHeight < origBottom) {
				// elm.classList.add(CLS_STATIC);
				elm.style.top = null;
				elm.classList.remove(CLS_FLOATING);
				// setTimeout(() => elm.classList.remove(CLS_STATIC), 0);
			} else {
				elm.style.top = origTop - window.scrollY + 'px';
				st = setTimeout(() => {
					elm.style.top = null;
					elm.classList.remove(CLS_FLOATING);
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
