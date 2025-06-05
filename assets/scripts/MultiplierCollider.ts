import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;
import {ScoreManager} from './ScoreManager';

@ccclass('MultiplierCollider')
export class MultiplierCollider extends Component {
    @property({ type: Number })
    public value: number = 1;

    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.node.name === 'ball') {
            ScoreManager.instance.addMultiplierScore(this.value);
            console.log(`multiplier collider is triggered: ${this.value}`);
        }
    }
}