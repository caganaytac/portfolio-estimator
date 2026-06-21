import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { PortfolioEvaluation } from "./portfolio-evaluation";

@Entity({
    name: "portfolio_stress_tests"
})
@Index("idx_portfolio_stress_tests_evaluation_id", ["evaluationId"])
export class PortfolioStressTest {

    @PrimaryGeneratedColumn("uuid", {
        name: "id"
    })
    id!: string;

    @Column({
        type: "uuid",
        name: "evaluation_id"
    })
    evaluationId!: string;

    @ManyToOne(
        () => PortfolioEvaluation,
        (evaluation) => evaluation.stressTests,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "evaluation_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_portfolio_stress_tests_evaluation"
    })
    evaluation!: PortfolioEvaluation;

    @Column({
        type: "varchar",
        name: "scenario",
        length: 128
    })
    scenario!: string;

    @Column({
        type: "double precision",
        name: "loss_percent"
    })
    lossPercent!: number;
}
