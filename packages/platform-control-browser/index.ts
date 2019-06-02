import { radial, normalise } from 'gamepad-api-mappings';
import { IInput, IInputState } from '@rws/platform/control';
import { DeviceId } from '@rws/platform/control';
import { MouseMove, GamepadAxis, GamepadButton } from '@rws/platform/control/input-source';
import { EventManager } from './event-manager';

type InputStateContainer = Map<number, IInputState>;

export class BrowserInput implements IInput {
    $el: HTMLElement;
    eventManager: EventManager;

    mouseStateContainer: InputStateContainer = new Map();
    keyboardStateContainer: InputStateContainer = new Map();
    gamepad1StateContainer: InputStateContainer = new Map();

    gamepads: Gamepad[] = [];
    gamepadPollInterval: NodeJS.Timer;

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
        if(gamepads.length > 0){
            this.gamepads = Array.from(gamepads).filter((v): v is Gamepad => !!v);
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

        // TODO: normalise axes in @rws/platform/control
        // we have to re-poll, because in chrome the state is only a snapshot
        const { axes, buttons } = navigator.getGamepads()[0]!;
        const axisA = radial({ x: axes[GamepadAxis.AX - 100], y: axes[GamepadAxis.AY - 100] }, 0.25, normalise);
        const axisB = radial({ x: axes[GamepadAxis.BX - 100], y: axes[GamepadAxis.BY - 100] }, 0.25, normalise);

        this.getState(DeviceId.Gamepad1, GamepadAxis.AX).value = axisA.x;
        this.getState(DeviceId.Gamepad1, GamepadAxis.AY).value = axisA.y;
        this.getState(DeviceId.Gamepad1, GamepadAxis.BX).value = axisB.x;
        this.getState(DeviceId.Gamepad1, GamepadAxis.BY).value = axisB.y;
        this.getState(DeviceId.Gamepad1, GamepadButton.A).value = buttons[GamepadButton.A].value;
        this.getState(DeviceId.Gamepad1, GamepadButton.B).value = buttons[GamepadButton.B].value;
        this.getState(DeviceId.Gamepad1, GamepadButton.X).value = buttons[GamepadButton.X].value;
        this.getState(DeviceId.Gamepad1, GamepadButton.Y).value = buttons[GamepadButton.Y].value;
    }

    update(delta: number){
        this.updateMouseState();
        this.updateGamepadState();
    }

    destroy(): void {
        this.eventManager.removeAll();
    }
}
