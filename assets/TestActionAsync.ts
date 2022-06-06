import { Component, find, _decorator } from "cc";
import { EventBus } from "./EventBus";
import { Food } from "./Food";

@_decorator.ccclass
export class TestActionAsync extends Component {

    @_decorator.property
    protected delay: number = 0;

    @_decorator.property
    protected act: string = '';

    onEnable() {
        find('EventBus').getComponent(EventBus).on(EventBus.OnCook, this.cook, this);
    }

    private _timeEnd: () => void = null;
    private _timePassed: number = 0;
    private _timeDuration: number = 0;

    protected update(dt: number) {
        if (this._timeEnd) {
            this._timePassed += dt;
            if (this._timePassed >= this._timeDuration) {
                this._timeEnd();
                this._timeEnd = null;
            }
        }
    }

    public async asyncWaitForSeconds(delay: number): Promise<void> {

        this._timePassed = 0;
        this._timeDuration = delay;

        return new Promise((resolve, reject) => {
            this._timeEnd = () => {
                resolve();
            }
        });
    }

    async cook(food: Food) {
        await this.asyncWaitForSeconds(this.delay);

        console.log('cook', this.act);
        food.actions.push(this.act);
    }

}