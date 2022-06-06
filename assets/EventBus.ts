import { Component, Eventify, warn, _decorator } from 'cc';
import { EmitAync } from './EmitAync';
import { Food } from './Food';

@_decorator.ccclass
export class EventBus extends Eventify(Component) {

    // --- EventTarget begin ---
    event(name: string, data: any = null) {
        if (this.hasEventListener(name)) {
            this.emit(name, data);
        }
        else {
            warn('EventBus.event [' + name + '] no listener')
        }
    }

    // --- EventTarget end ---

    public static readonly OnCook: string = 'EventBus.OnCook';

    public async Cook(food: Food): Promise<void> {
        await EmitAync(this, EventBus.OnCook, food);
    }
}