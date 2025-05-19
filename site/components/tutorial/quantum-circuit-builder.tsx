"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Quantum gate types
type GateType = "H" | "X" | "Y" | "Z" | "CNOT" | "SWAP" | "T" | "S"

interface Gate {
  id: string
  type: GateType
  qubit: number
  control?: number // For controlled gates
  position: number
}

interface QuantumCircuitBuilderProps {
  numQubits?: number
  maxGates?: number
  onCircuitChange?: (gates: Gate[]) => void
  onRunCircuit?: (gates: Gate[]) => void
  className?: string
}

export function QuantumCircuitBuilder({
  numQubits = 3,
  maxGates = 10,
  onCircuitChange,
  onRunCircuit,
  className,
}: QuantumCircuitBuilderProps) {
  const [gates, setGates] = useState<Gate[]>([])
  const [selectedGate, setSelectedGate] = useState<GateType>("H")
  const [isControlled, setIsControlled] = useState(false)
  const [controlQubit, setControlQubit] = useState(0)
  const [targetQubit, setTargetQubit] = useState(1)

  // Generate a unique ID for each gate
  const generateId = () => `gate-${Math.random().toString(36).substr(2, 9)}`

  // Add a gate to the circuit
  const addGate = () => {
    if (gates.length >= maxGates) return

    const newGate: Gate = {
      id: generateId(),
      type: selectedGate,
      qubit: targetQubit,
      position: gates.length,
    }

    if (isControlled && selectedGate !== "CNOT" && selectedGate !== "SWAP") {
      newGate.control = controlQubit
    } else if (selectedGate === "CNOT") {
      newGate.control = controlQubit
    }

    const updatedGates = [...gates, newGate]
    setGates(updatedGates)

    if (onCircuitChange) {
      onCircuitChange(updatedGates)
    }
  }

  // Remove a gate from the circuit
  const removeGate = (id: string) => {
    const updatedGates = gates.filter((gate) => gate.id !== id)
    // Update positions
    updatedGates.forEach((gate, index) => {
      gate.position = index
    })
    setGates(updatedGates)

    if (onCircuitChange) {
      onCircuitChange(updatedGates)
    }
  }

  // Clear the circuit
  const clearCircuit = () => {
    setGates([])
    if (onCircuitChange) {
      onCircuitChange([])
    }
  }

  // Run the circuit
  const runCircuit = () => {
    if (onRunCircuit) {
      onRunCircuit(gates)
    }
  }

  // Get gate color
  const getGateColor = (type: GateType) => {
    switch (type) {
      case "H":
        return "bg-blue-600 border-blue-500"
      case "X":
        return "bg-red-600 border-red-500"
      case "Y":
        return "bg-green-600 border-green-500"
      case "Z":
        return "bg-purple-600 border-purple-500"
      case "CNOT":
        return "bg-amber-600 border-amber-500"
      case "SWAP":
        return "bg-cyan-600 border-cyan-500"
      case "T":
        return "bg-pink-600 border-pink-500"
      case "S":
        return "bg-indigo-600 border-indigo-500"
      default:
        return "bg-gray-600 border-gray-500"
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="circuit" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="circuit">Circuit</TabsTrigger>
          <TabsTrigger value="gates">Gates</TabsTrigger>
        </TabsList>

        <TabsContent value="circuit" className="space-y-4">
          <Card className="border border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px]">
                  {/* Circuit grid */}
                  <div className="relative">
                    {/* Qubit lines */}
                    {Array.from({ length: numQubits }).map((_, qubit) => (
                      <div key={qubit} className="flex items-center h-16 relative">
                        <div className="w-16 text-center text-sm font-mono">
                          |0⟩<sub>{qubit}</sub>
                        </div>
                        <div className="flex-1 border-b border-dashed border-gray-600 relative">
                          {/* Gates on this qubit */}
                          {gates
                            .filter((gate) => gate.qubit === qubit || gate.control === qubit)
                            .map((gate) => (
                              <div
                                key={gate.id}
                                className={cn(
                                  "absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-md border-2 cursor-pointer",
                                  gate.control !== undefined && gate.qubit !== qubit
                                    ? "bg-transparent border-0"
                                    : getGateColor(gate.type),
                                )}
                                style={{ left: `${gate.position * 60 + 20}px` }}
                                onClick={() => removeGate(gate.id)}
                              >
                                {gate.control !== undefined && gate.qubit !== qubit ? (
                                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                ) : (
                                  <span className="font-bold text-white">{gate.type}</span>
                                )}
                              </div>
                            ))}

                          {/* Control-target lines */}
                          {gates
                            .filter(
                              (gate) =>
                                gate.control !== undefined &&
                                ((gate.control === qubit && gate.qubit > qubit) ||
                                  (gate.qubit === qubit && gate.control < qubit)),
                            )
                            .map((gate) => (
                              <div
                                key={`line-${gate.id}`}
                                className="absolute top-0 w-0.5 bg-amber-500"
                                style={{
                                  left: `${gate.position * 60 + 25}px`,
                                  height: gate.control === qubit ? `${(gate.qubit - qubit) * 64}px` : "100%",
                                  top: gate.control === qubit ? "50%" : "0",
                                }}
                              ></div>
                            ))}
                        </div>
                      </div>
                    ))}

                    {/* Measurement line */}
                    <div className="flex items-center h-16">
                      <div className="w-16 text-center text-sm font-mono">Meas.</div>
                      <div className="flex-1 border-b border-dashed border-gray-600 flex">
                        {Array.from({ length: numQubits }).map((_, qubit) => (
                          <div
                            key={qubit}
                            className="w-10 h-10 border-2 border-gray-600 rounded-md flex items-center justify-center mx-3"
                          >
                            <span className="text-xs text-gray-400">q{qubit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearCircuit} className="bg-gray-800 border-gray-700 hover:bg-gray-700">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={runCircuit} className="bg-cyan-600 hover:bg-cyan-700">
              <Play className="h-4 w-4 mr-2" />
              Run Circuit
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gates" className="space-y-4">
          <Card className="border border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {(["H", "X", "Y", "Z", "CNOT", "SWAP", "T", "S"] as GateType[]).map((gate) => (
                    <Button
                      key={gate}
                      variant="outline"
                      className={cn(
                        "h-12 font-mono",
                        selectedGate === gate
                          ? `ring-2 ring-offset-2 ring-offset-gray-900 ${getGateColor(gate)}`
                          : "bg-gray-800 border-gray-700 hover:bg-gray-700",
                      )}
                      onClick={() => setSelectedGate(gate)}
                    >
                      {gate}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Target Qubit</label>
                    <select
                      value={targetQubit}
                      onChange={(e) => setTargetQubit(Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                    >
                      {Array.from({ length: numQubits }).map((_, i) => (
                        <option key={i} value={i}>
                          Qubit {i}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(selectedGate === "CNOT" || isControlled) && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Control Qubit</label>
                      <select
                        value={controlQubit}
                        onChange={(e) => setControlQubit(Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                        disabled={targetQubit === controlQubit}
                      >
                        {Array.from({ length: numQubits }).map((_, i) => (
                          <option key={i} value={i} disabled={i === targetQubit}>
                            Qubit {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {selectedGate !== "CNOT" && selectedGate !== "SWAP" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="controlled"
                      checked={isControlled}
                      onChange={(e) => setIsControlled(e.target.checked)}
                      className="rounded border-gray-700 bg-gray-800 text-cyan-600 focus:ring-cyan-600"
                    />
                    <label htmlFor="controlled" className="text-sm text-gray-400">
                      Make it a controlled gate
                    </label>
                  </div>
                )}

                <Button
                  onClick={addGate}
                  disabled={gates.length >= maxGates}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
