import { _decorator, Component, Node, Collider2D, Contact2DType, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BouncyBall')
export class BouncyBall extends Component {
    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const rigidbody = this.getComponent(RigidBody2D);
        
        if (rigidbody) {
            //play sound
        }
    }
}

