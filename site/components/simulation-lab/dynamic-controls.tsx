"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface DynamicControlsProps {
  simulationData: any
  onParameterChange: (params: any) => void
}

export function DynamicControls({ simulationData, onParameterChange }: DynamicControlsProps) {
  const [parameters, setParameters] = useState<Record<string, any>>(simulationData.parameters || {})

  const handleParameterChange = (key: string, value: any) => {
    const updatedParams = { ...parameters, [key]: value }
    setParameters(updatedParams)
    onParameterChange(updatedParams)
  }

  if (!simulationData.parameters || Object.keys(simulationData.parameters).length === 0) {
    return <div className="text-gray-500 text-center py-4">No adjustable parameters available for this simulation</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(simulationData.parameters).map(([key, param]: [string, any]) => {
          if (param.type === "slider") {
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-gray-400">
                    {param.label}: {parameters[key].toFixed(param.decimals || 2)}
                  </Label>
                  {param.unit && <span className="text-sm text-gray-500">{param.unit}</span>}
                </div>
                <Slider
                  value={[parameters[key]]}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  onValueChange={(value) => handleParameterChange(key, value[0])}
                  className="bg-gray-800"
                />
              </div>
            )
          } else if (param.type === "toggle") {
            return (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="text-sm text-gray-400">
                  {param.label}
                </Label>
                <Switch
                  id={key}
                  checked={parameters[key]}
                  onCheckedChange={(checked) => handleParameterChange(key, checked)}
                />
              </div>
            )
          }
          return null
        })}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => onParameterChange(parameters)}
          className="bg-gray-800 hover:bg-gray-700 text-white border-0"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Simulation
        </Button>
      </div>
    </div>
  )
}
