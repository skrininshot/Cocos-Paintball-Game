import { _decorator, Component, Node, view, Size, UITransform, Vec3, Camera, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OrientationSwitcher')
export class OrientationSwitcher extends Component {
    @property(Node)
    canvasNode: Node = null;

    @property(Node)
    mainCameraNode: Node = null;

    @property(Vec3)
    portraitCameraPosition: Vec3 = new Vec3(0, 0, -10);

    @property(Vec3)
    landscapeCameraPosition: Vec3 = new Vec3(0, 0, -10);

    @property
    portraitOrthoHeight: number = 5;

    @property
    landscapeOrthoHeight: number = 7;

    @property(Node)
    portraitCanvas: Node = null;

    @property(Node)
    landscapeCanvas: Node = null;

    @property(Node)
    portraitBackground: Node = null;

    @property(Node)
    landscapeBackground: Node = null;

    @property(Size)
    portraitResolution: Size = new Size(720, 1280);

    @property(Size)
    landscapeResolution: Size = new Size(1280, 720);

    private _lastIsPortrait: boolean = false;

    start() {
        this._lastIsPortrait = this.isPortrait();
        this.applyOrientation(this._lastIsPortrait);
    }

    update() {
        const currentIsPortrait = this.isPortrait();
        if (currentIsPortrait !== this._lastIsPortrait) {
            this.applyOrientation(currentIsPortrait);
            this._lastIsPortrait = currentIsPortrait;
        }
    }

    private isPortrait(): boolean {
        const windowSize = screen.windowSize;
        return windowSize.height >= windowSize.width;
    }

    private applyOrientation(isPortrait: boolean) {
        const resolution = isPortrait ? this.portraitResolution : this.landscapeResolution;
        view.setDesignResolutionSize(resolution.width, resolution.height, view.getResolutionPolicy());

        if (this.canvasNode) {
            const uiTransform = this.canvasNode.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(resolution);
            }
        }

        if (this.mainCameraNode) {
            this.mainCameraNode.setPosition(isPortrait ? this.portraitCameraPosition : this.landscapeCameraPosition);

            const cameraComp = this.mainCameraNode.getComponent(Camera);
            if (cameraComp && cameraComp.orthoHeight) {
                cameraComp.orthoHeight = isPortrait ? this.portraitOrthoHeight : this.landscapeOrthoHeight;
            }
        }

        this.switchOrientationElements(isPortrait);
        view.resizeWithBrowserSize(true);
    }

    private switchOrientationElements(isPortrait: boolean) {
        if (this.portraitCanvas) {
            this.portraitCanvas.active = isPortrait;
        }
        if (this.landscapeCanvas) {
            this.landscapeCanvas.active = !isPortrait;
        }

        if (this.portraitBackground) {
            this.portraitBackground.active = isPortrait;
        }
        if (this.landscapeBackground) {
            this.landscapeBackground.active = !isPortrait;
        }

    }
}
