import { MacroAnalystAgent } from "../agents/macro-analyst.agent";
import { PortfolioAdvisorAgent } from "../agents/portfolio-advisor.agent";
import { RiskAuditorAgent } from "../agents/risk-auditor.agent";
import { SynthesizerAgent } from "../agents/sythesizer.agent";
import { TaxOptimizerAgent } from "../agents/tax-optimizer.agent";
import { AdvisoryContextBuilder } from "../builders/advisory-context.builder";
import { AgentExecutor } from "../executors/agent.executor";
import { OpenAIExecutor } from "../executors/openai.executor";
import type { EvaluationContext } from "../types/agent.types";
import type { AdvisoryResponse } from "../types/advisory.types";

export class AiService {

    private readonly contextBuilder: AdvisoryContextBuilder;
    private readonly riskAuditor: RiskAuditorAgent;
    private readonly macroAnalyst: MacroAnalystAgent;
    private readonly taxOptimizer: TaxOptimizerAgent;
    private readonly portfolioAdvisor: PortfolioAdvisorAgent;
    private readonly synthesizer: SynthesizerAgent;

    constructor(
        executor = new AgentExecutor(
            new OpenAIExecutor()
        )
    ) {

        this.contextBuilder = new AdvisoryContextBuilder();
        this.riskAuditor = new RiskAuditorAgent(executor);
        this.macroAnalyst = new MacroAnalystAgent(executor);
        this.taxOptimizer = new TaxOptimizerAgent(executor);
        this.portfolioAdvisor = new PortfolioAdvisorAgent(executor);
        this.synthesizer = new SynthesizerAgent(executor);
    }

    async generateAdvisory( evaluation: EvaluationContext): Promise<AdvisoryResponse> {

        const context = this.contextBuilder.build(evaluation);

        const [
            riskAudit,
            macroAnalysis,
            taxAnalysis,
            portfolioAdvice
        ] = await Promise.all([
            this.riskAuditor.execute(context),
            this.macroAnalyst.execute(context),
            this.taxOptimizer.execute(context),
            this.portfolioAdvisor.execute(context)
        ]);

        return this.synthesizer.execute({
            context,
            riskAudit,
            macroAnalysis,
            taxAnalysis,
            portfolioAdvice
        });
    }
}
