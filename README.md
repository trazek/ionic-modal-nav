## Ionic Modal Nav
Angular service used to orchestrate multiple states within an `$ionicModal`.
This can control the modal for an entire application or just when the users needs navigation within a modal body.

## Installation

`npm install --save ionic-modal-nav`

## Usage
Inlcude as a module dependency: 

~~~
import 'ionic-modal-nav';

angular.module('app', [
    'ionic',
    ...
    'IonicModalNav'
]);
~~~

_If you are not using ES6, you can use browserify to transpile and manually reference the file in your index.html file_
_Or you can reference the es5 version of the file, found in `dist/` called `ionic-modal-nav-es5.js` (credit to @zeeshan-m for this)_

Inject into your controllers:

~~~
class Controller {
    constructor(IonicModalNavService) {
        'ngInject';
        ...
~~~

Any state intended to be viewed in the IonicModalNav needs to point to the 
`ionic-modal-nav` view name:

~~~
$stateProvider.state('modal-view', {
    views: {
        'ionic-modal-nav@': {
            template: "<ion-view>... YOUR CONENT HERE ...</ion-view>"
        }
    }
});
~~~

## API

##### IonicModalNavService.show(modalState, data)
Open the modal and transition to the given modal state with no animation.
Cache the `backView` and the `currentView` so we can restore proper state once 
the modal is closed.
 
 ~~~
@param {string} modalState - Modal state name
@param {object} data - State data
 ~~~
 
##### IonicModalNavService.go(modalState, data)
Wrapper around the usual `$state.go()`. If data is passed, it will be sent.
 
~~~
@param {string} modalState
@param {object} state data
~~~
     
##### IonicModalNavService.goBack(data)
Wrapper around usual `$ionicHistory.goBack()`. If data is passed, the incoming state can react
by subscribing to `onBack(callback)`

`@param {object} data`
     
##### IonicModalNavService.hide(data)    
Closes the `IonicModalNav`. If data is passed, the incoming state can react by subscribing to 
`onClose(calback)`

`@param {object} data`
     
##### IonicModalNavService.destroy()    
Destroy the instance of `IonicModalNav` (probably never used)

## Callback handlers

##### IonicModalNavService.onBack(callback)    
Register a `callback` function to react to a modal state going backwards. 

`@param {Function} callback`
 
 ##### IonicModalNavService.onClose(callback)    
Register a `callback` function to react to the `IonicModalNav` closing.

`@param {Function} callback`
