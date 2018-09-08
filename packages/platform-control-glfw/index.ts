import { IInput, IInputState, DeviceId, MouseMove, Key } from '@rws/platform/control';

import { NativeWindow } from '@glaced/lwngl';

type InputStateContainer = Map<number, IInputState>;

// TODO: Implement MouseWheel
export class PlatformInput implements IInput {
    window: NativeWindow;

    hasLock: boolean = false;
    requiresLock: boolean = false;

    mouseStateContainer: InputStateContainer = new Map();
    keyboardStateContainer: InputStateContainer = new Map();

    constructor(window: NativeWindow, requiresLock: boolean = true){
        this.window = window;
        this.requiresLock = requiresLock;
        this.registerEvents();
    }

    registerEvents(): void {
        this.window.on('keydown', this.onKey.bind(this, 1));
        this.window.on('keyup', this.onKey.bind(this, 0));
        this.window.on('mousedown', this.onMouseButton.bind(this, 1));
        this.window.on('mouseup', this.onMouseButton.bind(this, 0));
        this.window.on('mousemove', this.onMouseMove.bind(this));
    }

    onKey(state: number, event: { key: number, scancode: number, action: number, mods: number }){
        if(this.requiresLock && !this.hasLock){
            return;
        }
        if(event.key === Key.Escape && this.hasLock){
            this.hasLock = false;
            this.window.setInputMode(this.window.glfw.CURSOR, this.window.glfw.CURSOR_NORMAL);
        }
        const keyboardState = this.getState(DeviceId.Keyboard, event.key, 0);
        keyboardState.value = state;
    }

    onMouseButton(state: number, event: { button: number, action: number, mods: number }){
        if(!this.hasLock && state === 1){
            this.hasLock = true;
            this.window.setInputMode(this.window.glfw.CURSOR, this.window.glfw.CURSOR_DISABLED);
            return;
        }

        const mouseState = this.getState(DeviceId.Mouse, event.button, 0);
        mouseState.value = state;
    }

    onMouseMove(event: { xpos: number, ypos: number }){
        if(this.requiresLock && !this.hasLock){
            return;
        }

        const startMouseX = this.window.width / 2;
        const startMouseY = this.window.height / 2;

        const moveInputX = this.getState(DeviceId.Mouse, MouseMove.X, startMouseX);
        const moveInputY = this.getState(DeviceId.Mouse, MouseMove.Y, startMouseY);

        moveInputX.value = event.xpos - startMouseX;
        moveInputY.value = event.ypos - startMouseY;

        this.window.setCursorPos(startMouseX, startMouseY);
    }

    startGamepadPolling(){/* noop */}
    stopGamepadPolling(){/* noop */}

    getState(device: DeviceId, input: number, defaultState: number = 0): IInputState {
        const stateContainer = this.getStateContainer(device);
        let state = stateContainer.get(input);
        if(!state){
            state = {
                device,
                input,
                value: defaultState,
            };
            stateContainer.set(input, state);
        }
        return state;
    }

    getStateContainer(device: DeviceId): InputStateContainer {
        if(device === DeviceId.Mouse){
            return this.mouseStateContainer;
        } else if(device === DeviceId.Keyboard){
            return this.keyboardStateContainer;
        }
        throw new Error(`State Container for device '${device}' not implemented`);
    }

    updateMouseState(){
        this.getState(DeviceId.Mouse, MouseMove.X).value = 0;
        this.getState(DeviceId.Mouse, MouseMove.Y).value = 0;
        this.getState(DeviceId.Mouse, MouseMove.WheelX).value = 0;
        this.getState(DeviceId.Mouse, MouseMove.WheelY).value = 0;
    }

    update(delta: number){
        this.updateMouseState();
    }
}
