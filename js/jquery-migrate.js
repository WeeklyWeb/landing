/*!
 * jQuery Migrate - v3.3.2 - 2020-11-18T08:29Z
 * Copyright OpenJS Foundation and other contributors
 */
(function(factory) { "use strict"; if (typeof define === "function" && define.amd) { define(["jquery"], function(jQuery) { return factory(jQuery, window); }); } else if (typeof module === "object" && module.exports) { module.exports = factory(require("jquery"), window); } else { factory(jQuery, window); } })(function(jQuery, window) {
    "use strict";
    jQuery.migrateVersion = "3.3.2";

    function compareVersions(v1, v2) {
        var i, rVersionParts = /^(\d+)\.(\d+)\.(\d+)/,
            v1p = rVersionParts.exec(v1) || [],
            v2p = rVersionParts.exec(v2) || [];
        for (i = 1; i <= 3; i++) {
            if (+v1p[i] > +v2p[i]) { return 1; }
            if (+v1p[i] < +v2p[i]) { return -1; }
        }
        return 0;
    }

    function jQueryVersionSince(version) { return compareVersions(jQuery.fn.jquery, version) >= 0; }
    (function() {
        if (!window.console || !window.console.log) { return; }
        if (!jQuery || !jQueryVersionSince("3.0.0")) { window.console.log("JQMIGRATE: jQuery 3.0.0+ REQUIRED"); }
        if (jQuery.migrateWarnings) { window.console.log("JQMIGRATE: Migrate plugin loaded multiple times"); }
        window.console.log("JQMIGRATE: Migrate is installed" +
            (jQuery.migrateMute ? "" : " with logging active") +
            ", version " + jQuery.migrateVersion);
    })();
    var warnedAbout = {};
    jQuery.migrateDeduplicateWarnings = true;
    jQuery.migrateWarnings = [];
    if (jQuery.migrateTrace === undefined) { jQuery.migrateTrace = true; }
    jQuery.migrateReset = function() {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0;
    };

    function migrateWarn(msg) {
        var console = window.console;
        if (!jQuery.migrateDeduplicateWarnings || !warnedAbout[msg]) {
            warnedAbout[msg] = true;
            jQuery.migrateWarnings.push(msg);
            if (console && console.warn && !jQuery.migrateMute) { console.warn("JQMIGRATE: " + msg); if (jQuery.migrateTrace && console.trace) { console.trace(); } }
        }
    }

    function migrateWarnProp(obj, prop, value, msg) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get: function() { migrateWarn(msg); return value; },
            set: function(newValue) {
                migrateWarn(msg);
                value = newValue;
            }
        });
    }

    function migrateWarnFunc(obj, prop, newFunc, msg) { obj[prop] = function() { migrateWarn(msg); return newFunc.apply(this, arguments); }; }
    if (window.document.compatMode === "BackCompat") { migrateWarn("jQuery is not compatible with Quirks Mode"); }
    var findProp, class2type = {},
        oldInit = jQuery.fn.init,
        oldFind = jQuery.find,
        rattrHashTest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,
        rattrHashGlob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g,
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    jQuery.fn.init = function(arg1) {
        var args = Array.prototype.slice.call(arguments);
        if (typeof arg1 === "string" && arg1 === "#") {
            migrateWarn("jQuery( '#' ) is not a valid selector");
            args[0] = [];
        }
        return oldInit.apply(this, args);
    };
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.find = function(selector) {
        var args = Array.prototype.slice.call(arguments);
        if (typeof selector === "string" && rattrHashTest.test(selector)) {
            try { window.document.querySelector(selector); } catch (err1) {
                selector = selector.replace(rattrHashGlob, function(_, attr, op, value) { return "[" + attr + op + "\"" + value + "\"]"; });
                try {
                    window.document.querySelector(selector);
                    migrateWarn("Attribute selector with '#' must be quoted: " + args[0]);
                    args[0] = selector;
                } catch (err2) { migrateWarn("Attribute selector with '#' was not fixed: " + args[0]); }
            }
        }
        return oldFind.apply(this, args);
    };
    for (findProp in oldFind) { if (Object.prototype.hasOwnProperty.call(oldFind, findProp)) { jQuery.find[findProp] = oldFind[findProp]; } }
    migrateWarnFunc(jQuery.fn, "size", function() { return this.length; }, "jQuery.fn.size() is deprecated and removed; use the .length property");
    migrateWarnFunc(jQuery, "parseJSON", function() { return JSON.parse.apply(null, arguments); }, "jQuery.parseJSON is deprecated; use JSON.parse");
    migrateWarnFunc(jQuery, "holdReady", jQuery.holdReady, "jQuery.holdReady is deprecated");
    migrateWarnFunc(jQuery, "unique", jQuery.uniqueSort, "jQuery.unique is deprecated; use jQuery.uniqueSort");
    migrateWarnProp(jQuery.expr, "filters", jQuery.expr.pseudos, "jQuery.expr.filters is deprecated; use jQuery.expr.pseudos");
    migrateWarnProp(jQuery.expr, ":", jQuery.expr.pseudos, "jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos");
    if (jQueryVersionSince("3.1.1")) { migrateWarnFunc(jQuery, "trim", function(text) { return text == null ? "" : (text + "").replace(rtrim, ""); }, "jQuery.trim is deprecated; use String.prototype.trim"); }
    if (jQueryVersionSince("3.2.0")) {
        migrateWarnFunc(jQuery, "nodeName", function(elem, name) { return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase(); }, "jQuery.nodeName is deprecated");
        migrateWarnFunc(jQuery, "isArray", Array.isArray, "jQuery.isArray is deprecated; use Array.isArray");
    }
    if (jQueryVersionSince("3.3.0")) {
        migrateWarnFunc(jQuery, "isNumeric", function(obj) { var type = typeof obj; return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj)); }, "jQuery.isNumeric() is deprecated");
        jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(_, name) { class2type["[object " + name + "]"] = name.toLowerCase(); });
        migrateWarnFunc(jQuery, "type", function(obj) {
            if (obj == null) { return obj + ""; }
            return typeof obj === "object" || typeof obj === "function" ? class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj;
        }, "jQuery.type is deprecated");
        migrateWarnFunc(jQuery, "isFunction", function(obj) { return typeof obj === "function"; }, "jQuery.isFunction() is deprecated");
        migrateWarnFunc(jQuery, "isWindow", function(obj) { return obj != null && obj === obj.window; }, "jQuery.isWindow() is deprecated");
    }
    if (jQuery.ajax) {
        var oldAjax = jQuery.ajax,
            rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajax = function() {
            var jQXHR = oldAjax.apply(this, arguments);
            if (jQXHR.promise) {
                migrateWarnFunc(jQXHR, "success", jQXHR.done, "jQXHR.success is deprecated and removed");
                migrateWarnFunc(jQXHR, "error", jQXHR.fail, "jQXHR.error is deprecated and removed");
                migrateWarnFunc(jQXHR, "complete", jQXHR.always, "jQXHR.complete is deprecated and removed");
            }
            return jQXHR;
        };
        if (!jQueryVersionSince("4.0.0")) { jQuery.ajaxPrefilter("+json", function(s) { if (s.jsonp !== false && (rjsonp.test(s.url) || typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data))) { migrateWarn("JSON-to-JSONP auto-promotion is deprecated"); } }); }
    }
    var oldRemoveAttr = jQuery.fn.removeAttr,
        oldToggleClass = jQuery.fn.toggleClass,
        rmatchNonSpace = /\S+/g;
    jQuery.fn.removeAttr = function(name) {
        var self = this;
        jQuery.each(name.match(rmatchNonSpace), function(_i, attr) {
            if (jQuery.expr.match.bool.test(attr)) {
                migrateWarn("jQuery.fn.removeAttr no longer sets boolean properties: " + attr);
                self.prop(attr, false);
            }
        });
        return oldRemoveAttr.apply(this, arguments);
    };
    jQuery.fn.toggleClass = function(state) {
        if (state !== undefined && typeof state !== "boolean") { return oldToggleClass.apply(this, arguments); }
        migrateWarn("jQuery.fn.toggleClass( boolean ) is deprecated");
        return this.each(function() {
            var className = this.getAttribute && this.getAttribute("class") || "";
            if (className) { jQuery.data(this, "__className__", className); }
            if (this.setAttribute) { this.setAttribute("class", className || state === false ? "" : jQuery.data(this, "__className__") || ""); }
        });
    };

    function camelCase(string) { return string.replace(/-([a-z])/g, function(_, letter) { return letter.toUpperCase(); }); }
    var oldFnCss, internalSwapCall = false,
        ralphaStart = /^[a-z]/,
        rautoPx = /^(?:Border(?:Top|Right|Bottom|Left)?(?:Width|)|(?:Margin|Padding)?(?:Top|Right|Bottom|Left)?|(?:Min|Max)?(?:Width|Height))$/;
    if (jQuery.swap) {
        jQuery.each(["height", "width", "reliableMarginRight"], function(_, name) {
            var oldHook = jQuery.cssHooks[name] && jQuery.cssHooks[name].get;
            if (oldHook) {
                jQuery.cssHooks[name].get = function() {
                    var ret;
                    internalSwapCall = true;
                    ret = oldHook.apply(this, arguments);
                    internalSwapCall = false;
                    return ret;
                };
            }
        });
    }
    jQuery.swap = function(elem, options, callback, args) {
        var ret, name, old = {};
        if (!internalSwapCall) { migrateWarn("jQuery.swap() is undocumented and deprecated"); }
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }
        ret = callback.apply(elem, args || []);
        for (name in options) { elem.style[name] = old[name]; }
        return ret;
    };
    if (jQueryVersionSince("3.4.0") && typeof Proxy !== "undefined") { jQuery.cssProps = new Proxy(jQuery.cssProps || {}, { set: function() { migrateWarn("JQMIGRATE: jQuery.cssProps is deprecated"); return Reflect.set.apply(this, arguments); } }); }
    if (!jQuery.cssNumber) { jQuery.cssNumber = {}; }

    function isAutoPx(prop) { return ralphaStart.test(prop) && rautoPx.test(prop[0].toUpperCase() + prop.slice(1)); }
    oldFnCss = jQuery.fn.css;
    jQuery.fn.css = function(name, value) {
        var camelName, origThis = this;
        if (name && typeof name === "object" && !Array.isArray(name)) { jQuery.each(name, function(n, v) { jQuery.fn.css.call(origThis, n, v); }); return this; }
        if (typeof value === "number") {
            camelName = camelCase(name);
            if (!isAutoPx(camelName) && !jQuery.cssNumber[camelName]) {
                migrateWarn("Number-typed values are deprecated for jQuery.fn.css( \"" +
                    name + "\", value )");
            }
        }
        return oldFnCss.apply(this, arguments);
    };
    var oldData = jQuery.data;
    jQuery.data = function(elem, name, value) {
        var curData, sameKeys, key;
        if (name && typeof name === "object" && arguments.length === 2) {
            curData = jQuery.hasData(elem) && oldData.call(this, elem);
            sameKeys = {};
            for (key in name) {
                if (key !== camelCase(key)) {
                    migrateWarn("jQuery.data() always sets/gets camelCased names: " + key);
                    curData[key] = name[key];
                } else { sameKeys[key] = name[key]; }
            }
            oldData.call(this, elem, sameKeys);
            return name;
        }
        if (name && typeof name === "string" && name !== camelCase(name)) {
            curData = jQuery.hasData(elem) && oldData.call(this, elem);
            if (curData && name in curData) {
                migrateWarn("jQuery.data() always sets/gets camelCased names: " + name);
                if (arguments.length > 2) { curData[name] = value; }
                return curData[name];
            }
        }
        return oldData.apply(this, arguments);
    };
    if (jQuery.fx) {
        var intervalValue, intervalMsg, oldTweenRun = jQuery.Tween.prototype.run,
            linearEasing = function(pct) { return pct; };
        jQuery.Tween.prototype.run = function() {
            if (jQuery.easing[this.easing].length > 1) {
                migrateWarn("'jQuery.easing." + this.easing.toString() + "' should use only one argument");
                jQuery.easing[this.easing] = linearEasing;
            }
            oldTweenRun.apply(this, arguments);
        };
        intervalValue = jQuery.fx.interval || 13;
        intervalMsg = "jQuery.fx.interval is deprecated";
        if (window.requestAnimationFrame) {
            Object.defineProperty(jQuery.fx, "interval", {
                configurable: true,
                enumerable: true,
                get: function() {
                    if (!window.document.hidden) { migrateWarn(intervalMsg); }
                    return intervalValue;
                },
                set: function(newValue) {
                    migrateWarn(intervalMsg);
                    intervalValue = newValue;
                }
            });
        }
    }
    var oldLoad = jQuery.fn.load,
        oldEventAdd = jQuery.event.add,
        originalFix = jQuery.event.fix;
    jQuery.event.props = [];
    jQuery.event.fixHooks = {};
    migrateWarnProp(jQuery.event.props, "concat", jQuery.event.props.concat, "jQuery.event.props.concat() is deprecated and removed");
    jQuery.event.fix = function(originalEvent) {
        var event, type = originalEvent.type,
            fixHook = this.fixHooks[type],
            props = jQuery.event.props;
        if (props.length) { migrateWarn("jQuery.event.props are deprecated and removed: " + props.join()); while (props.length) { jQuery.event.addProp(props.pop()); } }
        if (fixHook && !fixHook._migrated_) {
            fixHook._migrated_ = true;
            migrateWarn("jQuery.event.fixHooks are deprecated and removed: " + type);
            if ((props = fixHook.props) && props.length) { while (props.length) { jQuery.event.addProp(props.pop()); } }
        }
        event = originalFix.call(this, originalEvent);
        return fixHook && fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    };
    jQuery.event.add = function(elem, types) {
        if (elem === window && types === "load" && window.document.readyState === "complete") { migrateWarn("jQuery(window).on('load'...) called after load event occurred"); }
        return oldEventAdd.apply(this, arguments);
    };
    jQuery.each(["load", "unload", "error"], function(_, name) {
        jQuery.fn[name] = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            if (name === "load" && typeof args[0] === "string") { return oldLoad.apply(this, args); }
            migrateWarn("jQuery.fn." + name + "() is deprecated");
            args.splice(0, 0, name);
            if (arguments.length) { return this.on.apply(this, args); }
            this.triggerHandler.apply(this, args);
            return this;
        };
    });
    jQuery.each(("blur focus focusin focusout resize scroll click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup contextmenu").split(" "), function(_i, name) { jQuery.fn[name] = function(data, fn) { migrateWarn("jQuery.fn." + name + "() event shorthand is deprecated"); return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name); }; });
    jQuery(function() { jQuery(window.document).triggerHandler("ready"); });
    jQuery.event.special.ready = { setup: function() { if (this === window.document) { migrateWarn("'ready' event is deprecated"); } } };
    jQuery.fn.extend({ bind: function(types, data, fn) { migrateWarn("jQuery.fn.bind() is deprecated"); return this.on(types, null, data, fn); }, unbind: function(types, fn) { migrateWarn("jQuery.fn.unbind() is deprecated"); return this.off(types, null, fn); }, delegate: function(selector, types, data, fn) { migrateWarn("jQuery.fn.delegate() is deprecated"); return this.on(types, selector, data, fn); }, undelegate: function(selector, types, fn) { migrateWarn("jQuery.fn.undelegate() is deprecated"); return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn); }, hover: function(fnOver, fnOut) { migrateWarn("jQuery.fn.hover() is deprecated"); return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver); } });
    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        origHtmlPrefilter = jQuery.htmlPrefilter,
        makeMarkup = function(html) {
            var doc = window.document.implementation.createHTMLDocument("");
            doc.body.innerHTML = html;
            return doc.body && doc.body.innerHTML;
        },
        warnIfChanged = function(html) { var changed = html.replace(rxhtmlTag, "<$1></$2>"); if (changed !== html && makeMarkup(html) !== makeMarkup(changed)) { migrateWarn("HTML tags must be properly nested and closed: " + html); } };
    jQuery.UNSAFE_restoreLegacyHtmlPrefilter = function() { jQuery.htmlPrefilter = function(html) { warnIfChanged(html); return html.replace(rxhtmlTag, "<$1></$2>"); }; };
    jQuery.htmlPrefilter = function(html) { warnIfChanged(html); return origHtmlPrefilter(html); };
    var oldOffset = jQuery.fn.offset;
    jQuery.fn.offset = function() {
        var elem = this[0];
        if (elem && (!elem.nodeType || !elem.getBoundingClientRect)) { migrateWarn("jQuery.fn.offset() requires a valid DOM element"); return arguments.length ? this : undefined; }
        return oldOffset.apply(this, arguments);
    };
    if (jQuery.ajax) {
        var oldParam = jQuery.param;
        jQuery.param = function(data, traditional) {
            var ajaxTraditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
            if (traditional === undefined && ajaxTraditional) {
                migrateWarn("jQuery.param() no longer uses jQuery.ajaxSettings.traditional");
                traditional = ajaxTraditional;
            }
            return oldParam.call(this, data, traditional);
        };
    }
    var oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;
    jQuery.fn.andSelf = function() { migrateWarn("jQuery.fn.andSelf() is deprecated and removed, use jQuery.fn.addBack()"); return oldSelf.apply(this, arguments); };
    if (jQuery.Deferred) {
        var oldDeferred = jQuery.Deferred,
            tuples = [
                ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), "resolved"],
                ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), "rejected"],
                ["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory")]
            ];
        jQuery.Deferred = function(func) {
            var deferred = oldDeferred(),
                promise = deferred.promise();
            deferred.pipe = promise.pipe = function() {
                var fns = arguments;
                migrateWarn("deferred.pipe() is deprecated");
                return jQuery.Deferred(function(newDefer) {
                    jQuery.each(tuples, function(i, tuple) {
                        var fn = typeof fns[i] === "function" && fns[i];
                        deferred[tuple[1]](function() { var returned = fn && fn.apply(this, arguments); if (returned && typeof returned.promise === "function") { returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify); } else { newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments); } });
                    });
                    fns = null;
                }).promise();
            };
            if (func) { func.call(deferred, deferred); }
            return deferred;
        };
        jQuery.Deferred.exceptionHook = oldDeferred.exceptionHook;
    }
    return jQuery;
});