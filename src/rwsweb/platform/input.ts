import { IPlatformInput, IPlatformInputState } from "../../rwscore/platform/input";
import { InputDevice } from "../../rwscore/control/device";
import { MouseMove } from "../../rwscore/control/input";

type InputStateContainer = Map<number, IPlatformInputState>;

export class PlatformInput implements IPlatformInput {
    $el: HTMLElement;

    mouseStateContainer: InputStateContainer = new Map();
    keyboardStateContainer: InputStateContainer = new Map();
    gamepad1StateContainer: InputStateContainer = new Map();

    gamepads: Gamepad[] = [];
    gamepadPollInterval: number;

    constructor($el: HTMLElement){
        this.$el = $el;
        this.registerEvents();
    }

    registerEvents(): void {
        // TODO: add gamepad, add mousepointerlock, add scroll, add touch, add webvr?
        this.$el.addEventListener('keydown', this.onKey.bind(this, 1));
        this.$el.addEventListener('keyup', this.onKey.bind(this, 0));
        this.$el.addEventListener('mousedown', this.onMouseButton.bind(this, 1));
        this.$el.addEventListener('mouseup', this.onMouseButton.bind(this, 0));
        this.$el.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.$el.addEventListener('wheel', this.onMouseWheel.bind(this));
        this.$el.addEventListener('contextmenu', e => e.preventDefault());
    }

    onKey(state: number, e: KeyboardEvent){
        const keyboardState = this.getState(InputDevice.Keyboard, e.keyCode, 0);
        keyboardState.value = state;
    }

    onMouseButton(state: number, e: MouseEvent){
        if(!document.pointerLockElement){
            this.$el.requestPointerLock();
        }

        const mouseState = this.getState(InputDevice.Mouse, e.button, 0);
        mouseState.value = state;
    }

    onMouseMove(e: MouseEvent){
        if(!document.pointerLockElement){
            return;
        }

        const moveInputX = this.getState(InputDevice.Mouse, MouseMove.X, 0);
        const moveInputY = this.getState(InputDevice.Mouse, MouseMove.Y, 0);

        moveInputX.value += e.movementX;
        moveInputY.value += e.movementY;
    }

    onMouseWheel(e: WheelEvent){
        const wheelInputX = this.getState(InputDevice.Mouse, MouseMove.WheelX, 0);
        const wheelInputY = this.getState(InputDevice.Mouse, MouseMove.WheelY, 0);

        wheelInputX.value += e.deltaX;
        wheelInputY.value += e.deltaY;
    }

    startGamepadPolling(){
        this.gamepadPollInterval = setInterval(this.pollGamepads.bind(this), 500);
    }

    stopGamepadPolling(){
        clearInterval(this.gamepadPollInterval);
    }

    pollGamepads(){
        this.gamepads = navigator.getGamepads();
        if(this.gamepads.length > 0){
            this.stopGamepadPolling();
        }
    }

    getState(device: InputDevice, input: number, defaultState: number = 0): IPlatformInputState {
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

    getStateContainer(device: InputDevice): InputStateContainer {
        if(device === InputDevice.Mouse){
            return this.mouseStateContainer;
        } else if(device === InputDevice.Keyboard){
            return this.keyboardStateContainer;
        } else if(device === InputDevice.Gamepad1){
            return this.gamepad1StateContainer;
        }
        throw new Error(`State Container for device '${device}' not implemented`);
    }

    updateMouseState(){
        this.getState(InputDevice.Mouse, MouseMove.X).value = 0;
        this.getState(InputDevice.Mouse, MouseMove.Y).value = 0;
        this.getState(InputDevice.Mouse, MouseMove.WheelX).value = 0;
        this.getState(InputDevice.Mouse, MouseMove.WheelY).value = 0;
    }

    updateGamepadState(){
        if(this.gamepads.length === 0){
            return;
        }
    }

    update(delta: number){
        this.updateMouseState();
        this.updateGamepadState();
    }
}
