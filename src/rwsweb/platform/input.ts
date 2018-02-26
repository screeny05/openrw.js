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
        this.$el.requestPointerLock();
    }

    registerEvents(): void {
        // TODO: add gamepad, add mousepointerlock, add scroll
        this.$el.addEventListener('keydown', this.onKey.bind(this, true));
        this.$el.addEventListener('keyup', this.onKey.bind(this, false));
        this.$el.addEventListener('mousedown', this.onMouseButton.bind(this, true));
        this.$el.addEventListener('mouseup', this.onMouseButton.bind(this, false));
        this.$el.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.$el.addEventListener('wheel', this.onMouseWheel.bind(this));
    }

    onKey(isPressed, e: KeyboardEvent){
        const keyboardState = this.getState(InputDevice.Keyboard, e.keyCode, false);
        keyboardState.state = isPressed;
    }

    onMouseButton(isPressed, e: MouseEvent){
        const mouseState = this.getState(InputDevice.Mouse, e.button, false);
        mouseState.state = isPressed;
    }

    onMouseMove(e: MouseEvent){
        const moveInputX = this.getState(InputDevice.Mouse, MouseMove.X, 0);
        const moveInputY = this.getState(InputDevice.Mouse, MouseMove.Y, 0);

        moveInputX.state += e.movementX;
        moveInputY.state += e.movementY;
    }

    onMouseWheel(e: WheelEvent){
        const wheelInputX = this.getState(InputDevice.Mouse, MouseMove.WheelX, 0);
        const wheelInputY = this.getState(InputDevice.Mouse, MouseMove.WheelY, 0);

        wheelInputX.state += e.deltaX;
        wheelInputY.state += e.deltaY;
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

    getState(device: InputDevice, input: number, defaultState?: any): IPlatformInputState {
        const stateContainer = this.getStateContainer(device);
        let state = stateContainer.get(input);
        if(!state){
            state = {
                device,
                input,
                state: defaultState,
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
        this.getState(InputDevice.Mouse, MouseMove.X, 0).state = 0;
        this.getState(InputDevice.Mouse, MouseMove.Y, 0).state = 0;
        this.getState(InputDevice.Mouse, MouseMove.WheelX, 0).state = 0;
        this.getState(InputDevice.Mouse, MouseMove.WheelY, 0).state = 0;
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
