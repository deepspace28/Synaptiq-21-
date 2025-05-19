"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScientificLogo } from "@/components/scientific-logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, File, Check, X, Loader2 } from "lucide-react"

type AnalysisTab = "summary" | "equations" | "tables" | "metadata"

interface ExtractedData {
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
  equations: string[]
  tables: { caption: string; data: string[] }[]
  figures: { caption: string; description: string }[]
  references: string[]
}

export function PDFAnalyzer() {
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [activeTab, setActiveTab] = useState<AnalysisTab>("summary")
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [summary, setSummary] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadedFileName(file.name)

    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false)

      // After upload completes, start "analysis"
      analyzeFile()
    }, 1500)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const analyzeFile = async () => {
    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      // For demo, generate mock analysis data
      const mockData: ExtractedData = {
        title: "Quantum Entanglement: Implications for Secure Communications",
        authors: ["J. Smith", "A. Johnson", "T. Williams"],
        abstract:
          "This paper explores the potential of quantum entanglement for developing cryptographic systems that are theoretically immune to eavesdropping. We present experimental results demonstrating the feasibility of quantum key distribution over distances exceeding 100 kilometers using entangled photon pairs.",
        keywords: ["quantum entanglement", "quantum cryptography", "quantum key distribution", "quantum communication"],
        equations: [
          "E = -J\\sum_{<i,j>}\\sigma_i\\cdot\\sigma_j",
          "\\rho_{AB} = |\\Psi\\rangle\\langle\\Psi|",
          "S(\\rho_A) = -\\text{Tr}(\\rho_A\\log_2\\rho_A)",
          "P(a,b|A,B) = \\text{Tr}[\\rho_{AB}(E^A_a \\otimes E^B_b)]",
          "Q_{bit} \\leq 11\\%",
        ],
        tables: [
          {
            caption: "Table 1: Experimental Results for Quantum Key Distribution",
            data: [
              "Distance (km) | Key Rate (bits/s) | QBER (%)",
              "10 | 1250 | 2.3",
              "50 | 420 | 3.7",
              "100 | 85 | 6.2",
              "150 | 12 | 9.1",
            ],
          },
          {
            caption: "Table 2: Comparison of QKD Protocols",
            data: [
              "Protocol | Max Distance | Max Key Rate | Security Proof",
              "BB84 | 200 km | 1.5 kbps | Unconditional",
              "E91 | 150 km | 0.9 kbps | Unconditional",
              "BBM92 | 180 km | 1.2 kbps | Unconditional",
              "COW | 250 km | 2.5 kbps | Collective Attacks",
            ],
          },
        ],
        figures: [
          {
            caption: "Figure 1: Experimental Setup for Entanglement Generation",
            description:
              "A schematic diagram showing the experimental apparatus for generating entangled photon pairs using spontaneous parametric down-conversion in a nonlinear crystal pumped by a 405nm laser.",
          },
          {
            caption: "Figure 2: Key Rate vs. Distance",
            description:
              "A graph showing the exponential decay of secure key rate with distance for different QKD protocols. The y-axis (key rate) is shown in logarithmic scale.",
          },
        ],
        references: [
          "Bennett, C.H. & Brassard, G. (1984). Quantum cryptography: Public key distribution and coin tossing. Proceedings of IEEE International Conference on Computers, Systems and Signal Processing, 175–179.",
          "Ekert, A.K. (1991). Quantum cryptography based on Bell's theorem. Physical Review Letters, 67(6), 661–663.",
          "Lo, H.-K., Curty, M. & Qi, B. (2012). Measurement-device-independent quantum key distribution. Physical Review Letters, 108(13), 130503.",
          "Ma, X., Qi, B., Zhao, Y. & Lo, H.-K. (2005). Practical decoy state for quantum key distribution. Physical Review A, 72(1), 012326.",
        ],
      }

      setExtractedData(mockData)

      // Generate a summary
      setSummary(`This paper titled "${mockData.title}" by ${mockData.authors.join(", ")} investigates quantum entanglement applications in secure communications.

The authors demonstrate quantum key distribution over distances up to 150km with acceptable quantum bit error rates. The research compares four quantum key distribution protocols (BB84, E91, BBM92, and COW), analyzing their maximum operational distances, key rates, and security properties.

Key findings include:
1. QKD key rates decrease exponentially with distance
2. Maximum achieved distance of 150km with a key rate of 12 bits/s
3. QBER remains below the 11% threshold required for secure key generation

The paper provides experimental evidence that entanglement-based quantum cryptography is feasible for metropolitan-scale secure networks, though significant engineering challenges remain for intercontinental quantum communications.`)

      setIsAnalyzing(false)
    }, 3000)
  }

  const clearUpload = () => {
    setUploadedFileName("")
    setExtractedData(null)
    setSummary("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ScientificLogo variant="simple" className="h-6 w-6 text-emerald-500" />
          <CardTitle className="text-lg font-bold text-white">Scientific PDF Analyzer</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Extract and analyze information from scientific papers
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-gray-950 space-y-4">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />

        {!uploadedFileName ? (
          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center cursor-pointer hover:border-gray-500 transition-colors"
            onClick={triggerFileInput}
          >
            <FileUp className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2">Click or drag a scientific PDF to upload</p>
            <p className="text-gray-600 text-sm">Supports papers, articles, and research publications</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-md p-3">
              <div className="flex items-center gap-3">
                <File className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-white font-medium">{uploadedFileName}</p>
                  <p className="text-gray-500 text-sm">PDF Document</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isUploading || isAnalyzing ? (
                  <Button disabled className="bg-gray-800">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isUploading ? "Uploading..." : "Analyzing..."}
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={clearUpload} className="text-gray-400 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </Button>

                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Check className="h-4 w-4 mr-1" /> Analyzed
                    </Button>
                  </>
                )}
              </div>
            </div>

            {extractedData && (
              <Tabs defaultValue="summary" value={activeTab} onValueChange={(v) => setActiveTab(v as AnalysisTab)}>
                <TabsList className="bg-gray-900 border border-gray-800">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="equations">Equations</TabsTrigger>
                  <TabsTrigger value="tables">Tables</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4 pt-4">
                  <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                    <h3 className="text-lg font-medium text-white mb-2">Paper Summary</h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-line">{summary}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="equations" className="space-y-4 pt-4">
                  <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                    <h3 className="text-lg font-medium text-white mb-2">Extracted Equations</h3>
                    <div className="space-y-4">
                      {extractedData.equations.map((eq, idx) => (
                        <div key={idx} className="p-3 border border-gray-800 rounded bg-gray-950">
                          <div className="text-gray-400 text-sm mb-1">Equation {idx + 1}</div>
                          <div className="text-white font-mono">$$${eq}$$</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tables" className="space-y-4 pt-4">
                  <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                    <h3 className="text-lg font-medium text-white mb-2">Extracted Tables</h3>
                    <div className="space-y-6">
                      {extractedData.tables.map((table, idx) => (
                        <div key={idx} className="overflow-auto">
                          <h4 className="text-white font-medium mb-2">{table.caption}</h4>
                          <table className="min-w-full border border-gray-800">
                            <tbody>
                              {table.data.map((row, rowIdx) => (
                                <tr
                                  key={rowIdx}
                                  className={rowIdx === 0 ? "bg-gray-800" : "bg-gray-900 even:bg-gray-950"}
                                >
                                  {row.split("|").map((cell, cellIdx) => (
                                    <td key={cellIdx} className="px-4 py-2 border-b border-gray-800 text-white">
                                      {cell.trim()}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4 pt-4">
                  <div className="border border-gray-800 rounded-md p-4 bg-gray-900">
                    <h3 className="text-lg font-medium text-white mb-2">Document Metadata</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Title</h4>
                        <p className="text-white">{extractedData.title}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Authors</h4>
                        <p className="text-white">{extractedData.authors.join(", ")}</p>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Abstract</h4>
                        <p className="text-white">{extractedData.abstract}</p>
                      </div>

                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Keywords</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {extractedData.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-800 text-emerald-400 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Figures</h4>
                      <div className="space-y-3">
                        {extractedData.figures.map((figure, idx) => (
                          <div key={idx} className="border border-gray-800 p-3 rounded bg-gray-950">
                            <p className="font-medium text-white">{figure.caption}</p>
                            <p className="text-gray-400 text-sm mt-1">{figure.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">References</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        {extractedData.references.map((reference, idx) => (
                          <li key={idx} className="text-white text-sm">
                            {reference}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
