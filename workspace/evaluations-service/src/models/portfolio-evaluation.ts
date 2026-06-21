import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { EvaluationRun } from "./evaluation-run";
import { PortfolioExposure } from "./portfolio-exposure";
import { PortfolioStressTest } from "./portfolio-stress-test";

@Entity({
    name: "portfolio_evaluations"
})
export class PortfolioEvaluation {

    @PrimaryGeneratedColumn("uuid", {
        name: "id"
    })
    id!: string;

    @Column({
        type: "uuid",
        name: "run_id"
    })
    runId!: string;

    @OneToOne(
        () => EvaluationRun,
        (run) => run.evaluation,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "run_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_portfolio_evaluations_run"
    })
    run!: EvaluationRun;

    @Column({
        type: "double precision",
        name: "total_value"
    })
    totalValue!: number;

    @Column({
        type: "double precision",
        name: "risk_score"
    })
    riskScore!: number;

    @Column({
        type: "double precision",
        name: "volatility_score"
    })
    volatilityScore!: number;

    @Column({
        type: "double precision",
        name: "concentration_risk"
    })
    concentrationRisk!: number;

    @Column({
        type: "double precision",
        name: "diversification_score"
    })
    diversificationScore!: number;

    @OneToMany(
        () => PortfolioExposure,
        (exposure) => exposure.evaluation,
        {
            cascade: true
        }
    )
    exposures!: PortfolioExposure[];

    @OneToMany(
        () => PortfolioStressTest,
        (stressTest) => stressTest.evaluation,
        {
            cascade: true
        }
    )
    stressTests!: PortfolioStressTest[];
}
