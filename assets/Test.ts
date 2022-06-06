import { Component, find, _decorator } from "cc";
import { EventBus } from "./EventBus";
import { Food } from "./Food";

@_decorator.ccclass
export class Test extends Component {

    onEnable() {
        this.scheduleOnce(() => {

            console.log('start cook');

            const food = new Food();

            this.asyncEmit(food);

        }, 1);
    }

    async asyncEmit(food: Food) {
        await find('EventBus').getComponent(EventBus).Cook(food);
        console.log('food cooked');
    }
}