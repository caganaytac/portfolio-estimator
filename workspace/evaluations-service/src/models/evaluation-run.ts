import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { PortfolioEvaluation } from "./portfolio-evaluation";

export enum EvaluationRunStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

@Entity({
    name: "evaluation_runs"
})
@Index("idx_evaluation_runs_portfolio_created", ["portfolioId", "createdAt"])
@Index("idx_evaluation_runs_status_created", ["status", "createdAt"])
export class EvaluationRun {

    @PrimaryGeneratedColumn("uuid", {
        name: "id"
    })
    id!: string;

    @Column({
        type: "varchar",
        name: "portfolio_id",
        length: 128
    })
    portfolioId!: string;

    @Column({
        type: "varchar",
        name: "user_id",
        length: 128,
        nullable: true
    })
    userId?: string | null;

    @Column({
        type: "enum",
        name: "status",
        enum: EvaluationRunStatus,
        enumName: "evaluation_run_status",
        default: EvaluationRunStatus.PENDING
    })
    status!: EvaluationRunStatus;

    @Column({
        type: "jsonb",
        name: "input_snapshot",
        nullable: true
    })
    inputSnapshot?: Record<string, unknown> | null;

    @Column({
        type: "jsonb",
        name: "ai_advisory",
        nullable: true
    })
    aiAdvisory?: Record<string, unknown> | null;

    @Column({
        type: "jsonb",
        name: "agent_outputs",
        nullable: true
    })
    agentOutputs?: Record<string, unknown> | null;

    @Column({
        type: "varchar",
        name: "ai_model",
        length: 128,
        nullable: true
    })
    aiModel?: string | null;

    @Column({
        type: "varchar",
        name: "prompt_version",
        length: 64,
        nullable: true
    })
    promptVersion?: string | null;

    @Column({
        type: "varchar",
        name: "evaluation_version",
        length: 64,
        default: "1"
    })
    evaluationVersion!: string;

    @Column({
        type: "text",
        name: "error_message",
        nullable: true
    })
    errorMessage?: string | null;

    @Column({
        type: "timestamptz",
        name: "completed_at",        
        nullable: true
    })
    completedAt?: Date | null;

    @OneToOne(
        () => PortfolioEvaluation,
        (evaluation) => evaluation.run,
        {
            cascade: true
        }
    )
    evaluation?: PortfolioEvaluation;

    @CreateDateColumn({
        type: "timestamptz",
        name: "created_at"
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: "timestamptz",
        name: "updated_at"
    })
    updatedAt!: Date;
}
