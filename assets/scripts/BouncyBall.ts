import { _decorator, Component, Collider2D, Contact2DType, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BouncyBall')
export class BouncyBall extends Component {
    
    @property ({type: AudioSource})
    audio: AudioSource = null!;
    
    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.audio.play();
    }
}

