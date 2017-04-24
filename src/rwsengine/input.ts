import { debounce } from 'throttle-debounce';
import NativeWindow from './native-window';
import * as GLFW from 'node-glfw';

export default class Input {
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

    window: NativeWindow;

    lastMouseX: number = 0;
    lastMouseY: number = 0;

    constructor(window: NativeWindow){
        this.window = window;
        this.registerEvents();

        GLFW.SetInputMode(this.window.handle, GLFW.CURSOR, GLFW.CURSOR_DISABLED);
    }

    registerEvents(){
        this.window.on('keydown', this.onKey.bind(this, true), false);
        this.window.on('keyup', this.onKey.bind(this, false), false);
        this.window.on('mousedown', this.onMouse.bind(this, true), false);
        this.window.on('mouseup', this.onMouse.bind(this, false), false);
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

    onMouse(isPressed, e){
        const stateToggleId = this.mouseToggles[e.button];

        if(stateToggleId){
            this.states[stateToggleId] = isPressed;
        }
    }

    update(deltaTime: number){
        this.updateMouse();
    }

    updateMouse(){
        const mousePosition = GLFW.GetCursorPos(this.window.handle);
        const windowSize = this.window.getSize();
        const startMouseX = windowSize.width / 2;
        const startMouseY = windowSize.height / 2;

        this.states.rotationX = (startMouseX - mousePosition.x) / windowSize.width;
        this.states.rotationY = (startMouseY - mousePosition.y) / windowSize.height;

        GLFW.SetCursorPos(this.window.handle, startMouseX, startMouseY);
    }
}
