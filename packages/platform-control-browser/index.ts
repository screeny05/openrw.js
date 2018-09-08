import { IInput, IInputState } from '@rws/platform/control';
import { DeviceId } from '@rws/platform/control';
import { MouseMove } from '@rws/platform/control/input-source';
import { EventManager } from './event-manager';

type InputStateContainer = Map<number, IInputState>;

export class PlatformInput implements IInput {
    $el: HTMLElement;
    eventManager: EventManager;

    mouseStateContainer: InputStateContainer = new Map();
    keyboardStateContainer: InputStateContainer = new Map();
    gamepad1StateContainer: InputStateContainer = new Map();

    gamepads: Gamepad[] = [];
    gamepadPollInterval: number;

    constructor($el: HTMLElement){
        this.$el = $el;
        this.eventManager = new EventManager(this.$el);
        this.registerEvents();
    }

    registerEvents(): void {
        // TODO: add gamepad, add mousepointerlock, add scroll, add touch, add webvr?
        this.eventManager.add('keydown', this.onKey.bind(this, 1));
        this.eventManager.add('keyup', this.onKey.bind(this, 0));
        this.eventManager.add('mousedown', this.onMouseButton.bind(this, 1));
        this.eventManager.add('mouseup', this.onMouseButton.bind(this, 0));
        this.eventManager.add('mousemove', this.onMouseMove.bind(this));
        this.eventManager.add('wheel', this.onMouseWheel.bind(this));
        this.eventManager.add('contextmenu', e => e.preventDefault());
    }

    onKey(state: number, e: KeyboardEvent){
        const keyboardState = this.getState(DeviceId.Keyboard, e.keyCode, 0);
        keyboardState.value = state;
    }

    onMouseButton(state: number, e: MouseEvent){
        if(!document.pointerLockElement){
            this.$el.requestPointerLock();
        }

        const mouseState = this.getState(DeviceId.Mouse, e.button, 0);
        mouseState.value = state;
    }

    onMouseMove(e: MouseEvent){
        if(!document.pointerLockElement){
            return;
        }

        const moveInputX = this.getState(DeviceId.Mouse, MouseMove.X, 0);
        const moveInputY = this.getState(DeviceId.Mouse, MouseMove.Y, 0);

        moveInputX.value += e.movementX;
        moveInputY.value += e.movementY;
    }

    onMouseWheel(e: WheelEvent){
        const wheelInputX = this.getState(DeviceId.Mouse, MouseMove.WheelX, 0);
        const wheelInputY = this.getState(DeviceId.Mouse, MouseMove.WheelY, 0);

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
        const gamepads = navigator.getGamepads();
        if(!gamepads){
            this.gamepads = [];
        }
        if(this.gamepads.length > 0){
            this.stopGamepadPolling();
        }
    }

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
        } else if(device === DeviceId.Gamepad1){
            return this.gamepad1StateContainer;
        }
        throw new Error(`State Container for device '${device}' not implemented`);
    }

    updateMouseState(){
        this.getState(DeviceId.Mouse, MouseMove.X).value = 0;
        this.getState(DeviceId.Mouse, MouseMove.Y).value = 0;
        this.getState(DeviceId.Mouse, MouseMove.WheelX).value = 0;
        this.getState(DeviceId.Mouse, MouseMove.WheelY).value = 0;
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

    destroy(): void {
        this.eventManager.removeAll();
    }
}
