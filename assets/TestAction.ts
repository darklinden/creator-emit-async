import { Component, find, _decorator } from "cc";
import { EventBus } from "./EventBus";
import { Food } from "./Food";

@_decorator.ccclass
export class TestAction extends Component {

    @_decorator.property
    protected delay: number = 0;

    @_decorator.property
    protected act: string = '';

    onEnable() {
        find('EventBus').getComponent(EventBus).on(EventBus.OnCook, this.cook, this);
    }

    cook(food: Food) {
        console.log('cook', this.act);
        food.actions.push(this.act);
    }

}