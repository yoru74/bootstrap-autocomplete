/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* =============================================================
	 * bootstrap-autocomplete.js v0.0.1
	 * https://github.com/xcash/bootstrap-autocomplete
	 * =============================================================
	 * Forked from bootstrap3-typeahead.js v3.1.0
	 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
	 * =============================================================
	 * Original written by @mdo and @fat
	 * =============================================================
	 * Copyright 2016 Paolo Casciello @xcash666 and contributors
	 *
	 * Licensed under the MIT License (the 'License');
	 * you may not use this file except in compliance with the License.
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an 'AS IS' BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ============================================================ */
	var resolvers_1 = __webpack_require__(1);
	var dropdown_1 = __webpack_require__(2);
	var AutoCompleteNS;
	(function (AutoCompleteNS) {
	    var AutoComplete = (function () {
	        function AutoComplete(element, options) {
	            this._selectedItem = null;
	            this._defaultValue = null;
	            this._defaultText = null;
	            this._isSelectElement = false;
	            this._settings = {
	                resolver: 'ajax',
	                resolverSettings: {},
	                minLength: 3,
	                valueKey: 'value',
	                formatResult: this.defaultFormatResult,
	                autoSelect: true,
	                noResultsText: 'No results',
	                events: {
	                    typed: null,
	                    searchPre: null,
	                    search: null,
	                    searchPost: null,
	                    select: null,
	                    focus: null,
	                }
	            };
	            this._el = element;
	            this._$el = $(this._el);
	            // element type
	            if (this._$el.is('select')) {
	                this._isSelectElement = true;
	            }
	            // inline data attributes
	            this.manageInlineDataAttributes();
	            // constructor options
	            if (typeof options === 'object') {
	                this._settings = $.extend(true, {}, this.getSettings(), options);
	            }
	            if (this._isSelectElement) {
	                this.convertSelectToText();
	            }
	            // console.log('initializing', this._settings);
	            this.init();
	        }
	        AutoComplete.prototype.manageInlineDataAttributes = function () {
	            // updates settings with data-* attributes
	            var s = this.getSettings();
	            if (this._$el.data('url')) {
	                s['resolverSettings'].url = this._$el.data('url');
	            }
	            if (this._$el.data('default-value')) {
	                this._defaultValue = this._$el.data('default-value');
	            }
	            if (this._$el.data('default-text')) {
	                this._defaultText = this._$el.data('default-text');
	            }
	            if (this._$el.data('noresults-text')) {
	                s['noResultsText'] = this._$el.data('noresults-text');
	            }
	        };
	        AutoComplete.prototype.getSettings = function () {
	            return this._settings;
	        };
	        AutoComplete.prototype.convertSelectToText = function () {
	            // create hidden field
	            var hidField = $('<input>');
	            hidField.attr('type', 'hidden');
	            hidField.attr('name', this._$el.attr('name'));
	            if (this._defaultValue) {
	                hidField.val(this._defaultValue);
	            }
	            this._selectHiddenField = hidField;
	            hidField.insertAfter(this._$el);
	            // create search input element
	            var searchField = $('<input>');
	            // copy all attributes
	            searchField.attr('type', 'text');
	            searchField.attr('name', this._$el.attr('name') + '_text');
	            searchField.attr('id', this._$el.attr('id'));
	            searchField.attr('disabled', this._$el.attr('disabled'));
	            searchField.attr('placeholder', this._$el.attr('placeholder'));
	            searchField.attr('autocomplete', 'off');
	            searchField.addClass(this._$el.attr('class'));
	            if (this._defaultText) {
	                searchField.val(this._defaultText);
	            }
	            // attach class
	            searchField.data(AutoCompleteNS.AutoComplete.NAME, this);
	            // replace original with searchField
	            this._$el.replaceWith(searchField);
	            this._$el = searchField;
	            this._el = searchField.get(0);
	        };
	        AutoComplete.prototype.init = function () {
	            // bind default events
	            this.bindDefaultEventListeners();
	            // RESOLVER
	            if (this._settings.resolver === 'ajax') {
	                // configure default resolver
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect, this._settings.noResultsText);
	        };
	        AutoComplete.prototype.bindDefaultEventListeners = function () {
	            var _this = this;
	            this._$el.on('keydown', function (evt) {
	                switch (evt.which) {
	                    case 40:
	                        // arrow DOWN
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 38:
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 9:
	                        if (_this._settings.autoSelect) {
	                            // if autoSelect enabled selects on blur the currently selected item
	                            _this._dd.selectFocusItem();
	                        }
	                        break;
	                }
	            });
	            this._$el.on('focus keyup', function (evt) {
	                // check key
	                switch (evt.which) {
	                    case 16: // shift
	                    case 17: // ctrl
	                    case 18: // alt
	                    case 39: // right
	                    case 37:
	                        break;
	                    case 40:
	                        // arrow DOWN
	                        _this._dd.focusNextItem();
	                        break;
	                    case 38:
	                        _this._dd.focusPreviousItem();
	                        break;
	                    case 13:
	                        _this._dd.selectFocusItem();
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 27:
	                        // ESC
	                        _this._dd.hide();
	                        break;
	                    default:
	                        var newValue = _this._$el.val();
	                        _this.handlerTyped(newValue);
	                }
	            });
	            this._$el.on('blur', function (evt) {
	                // console.log(evt);
	                if (!_this._dd.isMouseOver) {
	                    if (_this._isSelectElement) {
	                        // if it's a select element you must
	                        if (_this._dd.isItemFocused) {
	                            _this._dd.selectFocusItem();
	                        }
	                        else if ((_this._selectedItem !== null) && (_this._$el.val() !== '')) {
	                            // reselect it
	                            _this._$el.trigger('autocomplete.select', _this._selectedItem);
	                        }
	                        else if ((_this._$el.val() !== '') && (_this._defaultValue !== null)) {
	                            // select Default
	                            _this._$el.val(_this._defaultText);
	                            _this._selectHiddenField.val(_this._defaultValue);
	                            _this._selectedItem = null;
	                        }
	                        else {
	                            // empty the values
	                            _this._$el.val('');
	                            _this._selectHiddenField.val('');
	                            _this._selectedItem = null;
	                        }
	                    }
	                    _this._dd.hide();
	                }
	            });
	            // selected event
	            this._$el.on('autocomplete.select', function (evt, item) {
	                _this._selectedItem = item;
	                _this.itemSelectedDefaultHandler(item);
	            });
	        };
	        AutoComplete.prototype.handlerTyped = function (newValue) {
	            // field value changed
	            // custom handler may change newValue
	            if (this._settings.events.typed !== null) {
	                newValue = this._settings.events.typed(newValue);
	                if (!newValue)
	                    return;
	            }
	            // if value >= minLength, start autocomplete
	            if (newValue.length >= this._settings.minLength) {
	                this._searchText = newValue;
	                this.handlerPreSearch();
	            }
	            else {
	                this._dd.hide();
	            }
	        };
	        AutoComplete.prototype.handlerPreSearch = function () {
	            // do nothing, start search
	            // custom handler may change newValue
	            if (this._settings.events.searchPre !== null) {
	                var newValue = this._settings.events.searchPre(this._searchText);
	                if (!newValue)
	                    return;
	                this._searchText = newValue;
	            }
	            this.handlerDoSearch();
	        };
	        AutoComplete.prototype.handlerDoSearch = function () {
	            var _this = this;
	            // custom handler may change newValue
	            if (this._settings.events.search !== null) {
	                this._settings.events.search(this._searchText, function (results) {
	                    _this.postSearchCallback(results);
	                });
	            }
	            else {
	                // Default behaviour
	                // search using current resolver
	                if (this.resolver) {
	                    this.resolver.search(this._searchText, function (results) {
	                        _this.postSearchCallback(results);
	                    });
	                }
	            }
	        };
	        AutoComplete.prototype.postSearchCallback = function (results) {
	            // console.log('callback called', results);
	            // custom handler may change newValue
	            if (this._settings.events.searchPost) {
	                results = this._settings.events.searchPost(results);
	                if ((typeof results === 'boolean') && !results)
	                    return;
	            }
	            this.handlerStartShow(results);
	        };
	        AutoComplete.prototype.handlerStartShow = function (results) {
	            // console.log("defaultEventStartShow", results);
	            // for every result, draw it
	            this._dd.updateItems(results, this._searchText);
	            this._dd.show();
	        };
	        AutoComplete.prototype.itemSelectedDefaultHandler = function (item) {
	            // console.log('itemSelectedDefaultHandler', item);
	            // default behaviour is set elment's .val()
	            var itemFormatted = this._settings.formatResult(item);
	            if (typeof itemFormatted === 'string') {
	                itemFormatted = { text: itemFormatted };
	            }
	            this._$el.val(itemFormatted.text);
	            // if the element is a select
	            if (this._isSelectElement) {
	                this._selectHiddenField.val(itemFormatted.value);
	            }
	            // save selected item
	            this._selectedItem = item;
	            // and hide
	            this._dd.hide();
	        };
	        AutoComplete.prototype.defaultFormatResult = function (item) {
	            if (typeof item === 'string') {
	                return { text: item };
	            }
	            else if (item.text) {
	                return item;
	            }
	            else {
	                // return a toString of the item as last resort
	                // console.error('No default formatter for item', item);
	                return { text: item.toString() };
	            }
	        };
	        return AutoComplete;
	    }());
	    AutoComplete.NAME = 'autoComplete';
	    AutoCompleteNS.AutoComplete = AutoComplete;
	})(AutoCompleteNS || (AutoCompleteNS = {}));
	(function ($, window, document) {
	    $.fn[AutoCompleteNS.AutoComplete.NAME] = function (options) {
	        return this.each(function () {
	            var pluginClass;
	            pluginClass = $(this).data(AutoCompleteNS.AutoComplete.NAME);
	            if (!pluginClass) {
	                pluginClass = new AutoCompleteNS.AutoComplete(this, options);
	                $(this).data(AutoCompleteNS.AutoComplete.NAME, pluginClass);
	            }
	        });
	    };
	})(jQuery, window, document);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BaseResolver = (function () {
	    function BaseResolver(options) {
	        this._settings = $.extend(true, {}, this.getDefaults(), options);
	    }
	    BaseResolver.prototype.getDefaults = function () {
	        return {};
	    };
	    BaseResolver.prototype.getResults = function (limit, start, end) {
	        return this.results;
	    };
	    BaseResolver.prototype.search = function (q, cbk) {
	        cbk(this.getResults());
	    };
	    return BaseResolver;
	}());
	var AjaxResolver = (function (_super) {
	    __extends(AjaxResolver, _super);
	    function AjaxResolver(options) {
	        return _super.call(this, options) || this;
	        // console.log('resolver settings', this._settings);
	    }
	    AjaxResolver.prototype.getDefaults = function () {
	        return {
	            url: '',
	            method: 'get',
	            queryKey: 'q',
	            extraData: {},
	            timeout: undefined,
	        };
	    };
	    AjaxResolver.prototype.search = function (q, cbk) {
	        var _this = this;
	        if (this.jqXHR != null) {
	            this.jqXHR.abort();
	        }
	        var data = {};
	        data[this._settings.queryKey] = q;
	        $.extend(data, this._settings.extraData);
	        this.jqXHR = $.ajax(this._settings.url, {
	            method: this._settings.method,
	            data: data,
	            timeout: this._settings.timeout
	        });
	        this.jqXHR.done(function (result) {
	            cbk(result);
	        });
	        this.jqXHR.fail(function (err) {
	            // console.log(err);
	        });
	        this.jqXHR.always(function () {
	            _this.jqXHR = null;
	        });
	    };
	    return AjaxResolver;
	}(BaseResolver));
	exports.AjaxResolver = AjaxResolver;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/*
	 *	Dropdown class. Manages the dropdown drawing
	 */
	var Dropdown = (function () {
	    function Dropdown(e, formatItemCbk, autoSelect, noResultsText) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
	        this.autoSelect = autoSelect;
	        this.noResultsText = noResultsText;
	        // initialize it in lazy mode to deal with glitches like modals
	        // this.init();
	    }
	    Dropdown.prototype.init = function () {
	        var _this = this;
	        // Initialize dropdown
	        var pos = $.extend({}, this._$el.position(), {
	            height: this._$el[0].offsetHeight
	        });
	        // create element
	        this._dd = $('<ul />');
	        // add our class and basic dropdown-menu class
	        this._dd.addClass('bootstrap-autocomplete dropdown-menu');
	        this._dd.insertAfter(this._$el);
	        this._dd.css({ top: pos.top + this._$el.outerHeight(), left: pos.left, width: this._$el.outerWidth() });
	        // click event on items
	        this._dd.on('click', 'li', function (evt) {
	            // console.log('clicked', evt.currentTarget);
	            //console.log($(evt.currentTarget));
	            var item = $(evt.currentTarget).data('item');
	            _this.itemSelectedLaunchEvent(item);
	        });
	        this._dd.on('keyup', function (evt) {
	            if (_this.shown) {
	                switch (evt.which) {
	                    case 27:
	                        // ESC
	                        _this.hide();
	                        _this._$el.focus();
	                        break;
	                }
	                return false;
	            }
	        });
	        this._dd.on('mouseenter', 'li', function (evt) {
	            if (_this.haveResults) {
	                $(evt.currentTarget).closest('ul').find('li.active').removeClass('active');
	                $(evt.currentTarget).addClass('active');
	                _this.mouseover = true;
	            }
	        });
	        this._dd.on('mouseleave', 'li', function (evt) {
	            _this.mouseover = false;
	        });
	        this.initialized = true;
	    };
	    Dropdown.prototype.checkInitialized = function () {
	        // Lazy init
	        if (!this.initialized) {
	            // if not already initialized
	            this.init();
	        }
	    };
	    Object.defineProperty(Dropdown.prototype, "isMouseOver", {
	        get: function () {
	            return this.mouseover;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Dropdown.prototype, "haveResults", {
	        get: function () {
	            return (this.items.length > 0);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.focusNextItem = function (reversed) {
	        if (this.haveResults) {
	            // get selected
	            var currElem = this._dd.find('li.active');
	            var nextElem = reversed ? currElem.prev() : currElem.next();
	            if (nextElem.length == 0) {
	                // first 
	                nextElem = reversed ? this._dd.find('li').last() : this._dd.find('li').first();
	            }
	            currElem.removeClass('active');
	            nextElem.addClass('active');
	        }
	    };
	    Dropdown.prototype.focusPreviousItem = function () {
	        this.focusNextItem(true);
	    };
	    Dropdown.prototype.selectFocusItem = function () {
	        this._dd.find('li.active').trigger('click');
	    };
	    Object.defineProperty(Dropdown.prototype, "isItemFocused", {
	        get: function () {
	            if (this._dd.find('li.active').length > 0) {
	                return true;
	            }
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.show = function () {
	        if (!this.shown) {
	            this._dd.dropdown().show();
	            this.shown = true;
	        }
	    };
	    Dropdown.prototype.isShown = function () {
	        return this.shown;
	    };
	    Dropdown.prototype.hide = function () {
	        if (this.shown) {
	            this._dd.dropdown().hide();
	            this.shown = false;
	        }
	    };
	    Dropdown.prototype.updateItems = function (items, searchText) {
	        // console.log('updateItems', items);
	        this.items = items;
	        this.searchText = searchText;
	        this.refreshItemList();
	    };
	    Dropdown.prototype.showMatchedText = function (text, qry) {
	        var startIndex = text.toLowerCase().indexOf(qry.toLowerCase());
	        if (startIndex > -1) {
	            var endIndex = startIndex + qry.length;
	            return text.slice(0, startIndex) + '<b>'
	                + text.slice(startIndex, endIndex) + '</b>'
	                + text.slice(endIndex);
	        }
	        return text;
	    };
	    Dropdown.prototype.refreshItemList = function () {
	        var _this = this;
	        this.checkInitialized();
	        this._dd.empty();
	        var liList = [];
	        if (this.items.length > 0) {
	            this.items.forEach(function (item) {
	                var itemFormatted = _this.formatItem(item);
	                if (typeof itemFormatted === 'string') {
	                    itemFormatted = { text: itemFormatted };
	                }
	                var itemText;
	                var itemHtml;
	                itemText = _this.showMatchedText(itemFormatted.text, _this.searchText);
	                if (itemFormatted.html !== undefined) {
	                    itemHtml = itemFormatted.html;
	                }
	                else {
	                    itemHtml = itemText;
	                }
	                var li = $('<li >');
	                li.append($('<a>').attr('href', '#').html(itemHtml))
	                    .data('item', item);
	                liList.push(li);
	            });
	        }
	        else {
	            // No results
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').html(this.noResultsText))
	                .addClass('disabled');
	            liList.push(li);
	        }
	        this._dd.append(liList);
	    };
	    Dropdown.prototype.itemSelectedLaunchEvent = function (item) {
	        // launch selected event
	        // console.log('itemSelectedLaunchEvent', item);
	        this._$el.trigger('autocomplete.select', item);
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWY3ZTIxZGEyMjQxMWMwMTcyMTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsMENBQTJDO0FBQzNDLHlDQUFzQztBQUV0QyxLQUFPLGNBQWMsQ0E2VHBCO0FBN1RELFlBQU8sY0FBYztLQUNuQjtTQWlDRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQTFCaEMsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsaUJBQVksR0FBVSxJQUFJLENBQUM7YUFDM0IscUJBQWdCLEdBQVcsS0FBSyxDQUFDO2FBR2pDLGNBQVMsR0FBRztpQkFDbEIsUUFBUSxFQUFVLE1BQU07aUJBQ3hCLGdCQUFnQixFQUFPLEVBQUU7aUJBQ3pCLFNBQVMsRUFBVSxDQUFDO2lCQUNwQixRQUFRLEVBQVUsT0FBTztpQkFDekIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2lCQUN6QixhQUFhLEVBQVUsWUFBWTtpQkFDbkMsTUFBTSxFQUFFO3FCQUNOLEtBQUssRUFBWSxJQUFJO3FCQUNyQixTQUFTLEVBQVksSUFBSTtxQkFDekIsTUFBTSxFQUFZLElBQUk7cUJBQ3RCLFVBQVUsRUFBWSxJQUFJO3FCQUMxQixNQUFNLEVBQVks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Q0FBQztpQkFFcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNqQixDQUFDLENBQUMsQ0FBQztTQUNKLENBQUM7U0FBQyxJQUFJLENBQUMsQ0FBQzthQUNQLGFBQWE7YUFDYixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDcEIsRUFBRSxDQUFDLE1BQU0sQ0FDUixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUNuRDtrQkFDQSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7YUFFdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNqQixDQUFDO1NBR0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekIsQ0FBQztLQUVTLDBDQUF1QixHQUFqQyxVQUFrQyxJQUFRO1NBQ3pDLHdCQUF3QjtTQUN4QixnREFBZ0Q7U0FDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDO0tBQy9DLENBQUM7S0FFRixlQUFDO0FBQUQsRUFBQztBQTlNWSw2QkFBUSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWY3ZTIxZGEyMjQxMWMwMTcyMTUiLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYXV0b2NvbXBsZXRlLmpzIHYwLjAuMVxuICogaHR0cHM6Ly9naXRodWIuY29tL3hjYXNoL2Jvb3RzdHJhcC1hdXRvY29tcGxldGVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEZvcmtlZCBmcm9tIGJvb3RzdHJhcDMtdHlwZWFoZWFkLmpzIHYzLjEuMFxuICogaHR0cHM6Ly9naXRodWIuY29tL2Jhc3Nqb2JzZW4vQm9vdHN0cmFwLTMtVHlwZWFoZWFkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBPcmlnaW5hbCB3cml0dGVuIGJ5IEBtZG8gYW5kIEBmYXRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDE2IFBhb2xvIENhc2NpZWxsbyBAeGNhc2g2NjYgYW5kIGNvbnRyaWJ1dG9yc1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAodGhlICdMaWNlbnNlJyk7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gJ0FTIElTJyBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmltcG9ydCB7IEFqYXhSZXNvbHZlciB9IGZyb20gJy4vcmVzb2x2ZXJzJztcbmltcG9ydCB7IERyb3Bkb3duIH0gZnJvbSAnLi9kcm9wZG93bic7XG5cbm1vZHVsZSBBdXRvQ29tcGxldGVOUyB7XG4gIGV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIHB1YmxpYyBzdGF0aWMgTkFNRTpzdHJpbmcgPSAnYXV0b0NvbXBsZXRlJztcblxuICAgIHByaXZhdGUgX2VsOkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfJGVsOkpRdWVyeTtcbiAgICBwcml2YXRlIF9kZDpEcm9wZG93bjtcbiAgICBwcml2YXRlIF9zZWFyY2hUZXh0OnN0cmluZztcbiAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW06YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VmFsdWU6YW55ID0gbnVsbDtcbiAgICBwcml2YXRlIF9kZWZhdWx0VGV4dDpzdHJpbmcgPSBudWxsO1xuICAgIHByaXZhdGUgX2lzU2VsZWN0RWxlbWVudDpib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfc2VsZWN0SGlkZGVuRmllbGQ6SlF1ZXJ5O1xuXG4gICAgcHJpdmF0ZSBfc2V0dGluZ3MgPSB7XG4gICAgICByZXNvbHZlcjo8c3RyaW5nPiAnYWpheCcsXG4gICAgICByZXNvbHZlclNldHRpbmdzOjxhbnk+IHt9LFxuICAgICAgbWluTGVuZ3RoOjxudW1iZXI+IDMsXG4gICAgICB2YWx1ZUtleTo8c3RyaW5nPiAndmFsdWUnLFxuICAgICAgZm9ybWF0UmVzdWx0OjxGdW5jdGlvbj4gdGhpcy5kZWZhdWx0Rm9ybWF0UmVzdWx0LFxuICAgICAgYXV0b1NlbGVjdDo8Ym9vbGVhbj4gdHJ1ZSxcbiAgICAgIG5vUmVzdWx0c1RleHQ6PHN0cmluZz4gJ05vIHJlc3VsdHMnLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHR5cGVkOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUHJlOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUG9zdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlbGVjdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIGZvY3VzOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9ucz86e30pIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgLy8gZWxlbWVudCB0eXBlXG4gICAgICBpZiAodGhpcy5fJGVsLmlzKCdzZWxlY3QnKSkge1xuICAgICAgICB0aGlzLl9pc1NlbGVjdEVsZW1lbnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gaW5saW5lIGRhdGEgYXR0cmlidXRlc1xuICAgICAgdGhpcy5tYW5hZ2VJbmxpbmVEYXRhQXR0cmlidXRlcygpO1xuICAgICAgLy8gY29uc3RydWN0b3Igb3B0aW9uc1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldFNldHRpbmdzKCksIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB0aGlzLmNvbnZlcnRTZWxlY3RUb1RleHQoKTtcbiAgICAgIH0gXG4gICAgICBcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpbml0aWFsaXppbmcnLCB0aGlzLl9zZXR0aW5ncyk7XG4gICAgICBcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKSB7XG4gICAgICAvLyB1cGRhdGVzIHNldHRpbmdzIHdpdGggZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgIGxldCBzID0gdGhpcy5nZXRTZXR0aW5ncygpO1xuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCd1cmwnKSkge1xuICAgICAgICBzWydyZXNvbHZlclNldHRpbmdzJ10udXJsID0gdGhpcy5fJGVsLmRhdGEoJ3VybCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJykpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFZhbHVlID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdmFsdWUnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC10ZXh0JykpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFRleHQgPSB0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC10ZXh0Jyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fJGVsLmRhdGEoJ25vcmVzdWx0cy10ZXh0JykpIHtcbiAgICAgICAgc1snbm9SZXN1bHRzVGV4dCddID0gdGhpcy5fJGVsLmRhdGEoJ25vcmVzdWx0cy10ZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTZXR0aW5ncygpOnt9IHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnZlcnRTZWxlY3RUb1RleHQoKSB7XG4gICAgICAvLyBjcmVhdGUgaGlkZGVuIGZpZWxkXG5cbiAgICAgIGxldCBoaWRGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICBoaWRGaWVsZC5hdHRyKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgaGlkRmllbGQuYXR0cignbmFtZScsIHRoaXMuXyRlbC5hdHRyKCduYW1lJykpO1xuICAgICAgaWYgKHRoaXMuX2RlZmF1bHRWYWx1ZSkge1xuICAgICAgICBoaWRGaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkID0gaGlkRmllbGQ7XG4gICAgICBcbiAgICAgIGhpZEZpZWxkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cbiAgICAgIC8vIGNyZWF0ZSBzZWFyY2ggaW5wdXQgZWxlbWVudFxuICAgICAgbGV0IHNlYXJjaEZpZWxkOkpRdWVyeSA9ICQoJzxpbnB1dD4nKTtcbiAgICAgIC8vIGNvcHkgYWxsIGF0dHJpYnV0ZXNcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignbmFtZScsIHRoaXMuXyRlbC5hdHRyKCduYW1lJykgKyAnX3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2lkJywgdGhpcy5fJGVsLmF0dHIoJ2lkJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignZGlzYWJsZWQnLCB0aGlzLl8kZWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsIHRoaXMuXyRlbC5hdHRyKCdwbGFjZWhvbGRlcicpKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2F1dG9jb21wbGV0ZScsICdvZmYnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmFkZENsYXNzKHRoaXMuXyRlbC5hdHRyKCdjbGFzcycpKTtcbiAgICAgIGlmICh0aGlzLl9kZWZhdWx0VGV4dCkge1xuICAgICAgICBzZWFyY2hGaWVsZC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBhdHRhY2ggY2xhc3NcbiAgICAgIHNlYXJjaEZpZWxkLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHRoaXMpO1xuXG4gICAgICAvLyByZXBsYWNlIG9yaWdpbmFsIHdpdGggc2VhcmNoRmllbGRcbiAgICAgIHRoaXMuXyRlbC5yZXBsYWNlV2l0aChzZWFyY2hGaWVsZCk7XG4gICAgICB0aGlzLl8kZWwgPSBzZWFyY2hGaWVsZDtcbiAgICAgIHRoaXMuX2VsID0gc2VhcmNoRmllbGQuZ2V0KDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6dm9pZCB7XG4gICAgICAvLyBiaW5kIGRlZmF1bHQgZXZlbnRzXG4gICAgICB0aGlzLmJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIC8vIFJFU09MVkVSXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXIgPT09ICdhamF4Jykge1xuICAgICAgICAvLyBjb25maWd1cmUgZGVmYXVsdCByZXNvbHZlclxuICAgICAgICB0aGlzLnJlc29sdmVyID0gbmV3IEFqYXhSZXNvbHZlcih0aGlzLl9zZXR0aW5ncy5yZXNvbHZlclNldHRpbmdzKTtcbiAgICAgIH1cbiAgICAgIC8vIERyb3Bkb3duXG4gICAgICB0aGlzLl9kZCA9IG5ldyBEcm9wZG93bih0aGlzLl8kZWwsIHRoaXMuX3NldHRpbmdzLmZvcm1hdFJlc3VsdCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy5hdXRvU2VsZWN0LCB0aGlzLl9zZXR0aW5ncy5ub1Jlc3VsdHNUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTp2b2lkIHtcbiAgICAgIHRoaXMuXyRlbC5vbigna2V5ZG93bicsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDk6IC8vIFRBQlxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QpIHtcbiAgICAgICAgICAgICAgLy8gaWYgYXV0b1NlbGVjdCBlbmFibGVkIHNlbGVjdHMgb24gYmx1ciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuXyRlbC5vbignZm9jdXMga2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGtleVxuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuICAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4gICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgY2FzZSAzNzogLy8gbGVmdCBcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c05leHRJdGVtKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNQcmV2aW91c0l0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcbiAgICAgICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuICAgICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuXyRlbC52YWwoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlclR5cGVkKG5ld1ZhbHVlKTtcblx0XHRcdFx0fVxuICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl8kZWwub24oJ2JsdXInLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIGlmICghdGhpcy5fZGQuaXNNb3VzZU92ZXIpIHtcblxuICAgICAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgYSBzZWxlY3QgZWxlbWVudCB5b3UgbXVzdFxuICAgICAgICAgICAgaWYgKHRoaXMuX2RkLmlzSXRlbUZvY3VzZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fc2VsZWN0ZWRJdGVtICE9PSBudWxsKSAmJiAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgKSB7XG4gICAgICAgICAgICAgIC8vIHJlc2VsZWN0IGl0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgdGhpcy5fc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICh0aGlzLl8kZWwudmFsKCkgIT09ICcnKSAmJiAodGhpcy5fZGVmYXVsdFZhbHVlICE9PSBudWxsKSApIHtcbiAgICAgICAgICAgICAgLy8gc2VsZWN0IERlZmF1bHRcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCh0aGlzLl9kZWZhdWx0VGV4dCk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCh0aGlzLl9kZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZW1wdHkgdGhlIHZhbHVlc1xuICAgICAgICAgICAgICB0aGlzLl8kZWwudmFsKCcnKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKCcnKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZWxlY3RlZCBldmVudFxuICAgICAgdGhpcy5fJGVsLm9uKCdhdXRvY29tcGxldGUuc2VsZWN0JywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgaXRlbTphbnkpID0+IHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy5pdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcihpdGVtKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgaGFuZGxlclR5cGVkKG5ld1ZhbHVlOnN0cmluZyk6dm9pZCB7XG4gICAgICAvLyBmaWVsZCB2YWx1ZSBjaGFuZ2VkXG5cbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMudHlwZWQgIT09IG51bGwpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMudHlwZWQobmV3VmFsdWUpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdmFsdWUgPj0gbWluTGVuZ3RoLCBzdGFydCBhdXRvY29tcGxldGVcbiAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPj0gdGhpcy5fc2V0dGluZ3MubWluTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3NlYXJjaFRleHQgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5oYW5kbGVyUHJlU2VhcmNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyUHJlU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBkbyBub3RoaW5nLCBzdGFydCBzZWFyY2hcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQcmUgIT09IG51bGwpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlOnN0cmluZyA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQcmUodGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICAgIGlmICghbmV3VmFsdWUpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlckRvU2VhcmNoKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyRG9TZWFyY2goKTp2b2lkIHtcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5wb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGVmYXVsdCBiZWhhdmlvdXJcbiAgICAgICAgLy8gc2VhcmNoIHVzaW5nIGN1cnJlbnQgcmVzb2x2ZXJcbiAgICAgICAgaWYgKHRoaXMucmVzb2x2ZXIpIHtcbiAgICAgICAgICB0aGlzLnJlc29sdmVyLnNlYXJjaCh0aGlzLl9zZWFyY2hUZXh0LCAocmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb3N0U2VhcmNoQ2FsbGJhY2socmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrIGNhbGxlZCcsIHJlc3VsdHMpO1xuICAgICAgXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaFBvc3QpIHtcbiAgICAgICAgcmVzdWx0cyA9IHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KHJlc3VsdHMpO1xuICAgICAgICBpZiAoICh0eXBlb2YgcmVzdWx0cyA9PT0gJ2Jvb2xlYW4nKSAmJiAhcmVzdWx0cylcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlclN0YXJ0U2hvdyhyZXN1bHRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZXJTdGFydFNob3cocmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJkZWZhdWx0RXZlbnRTdGFydFNob3dcIiwgcmVzdWx0cyk7XG4gICAgICAvLyBmb3IgZXZlcnkgcmVzdWx0LCBkcmF3IGl0XG4gICAgICB0aGlzLl9kZC51cGRhdGVJdGVtcyhyZXN1bHRzLCB0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgIHRoaXMuX2RkLnNob3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbTphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyJywgaXRlbSk7XG4gICAgICAvLyBkZWZhdWx0IGJlaGF2aW91ciBpcyBzZXQgZWxtZW50J3MgLnZhbCgpXG4gICAgICBsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQoaXRlbSk7XG5cdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0fVxuICAgICAgdGhpcy5fJGVsLnZhbChpdGVtRm9ybWF0dGVkLnRleHQpO1xuICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYSBzZWxlY3RcbiAgICAgIGlmICh0aGlzLl9pc1NlbGVjdEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0SGlkZGVuRmllbGQudmFsKGl0ZW1Gb3JtYXR0ZWQudmFsdWUpO1xuICAgICAgfVxuICAgICAgLy8gc2F2ZSBzZWxlY3RlZCBpdGVtXG4gICAgICB0aGlzLl9zZWxlY3RlZEl0ZW0gPSBpdGVtO1xuICAgICAgLy8gYW5kIGhpZGVcbiAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRGb3JtYXRSZXN1bHQoaXRlbTphbnkpOnt9IHtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0gfTtcbiAgICAgIH0gZWxzZSBpZiAoIGl0ZW0udGV4dCApIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyByZXR1cm4gYSB0b1N0cmluZyBvZiB0aGUgaXRlbSBhcyBsYXN0IHJlc29ydFxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdObyBkZWZhdWx0IGZvcm1hdHRlciBmb3IgaXRlbScsIGl0ZW0pO1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtLnRvU3RyaW5nKCkgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG59XG5cbihmdW5jdGlvbigkOiBKUXVlcnlTdGF0aWMsIHdpbmRvdzogYW55LCBkb2N1bWVudDogYW55KSB7XG4gICQuZm5bQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUVdID0gZnVuY3Rpb24ob3B0aW9uczogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwbHVnaW5DbGFzczpBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGU7XG5cbiAgICAgIHBsdWdpbkNsYXNzID0gJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FKTtcblxuICAgICAgaWYgKCFwbHVnaW5DbGFzcykge1xuICAgICAgICBwbHVnaW5DbGFzcyA9IG5ldyBBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUodGhpcywgb3B0aW9ucyk7IFxuICAgICAgICAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUsIHBsdWdpbkNsYXNzKTtcbiAgICAgIH1cblxuXG4gICAgfSk7XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4udHMiLCJcbmNsYXNzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCByZXN1bHRzOkFycmF5PE9iamVjdD47XG5cblx0cHJvdGVjdGVkIF9zZXR0aW5nczphbnk7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHR0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXRSZXN1bHRzKGxpbWl0PzpudW1iZXIsIHN0YXJ0PzpudW1iZXIsIGVuZD86bnVtYmVyKTpBcnJheTxPYmplY3Q+IHtcblx0XHRcblx0XHRyZXR1cm4gdGhpcy5yZXN1bHRzO1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRjYmsodGhpcy5nZXRSZXN1bHRzKCkpO1xuXHR9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEFqYXhSZXNvbHZlciBleHRlbmRzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCBqcVhIUjpKUXVlcnlYSFI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdyZXNvbHZlciBzZXR0aW5ncycsIHRoaXMuX3NldHRpbmdzKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnJyxcblx0XHRcdG1ldGhvZDogJ2dldCcsXG5cdFx0XHRxdWVyeUtleTogJ3EnLFxuXHRcdFx0ZXh0cmFEYXRhOiB7fSxcblx0XHRcdHRpbWVvdXQ6IHVuZGVmaW5lZCxcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRpZiAodGhpcy5qcVhIUiAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLmpxWEhSLmFib3J0KCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGE6T2JqZWN0ID0ge307XG5cdFx0ZGF0YVt0aGlzLl9zZXR0aW5ncy5xdWVyeUtleV0gPSBxO1xuXHRcdCQuZXh0ZW5kKGRhdGEsIHRoaXMuX3NldHRpbmdzLmV4dHJhRGF0YSk7XG5cblx0XHR0aGlzLmpxWEhSID0gJC5hamF4KFxuXHRcdFx0dGhpcy5fc2V0dGluZ3MudXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRtZXRob2Q6IHRoaXMuX3NldHRpbmdzLm1ldGhvZCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dGltZW91dDogdGhpcy5fc2V0dGluZ3MudGltZW91dFxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR0aGlzLmpxWEhSLmRvbmUoKHJlc3VsdCkgPT4ge1xuXHRcdFx0Y2JrKHJlc3VsdCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5qcVhIUi5mYWlsKChlcnIpID0+IHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmpxWEhSLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmpxWEhSID0gbnVsbDtcblx0XHR9KTtcblx0fVxuXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVzb2x2ZXJzLnRzIiwiLypcbiAqXHREcm9wZG93biBjbGFzcy4gTWFuYWdlcyB0aGUgZHJvcGRvd24gZHJhd2luZ1xuICovXG5leHBvcnQgY2xhc3MgRHJvcGRvd24ge1xuXHRwcm90ZWN0ZWQgXyRlbDpKUXVlcnk7XG5cdHByb3RlY3RlZCBfZGQ6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgc2hvd246Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcm90ZWN0ZWQgaXRlbXM6YW55W10gPSBbXTtcblx0cHJvdGVjdGVkIGZvcm1hdEl0ZW06RnVuY3Rpb247XG5cdHByb3RlY3RlZCBzZWFyY2hUZXh0OnN0cmluZztcblx0cHJvdGVjdGVkIGF1dG9TZWxlY3Q6Ym9vbGVhbjtcblx0cHJvdGVjdGVkIG1vdXNlb3Zlcjpib29sZWFuO1xuXHRwcm90ZWN0ZWQgbm9SZXN1bHRzVGV4dDpzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IoZTpKUXVlcnksIGZvcm1hdEl0ZW1DYms6RnVuY3Rpb24sIGF1dG9TZWxlY3Q6Ym9vbGVhbiwgbm9SZXN1bHRzVGV4dDpzdHJpbmcpIHtcblx0XHR0aGlzLl8kZWwgPSBlO1xuXHRcdHRoaXMuZm9ybWF0SXRlbSA9IGZvcm1hdEl0ZW1DYms7XG5cdFx0dGhpcy5hdXRvU2VsZWN0ID0gYXV0b1NlbGVjdDtcblx0XHR0aGlzLm5vUmVzdWx0c1RleHQgPSBub1Jlc3VsdHNUZXh0O1xuXHRcdFxuXHRcdC8vIGluaXRpYWxpemUgaXQgaW4gbGF6eSBtb2RlIHRvIGRlYWwgd2l0aCBnbGl0Y2hlcyBsaWtlIG1vZGFsc1xuXHRcdC8vIHRoaXMuaW5pdCgpO1xuXHR9XG5cdFxuXHRwcm90ZWN0ZWQgaW5pdCgpOnZvaWQge1xuXHRcdC8vIEluaXRpYWxpemUgZHJvcGRvd25cblx0XHRsZXQgcG9zOmFueSA9ICQuZXh0ZW5kKHt9LCB0aGlzLl8kZWwucG9zaXRpb24oKSwge1xuICAgICAgICBcdFx0XHRcdGhlaWdodDogdGhpcy5fJGVsWzBdLm9mZnNldEhlaWdodFxuICAgIFx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0Ly8gY3JlYXRlIGVsZW1lbnRcblx0XHR0aGlzLl9kZCA9ICQoJzx1bCAvPicpO1xuXHRcdC8vIGFkZCBvdXIgY2xhc3MgYW5kIGJhc2ljIGRyb3Bkb3duLW1lbnUgY2xhc3Ncblx0XHR0aGlzLl9kZC5hZGRDbGFzcygnYm9vdHN0cmFwLWF1dG9jb21wbGV0ZSBkcm9wZG93bi1tZW51Jyk7XG5cblx0XHR0aGlzLl9kZC5pbnNlcnRBZnRlcih0aGlzLl8kZWwpO1xuXHRcdHRoaXMuX2RkLmNzcyh7IHRvcDogcG9zLnRvcCArIHRoaXMuXyRlbC5vdXRlckhlaWdodCgpLCBsZWZ0OiBwb3MubGVmdCwgd2lkdGg6IHRoaXMuXyRlbC5vdXRlcldpZHRoKCkgfSk7XG5cdFx0XG5cdFx0Ly8gY2xpY2sgZXZlbnQgb24gaXRlbXNcblx0XHR0aGlzLl9kZC5vbignY2xpY2snLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2xpY2tlZCcsIGV2dC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdC8vY29uc29sZS5sb2coJChldnQuY3VycmVudFRhcmdldCkpO1xuXHRcdFx0bGV0IGl0ZW06YW55ID0gJChldnQuY3VycmVudFRhcmdldCkuZGF0YSgnaXRlbScpO1xuXHRcdFx0dGhpcy5pdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtKTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLl9kZC5vbigna2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0Ncblx0XHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5fJGVsLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignbW91c2VlbnRlcicsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdGlmICh0aGlzLmhhdmVSZXN1bHRzKSB7XG5cdFx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3VsJykuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdHRoaXMubW91c2VvdmVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5tb3VzZW92ZXIgPSBmYWxzZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFxuXHR9XG5cblx0cHJpdmF0ZSBjaGVja0luaXRpYWxpemVkKCk6dm9pZCB7XG5cdFx0Ly8gTGF6eSBpbml0XG5cdFx0aWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG5cdFx0XHQvLyBpZiBub3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IGlzTW91c2VPdmVyKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VvdmVyO1xuXHR9XG5cblx0Z2V0IGhhdmVSZXN1bHRzKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApO1xuXHR9XG5cblx0cHVibGljIGZvY3VzTmV4dEl0ZW0ocmV2ZXJzZWQ/OmJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5oYXZlUmVzdWx0cykge1xuXHRcdFx0Ly8gZ2V0IHNlbGVjdGVkXG5cdFx0XHRsZXQgY3VyckVsZW06SlF1ZXJ5ID0gdGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJyk7XG5cdFx0XHRsZXQgbmV4dEVsZW06SlF1ZXJ5ID0gcmV2ZXJzZWQgPyBjdXJyRWxlbS5wcmV2KCkgOiBjdXJyRWxlbS5uZXh0KCk7XG5cblx0XHRcdGlmIChuZXh0RWxlbS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHQvLyBmaXJzdCBcblx0XHRcdFx0bmV4dEVsZW0gPSByZXZlcnNlZCA/IHRoaXMuX2RkLmZpbmQoJ2xpJykubGFzdCgpIDogdGhpcy5fZGQuZmluZCgnbGknKS5maXJzdCgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjdXJyRWxlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRuZXh0RWxlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGZvY3VzUHJldmlvdXNJdGVtKCkge1xuXHRcdHRoaXMuZm9jdXNOZXh0SXRlbSh0cnVlKTtcblx0fVxuXG5cdHB1YmxpYyBzZWxlY3RGb2N1c0l0ZW0oKSB7XG5cdFx0dGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJykudHJpZ2dlcignY2xpY2snKTtcblx0fVxuXG5cdGdldCBpc0l0ZW1Gb2N1c2VkKCk6Ym9vbGVhbiB7XG5cdFx0aWYgKHRoaXMuX2RkLmZpbmQoJ2xpLmFjdGl2ZScpLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRwdWJsaWMgc2hvdygpOnZvaWQge1xuXHRcdGlmICghdGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5zaG93KCk7XG5cdFx0XHR0aGlzLnNob3duID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgaXNTaG93bigpOmJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLnNob3duO1xuXHR9XG5cblx0cHVibGljIGhpZGUoKTp2b2lkIHtcblx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0dGhpcy5fZGQuZHJvcGRvd24oKS5oaWRlKCk7XG5cdFx0XHR0aGlzLnNob3duID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIHVwZGF0ZUl0ZW1zKGl0ZW1zOmFueVtdLCBzZWFyY2hUZXh0OnN0cmluZykge1xuXHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGVJdGVtcycsIGl0ZW1zKTtcblx0XHR0aGlzLml0ZW1zID0gaXRlbXM7XG5cdFx0dGhpcy5zZWFyY2hUZXh0ID0gc2VhcmNoVGV4dDtcblx0XHR0aGlzLnJlZnJlc2hJdGVtTGlzdCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBzaG93TWF0Y2hlZFRleHQodGV4dDpzdHJpbmcsIHFyeTpzdHJpbmcpOnN0cmluZyB7XG5cdFx0bGV0IHN0YXJ0SW5kZXg6bnVtYmVyID0gdGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YocXJ5LnRvTG93ZXJDYXNlKCkpO1xuXHRcdGlmIChzdGFydEluZGV4ID4gLTEpIHtcblx0XHRcdGxldCBlbmRJbmRleDpudW1iZXIgPSBzdGFydEluZGV4ICsgcXJ5Lmxlbmd0aDtcblxuXHRcdFx0cmV0dXJuIHRleHQuc2xpY2UoMCwgc3RhcnRJbmRleCkgKyAnPGI+JyBcblx0XHRcdFx0KyB0ZXh0LnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KSArICc8L2I+J1xuXHRcdFx0XHQrIHRleHQuc2xpY2UoZW5kSW5kZXgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGV4dDtcblx0fVxuXG5cdHByb3RlY3RlZCByZWZyZXNoSXRlbUxpc3QoKSB7XG5cdFx0dGhpcy5jaGVja0luaXRpYWxpemVkKCk7XG5cdFx0dGhpcy5fZGQuZW1wdHkoKTtcblx0XHRsZXQgbGlMaXN0OkpRdWVyeVtdID0gW107XG5cdFx0aWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuXHRcdFx0dGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXHRcdFx0XHRsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLmZvcm1hdEl0ZW0oaXRlbSk7XG5cdFx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgaXRlbVRleHQ6c3RyaW5nO1xuXHRcdFx0XHRsZXQgaXRlbUh0bWw6YW55O1xuXG5cdFx0XHRcdGl0ZW1UZXh0ID0gdGhpcy5zaG93TWF0Y2hlZFRleHQoaXRlbUZvcm1hdHRlZC50ZXh0LCB0aGlzLnNlYXJjaFRleHQpO1xuXHRcdFx0XHRpZiAoIGl0ZW1Gb3JtYXR0ZWQuaHRtbCAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRcdGl0ZW1IdG1sID0gaXRlbUZvcm1hdHRlZC5odG1sO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGl0ZW1IdG1sID0gaXRlbVRleHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRcdGxpLmFwcGVuZChcblx0XHRcdFx0XHQkKCc8YT4nKS5hdHRyKCdocmVmJywgJyMnKS5odG1sKGl0ZW1IdG1sKVxuXHRcdFx0XHQpXG5cdFx0XHRcdC5kYXRhKCdpdGVtJywgaXRlbSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRsaUxpc3QucHVzaChsaSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gTm8gcmVzdWx0c1xuXHRcdFx0bGV0IGxpID0gJCgnPGxpID4nKTtcblx0XHRcdGxpLmFwcGVuZChcblx0XHRcdFx0JCgnPGE+JykuYXR0cignaHJlZicsICcjJykuaHRtbCh0aGlzLm5vUmVzdWx0c1RleHQpXG5cdFx0XHQpXG5cdFx0XHQuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cblx0XHRcdGxpTGlzdC5wdXNoKGxpKTtcblx0XHR9XG5cblx0XHQgXG5cdFx0dGhpcy5fZGQuYXBwZW5kKGxpTGlzdCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbTphbnkpOnZvaWQge1xuXHRcdC8vIGxhdW5jaCBzZWxlY3RlZCBldmVudFxuXHRcdC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudCcsIGl0ZW0pO1xuXHRcdHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VsZWN0JywgaXRlbSlcblx0fVxuXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Ryb3Bkb3duLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==