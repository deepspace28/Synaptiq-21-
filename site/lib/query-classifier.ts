// Query classification for different types of user inputs

type QueryType = "casual" | "scientific" | "experiment" | "derivation" | "research"

export function classifyQuery(query: string): QueryType {
  // Convert to lowercase for case-insensitive matching
  const text = query.toLowerCase()

  // Check for experiment/simulation requests
  if (
    text.includes("simulate") ||
    text.includes("experiment") ||
    text.includes("run") ||
    text.includes("double slit") ||
    text.includes("entropy") ||
    text.includes("pendulum") ||
    text.includes("wave function") ||
    text.includes("lab")
  ) {
    return "experiment"
  }

  // Check for derivation requests
  if (
    text.includes("derive") ||
    text.includes("proof") ||
    text.includes("equation") ||
    text.includes("formula") ||
    text.includes("solve") ||
    text.includes("calculate")
  ) {
    return "derivation"
  }

  // Check for research paper requests
  if (
    text.includes("research") ||
    text.includes("paper") ||
    text.includes("publication") ||
    text.includes("article") ||
    text.includes("journal")
  ) {
    return "research"
  }

  // Check for scientific content
  const scientificKeywords = [
    "quantum",
    "physics",
    "chemistry",
    "biology",
    "mathematics",
    "theorem",
    "theory",
    "relativity",
    "particle",
    "atom",
    "molecule",
    "cell",
    "dna",
    "protein",
    "enzyme",
    "integral",
    "derivative",
    "function",
    "matrix",
    "vector",
    "force",
    "energy",
    "momentum",
    "velocity",
    "acceleration",
    "electron",
    "proton",
    "neutron",
    "quark",
    "boson",
    "fermion",
    "wave",
    "frequency",
    "amplitude",
    "wavelength",
  ]

  if (scientificKeywords.some((keyword) => text.includes(keyword))) {
    return "scientific"
  }

  // Default to casual
  return "casual"
}

// Function to determine if a query is related to scientific simulation
export function shouldShowSimLabButton(query: string): boolean {
  // Convert query to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase()

  // Keywords that indicate simulation intent
  const simulationKeywords = [
    "simulate",
    "simulation",
    "model",
    "experiment",
    "lab",
    "laboratory",
    "physics",
    "quantum",
    "chemistry",
    "biology",
    "mathematics",
    "plot",
    "graph",
    "chart",
    "visualize",
    "visualization",
    "calculate",
    "compute",
    "solve",
    "equation",
    "formula",
    "pendulum",
    "wave",
    "particle",
    "fluid",
    "gas",
    "entropy",
    "oscillation",
    "vibration",
    "motion",
    "dynamics",
    "kinetics",
    "diffusion",
    "reaction",
    "thermodynamics",
    "electromagnetism",
    "gravity",
    "relativity",
    "quantum mechanics",
    "statistical mechanics",
  ]

  // Check if query contains any simulation keywords
  return simulationKeywords.some((keyword) => lowerQuery.includes(keyword))
}

// Function to extract experiment parameters from a query (placeholder)
export function extractExperimentParams(query: string): Record<string, any> {
  // This is a placeholder function that would be replaced by actual AI-based parameter extraction
  // In the new implementation, this is handled by the Groq API
  return {
    type: "generic",
    title: "Scientific Simulation",
    description: "Dynamic simulation based on user query",
    variables: {
      parameter1: 50,
      parameter2: 10,
    },
  }
}
