import { debounce } from 'throttle-debounce';
import NativeWindow from './native-window';

export default class Controls {
    kbdValues = {
        37: 'left',
        39: 'right',
        38: 'forward',
        40: 'backward',
        65: 'left',
        68: 'right',
        83: 'backward',
        87: 'forward',
    };

    mouseToggles = {
        0: 'shoot',
        1: 'aim',
    };

    kbdToggles = {
        16: 'isSprinting',
    };

    states = {
        left: 0,
        right: 0,
        forward: 0,
        backward: 0,
        rotationX: 0,
        rotationY: 0,
        isSprinting: false,
        shoot: false,
        aim: false,
    };

    lastMouseX: number = 0;
    lastMouseY: number = 0;

    window: NativeWindow;

    constructor(window: NativeWindow){
        this.window = window;
        this.registerEvents();
    }

    registerEvents(){
        this.window.document.addEventListener('keydown', this.onKey.bind(this, true), false);
        this.window.document.addEventListener('keyup', this.onKey.bind(this, false), false);
        this.window.document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.window.document.addEventListener('mousemove', debounce(100, this.onMouseMoveEnd.bind(this)), false);
        this.window.document.addEventListener('mousedown', this.onMouse.bind(this, true), false);
        this.window.document.addEventListener('mouseup', this.onMouse.bind(this, false), false);
    }

    onKey(isPressed, e){
        const stateValueId = this.kbdValues[e.keyCode];
        const stateToggleId = this.kbdToggles[e.keyCode];

        if(stateValueId){
            this.states[stateValueId] = isPressed ? 1 : 0;
        }

        if(stateToggleId){
            this.states[stateToggleId] = isPressed;
        }
    }

    onMouseMove(e){
        if(e && typeof e.pageX === 'number'){
            this.states.rotationX = (this.lastMouseX - e.pageX) / this.window.options.width * -100;
            this.lastMouseX = e.pageX;
        }

        if(e && typeof e.pageY === 'number'){
            this.states.rotationY = (this.lastMouseY - e.pageY) / this.window.options.width * -100;
            this.lastMouseY = e.pageY;
        }

    }

    onMouseMoveEnd(){
        this.states.rotationX = 0;
        this.states.rotationY = 0;
    }

    onMouse(isPressed, e){
        const stateToggleId = this.mouseToggles[e.button];

        if(stateToggleId){
            this.states[stateToggleId] = isPressed;
        }
    }
}
