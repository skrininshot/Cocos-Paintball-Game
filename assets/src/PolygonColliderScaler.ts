import { _decorator, Component, Node, PolygonCollider2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
@_decorator.ccclass('PolygonColliderScaler')
@_decorator.menu('Tools/PolygonColliderScaler') // Добавляет в меню инструментов
export class PolygonColliderScaler extends Component {
    @property({ displayName: 'Масштабный коэффициент' })
    public scale: number = 0.5; // Коэффициент масштабирования (0.5 - уменьшить в 2 раза, 2 - увеличить)

    @property({ displayName: 'Автоматически применять при запуске' })
    public autoApply: boolean = false;

    // onLoad() {
    //     if (this.autoApply && !cc.game.isPaused()) {
    //         this.scaleAllPolygonColliders(this.scale);
    //     }
    // }

    /**
     * Масштабирует все PolygonCollider2D на сцене
     */
    public scaleAllPolygonColliders(scaleFactor: number) {
        const scene = cc.game.getScene();
        if (!scene) {
            console.error('Сцена не найдена');
            return;
        }

        const nodes = this.getAllNodes(scene);
        let count = 0;

        nodes.forEach(node => {
            const collider = node.getComponent(PolygonCollider2D);
            if (collider) {
                count++;
                this.scaleColliderPoints(collider, scaleFactor);
            }
        });

        console.log(`Обработано ${count} PolygonCollider2D компонентов`);
    }

    /**
     * Рекурсивный обход всех нод на сцене
     */
    private getAllNodes(node: Node, result: Node[] = []): Node[] {
        result.push(node);
        node.children.forEach(child => this.getAllNodes(child, result));
        return result;
    }

    /**
     * Масштабирование точек коллайдера
     */
    private scaleColliderPoints(collider: PolygonCollider2D, scaleFactor: number) {
        const points = collider.points;
        if (!points || points.length === 0) {
            console.warn('У коллайдера отсутствуют точки', collider.node.name);
            return;
        }

        // Сохраняем оригинальные точки
        const scaledPoints = [...points];

        // Применяем масштабирование
        for (let i = 0; i < scaledPoints.length; i++) {
            scaledPoints[i] = new Vec2(
                scaledPoints[i].x * scaleFactor,
                scaledPoints[i].y * scaleFactor
            );
        }

        // Обновляем коллайдер
        collider.points = scaledPoints;
        //collider.update(); // Обновляем визуализацию в редакторе
    }
}