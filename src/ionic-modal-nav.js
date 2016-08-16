/**
 * @description
 * Channels for basic $ionicModal manipulation
 */
const SHOW_MODAL = "ionicModalNav:show";
const HIDE_MODAL = "ionicModalNav:hide";
const DESTROY_MODAL = "ionicModalNav:destroy";

/**
 * @description 
 * Channels for reacting to modal events
 * * ionicModalNav:backdata - Fired when going back from a modal state
 * * ionicModalNav:closeData - Fired when the modal is closed
 */
const MODAL_BACK_DATA = "ionicModalNav:backData";
const MODAL_CLOSE_DATA = "ionicModalNav:closeData";

/**
 * @name IonicModalNavService
 * @module IonicModalNav
 * @description
 * Service used to orchestrate multiple states within an $ionicModal. This
 * can servce as the application's main modal but the user is free to spawn 
 * other modals within the application or even within the IonicModalNav if desired
 */

class IonicModalNavService {
    constructor($ionicModal, $rootScope, $state, $ionicHistory, $ionicViewSwitcher, modalOptions) {

        this._$rootScope = $rootScope;
        this._$state = $state;
        this._$ionicHistory = $ionicHistory;
        this._$ionicViewSwitcher = $ionicViewSwitcher;

        this._backView = null;
        this._currentView = null;

        this._onBackCallbacks = {};
        this._onCloseCallbacks = {};

        if (!this._modal) {
            //Set up modal with a separate named ion-nav-view
            this._modal = $ionicModal.fromTemplate(`
                <ion-modal-view> 
                    <ion-nav-view name="ionic-modal-nav"></ion-nav-view>
                </ion-modal-view>
            `, {
                scope: $rootScope,
                animation: modalOptions.animation,
                focusFirstInput: modalOptions.focusFirstInput,
                backdropClickToClose: modalOptions.backdropClickToClose,
                hardwareBackButtonClose: modalOptions.hardwareBackButtonClose
            });

            /**
             * Register basic modal events
             */
            $rootScope.$on(SHOW_MODAL, (event, data) => {
                this._modal.show();
            });

            $rootScope.$on(HIDE_MODAL, (event, data) => {
                this._modal.hide();
            });

            $rootScope.$on(DESTROY_MODAL, (event, data) => {
                this._modal.destroy();
            });
        }
    }

    /**
     * Open the modal and transition to the given modal state with no animation.
     * Cache the `backView` and the `currentView` so we can restore proper state once 
     * the modal is closed.
     * 
     * @param {string} modalState
     * @params {Object} data                    
     */
    show(modalState, data) {
        this._backView = this._$ionicHistory.backView();
        this._currentView = this._$ionicHistory.currentView();

        this._$ionicHistory.nextViewOptions({
            disableAnimate: true
        });

        this._$rootScope.$emit(SHOW_MODAL);
        if (data) {
            this._$state.go(modalState, data);
        } else {
            this._$state.go(modalState);
        }
    }

    /**
     * Wrapper around the usual `$state.go()`. Force the animation direction to be 
     * forward using `$ionicViewSwitcher`
     * 
     * @param {string} modalState
     */
    go(modalState, data) {
        this._$ionicViewSwitcher.nextDirection('forward');
        if (data) {
            this._$state.go(modalState, data);
        } else {
            this._$state.go(modalState);
        }
    }

    /**
     * Wrapper around usual `$ionicHistory.goBack()`. If data is passed, send it on 
     * the `ionicModalNav:backData` channel.
     * 
     * @param {Object} data
     */
    goBack(data) {
        this._$ionicHistory.goBack();
        if (data) {
            this._$rootScope.$broadcast(MODAL_BACK_DATA, data);
        }
    }

    /**
     * Restore the cache `backView` and `currentView` to the `$ionicHistory` and
     * close the modal. If data is passed, send it on the 
     * `ionicModalNav:closeData` channel.
     * 
     * @param {any} data
     */
    hide(data) {
        this._$ionicHistory.backView(this._backView);
        this._$ionicHistory.currentView(this._currentView);
        this._backView = null;
        this._currentView = null;

        this._$rootScope.$emit(HIDE_MODAL);
        if (data) {
            this._$rootScope.$broadcast(MODAL_CLOSE_DATA, data);
        }
    }

    /**
     * Destroy the modal (probably never used)
     */
    destroy() {
        this._$rootScope.$emit(DESTROY_MODAL);
    }

    //-------------------------
    // Callbacks handlers

    /**
     * Register a callback function when a modal state goes back. To
     * ensure the correct callback is fired, the registering `viewId` is mapped to the passed
     * callback function. If data ia passed, it will be given to the callback function.
     * 
     * @param {Function} callback
     */
    onBack(callback) {
        let currentViewId = this._$ionicHistory.currentView().viewId;
        this._onBackCallbacks[currentViewId] = callback;

        this._$rootScope.$on(MODAL_BACK_DATA, (event, data) => {
            let currentViewId = this._$ionicHistory.currentView().viewId;

            let fn = this._onBackCallbacks[currentViewId];
            if (fn) {
                fn(data);
            }
        });
    }

    /**
     * Register a callback function when the modal closes. To ensure the correct
     * callback is fired, the registering `viewId` is mapped to the passed
     * callback function. If data ia passed, it will be given to the callback function.
     * 
     * @param {Function} callback
     */
    onClose(callback) {
        let currentViewId = this._$ionicHistory.currentView().viewId;
        this._onCloseCallbacks[currentViewId] = callback;

        this._$rootScope.$on(MODAL_CLOSE_DATA, (event, data) => {
            //Get the current view id at the time this handler was fired
            let currentViewId = this._$ionicHistory.currentView().viewId;

            let fn = this._onCloseCallbacks[currentViewId];
            if (fn) {
                fn(data);
            }
        });
    }
}

class IonicModalNavServiceConfig {
    constructor() {
        this.options = {
            animation: "slide-in-up",
            focusFirstInput: false,
            backdropClickToClose: true,
            hardwareBackButtonClose: true
        };
    }

    setModalOptions(options) {
        this.options.animation = (options) ? options.animation : this.options.animation;
        this.options.focusFirstInput = (options) ? options.focusFirstInput : this.options.focusFirstInput;
        this.options.backdropClickToClose = (options) ? options.backdropClickToClose : this.options.backdropClickToClose;
        this.options.hardwareBackButtonClose = (options) ? options.hardwareBackButtonClose : this.options.hardwareBackButtonClose;
    }

    $get($ionicModal, $rootScope, $state, $ionicHistory, $ionicViewSwitcher) {
        return new IonicModalNavService($ionicModal, $rootScope, $state, $ionicHistory, $ionicViewSwitcher, this.options);
    }
}

// --- Declare module -- 

let moduleName = 'IonicModalNav';

angular.module(moduleName, [])
    .provider('IonicModalNavService', IonicModalNavServiceConfig)

export default moduleName;