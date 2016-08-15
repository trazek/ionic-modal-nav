(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function _classCallCheck(a, b) {
  if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}Object.defineProperty(exports, "__esModule", { value: !0 });var _createClass = function () {
  function a(a, b) {
    for (var c = 0; c < b.length; c++) {
      var d = b[c];d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
  }return function (b, c, d) {
    return c && a(b.prototype, c), d && a(b, d), b;
  };
}(),
    SHOW_MODAL = "ionicModalNav:show",
    HIDE_MODAL = "ionicModalNav:hide",
    DESTROY_MODAL = "ionicModalNav:destroy",
    MODAL_BACK_DATA = "ionicModalNav:backData",
    MODAL_CLOSE_DATA = "ionicModalNav:closeData",
    IonicModalNavService = function () {
  function a(b, c, d, e, f) {
    var g = this;_classCallCheck(this, a), this._$rootScope = c, this._$state = d, this._$ionicHistory = e, this._$ionicViewSwitcher = f, this._backView = null, this._currentView = null, this._onBackCallbacks = {}, this._onCloseCallbacks = {}, this._modal || (this._modal = b.fromTemplate('\n                <ion-modal-view> \n                    <ion-nav-view name="ionic-modal-nav"></ion-nav-view>\n                </ion-modal-view>\n            ', { scope: c }), c.$on(SHOW_MODAL, function (a, b) {
      g._modal.show();
    }), c.$on(HIDE_MODAL, function (a, b) {
      g._modal.hide();
    }), c.$on(DESTROY_MODAL, function (a, b) {
      g._modal.destroy();
    }));
  }return _createClass(a, [{ key: "show", value: function value(b) {
      this._backView = this._$ionicHistory.backView(), this._currentView = this._$ionicHistory.currentView(), this._$ionicHistory.nextViewOptions({ disableAnimate: !0 }), this._$rootScope.$emit(SHOW_MODAL), this._$state.go(b);
    } }, { key: "go", value: function value(b) {
      this._$ionicViewSwitcher.nextDirection("forward"), this._$state.go(b);
    } }, { key: "goBack", value: function value(b) {
      this._$ionicHistory.goBack(), b && this._$rootScope.$broadcast(MODAL_BACK_DATA, b);
    } }, { key: "hide", value: function value(b) {
      this._$ionicHistory.backView(this._backView), this._$ionicHistory.currentView(this._currentView), this._backView = null, this._currentView = null, this._$rootScope.$emit(HIDE_MODAL), b && this._$rootScope.$broadcast(MODAL_CLOSE_DATA, b);
    } }, { key: "destroy", value: function value() {
      this._$rootScope.$emit(DESTROY_MODAL);
    } }, { key: "onBack", value: function value(b) {
      var c = this,
          d = this._$ionicHistory.currentView().viewId;this._onBackCallbacks[d] = b, this._$rootScope.$on(MODAL_BACK_DATA, function (a, b) {
        var d = c._$ionicHistory.currentView().viewId,
            e = c._onBackCallbacks[d];e && e(b);
      });
    } }, { key: "onClose", value: function value(b) {
      var c = this,
          d = this._$ionicHistory.currentView().viewId;this._onCloseCallbacks[d] = b, this._$rootScope.$on(MODAL_CLOSE_DATA, function (a, b) {
        var d = c._$ionicHistory.currentView().viewId,
            e = c._onCloseCallbacks[d];e && e(b);
      });
    } }]), a;
}();IonicModalNavService.$inject = ["$ionicModal", "$rootScope", "$state", "$ionicHistory", "$ionicViewSwitcher"];var moduleName = "IonicModalNav";angular.module(moduleName, []).service("IonicModalNavService", IonicModalNavService), exports.default = moduleName;
},{}]},{},[1]);
