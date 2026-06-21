import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { PortfolioEvaluation } from "./portfolio-evaluation";

export enum PortfolioExposureType {
    COUNTRY = "COUNTRY",
    INDUSTRY = "INDUSTRY",
    ASSET_CLASS = "ASSET_CLASS"
}

@Entity({
    name: "portfolio_exposures"
})
@Index("idx_portfolio_exposures_evaluation_id", ["evaluationId"])
export class PortfolioExposure {

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
        (evaluation) => evaluation.exposures,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "evaluation_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_portfolio_exposures_evaluation"
    })
    evaluation!: PortfolioEvaluation;

    @Column({
        type: "enum",
        name: "type",
        enum: PortfolioExposureType,
        enumName: "portfolio_exposure_type"
    })
    type!: PortfolioExposureType;

    @Column({
        type: "varchar",
        name: "name",
        length: 128
    })
    name!: string;

    @Column({
        type: "double precision",
        name: "weight"
    })
    weight!: number;
}
