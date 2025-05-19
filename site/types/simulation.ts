export type SimulationType = "quantum" | "physics" | "math" | "ai" | "general" | "unknown"

export interface SimulationRequest {
  prompt: string
  parameters?: Record<string, any>
}

export interface SimulationResponse {
  type: SimulationType
  result: any
  executionTime: number
  error?: string
}

/**
 * Payload structure for scientific simulation results
 */
export interface ScientificResultPayload {
  summary: string
  equations?: string[]
  charts?: Array<{
    title: string
    labels: string[]
    values: number[]
  }>
  tables?: Array<{
    headers: string[]
    rows: string[][]
  }>
  insight?: string
  isPreview?: boolean

  // Domain-specific fields
  quantumCircuit?: string
  decoherenceEffects?: string
  proofSteps?: string[]
  simulationParameters?: Record<string, any>
  thoughtExperiment?: {
    name: string
    description: string
    key_principles: string[]
    interpretations: Array<{
      name: string
      description: string
    }>
  }

  // Raw content for rendering
  rawContent?: string
}
