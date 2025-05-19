"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Settings, Sliders, Palette, Save, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface ParameterConfig {
  id: string
  label: string
  type: "slider" | "switch" | "select" | "color"
  defaultValue: number | boolean | string
  min?: number
  max?: number
  step?: number
  options?: { label: string; value: string }[]
  unit?: string
}

interface CustomizationPanelProps {
  title?: string
  parameters: ParameterConfig[]
  onParameterChange: (id: string, value: any) => void
  onReset?: () => void
  onSave?: () => void
  className?: string
}

export function CustomizationPanel({
  title = "Customization Options",
  parameters,
  onParameterChange,
  onReset,
  onSave,
  className,
}: CustomizationPanelProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    // Initialize with default values
    const initialValues: Record<string, any> = {}
    parameters.forEach((param) => {
      initialValues[param.id] = param.defaultValue
    })
    return initialValues
  })

  // Group parameters by type for the tabs
  const sliderParams = parameters.filter((p) => p.type === "slider")
  const toggleParams = parameters.filter((p) => p.type === "switch")
  const selectParams = parameters.filter((p) => p.type === "select" || p.type === "color")

  const handleValueChange = (id: string, value: any) => {
    setValues((prev) => {
      const newValues = { ...prev, [id]: value }
      onParameterChange(id, value)
      return newValues
    })
  }

  const handleReset = () => {
    const defaultValues: Record<string, any> = {}
    parameters.forEach((param) => {
      defaultValues[param.id] = param.defaultValue
    })
    setValues(defaultValues)

    // Notify parent about all reset values
    Object.entries(defaultValues).forEach(([id, value]) => {
      onParameterChange(id, value)
    })

    if (onReset) onReset()
  }

  return (
    <Card className={cn("border border-gray-800 bg-gray-950", className)}>
      <CardHeader className="bg-gray-900 border-b border-gray-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
            {onSave && (
              <Button
                variant="default"
                size="sm"
                onClick={onSave}
                className="h-8 text-xs bg-cyan-600 hover:bg-cyan-700"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="sliders">
          <TabsList className="w-full bg-gray-900 rounded-none border-b border-gray-800 p-0">
            <TabsTrigger
              value="sliders"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
              disabled={sliderParams.length === 0}
            >
              <Sliders className="h-4 w-4 mr-1" />
              Sliders
            </TabsTrigger>
            <TabsTrigger
              value="toggles"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
              disabled={toggleParams.length === 0}
            >
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 12C17 13.6569 15.6569 15 14 15C12.3431 15 11 13.6569 11 12C11 10.3431 12.3431 9 14 9C15.6569 9 17 10.3431 17 12Z"
                  fill="currentColor"
                />
              </svg>
              Toggles
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex-1 rounded-none data-[state=active]:bg-gray-800 data-[state=active]:shadow-none py-2"
              disabled={selectParams.length === 0}
            >
              <Palette className="h-4 w-4 mr-1" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sliders" className="p-4 space-y-6">
            {sliderParams.length > 0 ? (
              sliderParams.map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={param.id} className="text-sm text-gray-300">
                      {param.label}
                    </Label>
                    <span className="text-xs text-cyan-400 font-mono bg-cyan-950/30 px-2 py-1 rounded">
                      {values[param.id]} {param.unit || ""}
                    </span>
                  </div>
                  <Slider
                    id={param.id}
                    min={param.min || 0}
                    max={param.max || 100}
                    step={param.step || 1}
                    value={[values[param.id] as number]}
                    onValueChange={([value]) => handleValueChange(param.id, value)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No slider parameters available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="toggles" className="p-4 space-y-6">
            {toggleParams.length > 0 ? (
              toggleParams.map((param) => (
                <div key={param.id} className="flex items-center justify-between">
                  <Label htmlFor={param.id} className="text-sm text-gray-300">
                    {param.label}
                  </Label>
                  <Switch
                    id={param.id}
                    checked={values[param.id] as boolean}
                    onCheckedChange={(value) => handleValueChange(param.id, value)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No toggle parameters available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="appearance" className="p-4 space-y-6">
            {selectParams.length > 0 ? (
              selectParams.map((param) => (
                <div key={param.id} className="space-y-2">
                  <Label htmlFor={param.id} className="text-sm text-gray-300">
                    {param.label}
                  </Label>
                  {param.type === "select" && param.options && (
                    <select
                      id={param.id}
                      value={values[param.id] as string}
                      onChange={(e) => handleValueChange(param.id, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-white"
                    >
                      {param.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {param.type === "color" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id={param.id}
                        value={values[param.id] as string}
                        onChange={(e) => handleValueChange(param.id, e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={values[param.id] as string}
                        onChange={(e) => handleValueChange(param.id, e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-white"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No appearance parameters available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
