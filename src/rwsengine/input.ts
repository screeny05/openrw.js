import { debounce } from 'throttle-debounce';
import { NativeWindow, glfw } from 'node-gles3';

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

        glfw.setInputMode(this.window.handle, glfw.CURSOR, glfw.CURSOR_DISABLED);
    }

    registerEvents(){
        this.window.on('keydown', this.onKey.bind(this, true));
        this.window.on('keyup', this.onKey.bind(this, false));
        this.window.on('mousedown', this.onMouse.bind(this, true));
        this.window.on('mouseup', this.onMouse.bind(this, false));
    }

    onKey(isPressed, e){
        const stateValueId = this.kbdValues[e.key];
        const stateToggleId = this.kbdToggles[e.key];

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
        const mousePosition = glfw.getCursorPos(this.window.handle);
        const startMouseX = this.window.width / 2;
        const startMouseY = this.window.height / 2;

        this.states.rotationX = (startMouseX - mousePosition.xpos) / this.window.width;
        this.states.rotationY = (startMouseY - mousePosition.ypos) / this.window.height;

        glfw.setCursorPos(this.window.handle, startMouseX, startMouseY);
    }
}
