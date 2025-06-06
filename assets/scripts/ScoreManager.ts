import { _decorator, Component, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    public static instance: ScoreManager;
    private multiplierScore: number = 0;
    private bonusScore: number = 0;

    onLoad() {
        if (ScoreManager.instance) {
            this.node.destroy();
            return;
        }
        ScoreManager.instance = this;
        game.addPersistRootNode(this.node);
    }
    
    public addMultiplierScore(amount: number) {
        this.multiplierScore += amount;
        console.log(`multiplier score: ${this.multiplierScore}`);
        this.node.emit('multiplier-score-updated', this.multiplierScore);
    }

    public addBonusScore(amount: number) {
        this.bonusScore += amount * this.multiplierScore;
        console.log(`bonus score: ${this.bonusScore}`);
        this.node.emit('bonus-score-updated', this.bonusScore);
        this.node.emit('award-reached');
    }
    
    public clearScore() {
        this.multiplierScore = 0;
        this.bonusScore = 0;

        this.node.emit('multiplier-score-updated', this.multiplierScore);
        this.node.emit('bonus-score-updated', this.bonusScore);
    }
    
    public getMultiplierScore(): number {
        return this.multiplierScore;
    }

    public getBonusScore(): number {
        return this.bonusScore;
    }
}

