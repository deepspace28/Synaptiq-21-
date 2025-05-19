"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScientificLogo } from "@/components/scientific-logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ArticleStyle = "formal" | "accessible" | "publication"

export function ArticleCreator() {
  const [prompt, setPrompt] = useState("")
  const [articleStyle, setArticleStyle] = useState<ArticleStyle>("formal")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedArticle, setGeneratedArticle] = useState("")
  const [articleTitle, setArticleTitle] = useState("")
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sample article templates
  const articleTemplates = {
    formal: `
# Quantum Entanglement: A Comprehensive Review

## Abstract
This paper provides a comprehensive review of quantum entanglement, a phenomenon that Einstein famously referred to as "spooky action at a distance." We examine the theoretical foundations, experimental verifications, and potential applications in quantum computing and quantum cryptography.

## 1. Introduction
Quantum entanglement is a physical phenomenon that occurs when a group of particles interact in such a way that the quantum state of each particle cannot be described independently of the state of the others. This leads to correlations between observable physical properties of the systems that cannot be explained by classical physics.

The mathematical formalism of entanglement can be expressed as:

$$|\\psi\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle_A|1\\rangle_B - |1\\rangle_A|0\\rangle_B)$$

Where $|\\psi\\rangle$ represents the entangled state of two qubits A and B.

## 2. Theoretical Framework
The Bell inequalities, formulated by John Bell in 1964, provide a mathematical framework for testing whether quantum entanglement produces results that can be explained by local hidden variable theories. Bell's theorem states that no physical theory of local hidden variables can reproduce all of the predictions of quantum mechanics.

The CHSH (Clauser-Horne-Shimony-Holt) inequality is expressed as:

$$S = E(a,b) - E(a,b') + E(a',b) + E(a',b') \\leq 2$$

Where $E(a,b)$ represents the correlation between measurements along axes $a$ and $b$.

## 3. Experimental Verification
Numerous experiments have confirmed the predictions of quantum mechanics regarding entanglement. The Aspect experiments in the early 1980s were particularly significant, as they tested Bell's inequalities with high precision.

## 4. Applications

### 4.1 Quantum Computing
Entanglement is a key resource for quantum computing, enabling operations that have no classical counterpart. Quantum computers utilize entangled qubits to perform calculations that would be intractable for classical computers.

### 4.2 Quantum Cryptography
Quantum key distribution protocols, such as BB84 and E91, use entanglement to create cryptographic keys that are theoretically secure against any eavesdropping attempt.

## 5. Future Directions
Current research focuses on creating and maintaining entanglement across longer distances and between larger numbers of particles. The development of quantum repeaters and quantum memories will be crucial for practical quantum networks.

## References
1. Bell, J.S. (1964). "On the Einstein Podolsky Rosen Paradox". Physics, 1(3): 195–200.
2. Aspect, A., Dalibard, J., & Roger, G. (1982). "Experimental Test of Bell's Inequalities Using Time-Varying Analyzers". Physical Review Letters, 49(25): 1804–1807.
3. Bennett, C.H., & Brassard, G. (1984). "Quantum cryptography: Public key distribution and coin tossing". Proceedings of IEEE International Conference on Computers, Systems and Signal Processing, 175–179.
`,
    accessible: `
# Quantum Entanglement: When Particles Share a Spooky Connection

## What is Quantum Entanglement?
Imagine two coins that always show opposite faces when flipped, no matter how far apart they are. If one shows heads, the other instantly shows tails. This is similar to quantum entanglement, except it happens with quantum properties like spin or polarization.

Albert Einstein called this "spooky action at a distance" because it seemed to violate the rule that nothing can travel faster than light. But experiments have proven that entanglement is real!

## How Does It Work?
When two particles become entangled, they form a single quantum system. Even if you separate these particles by millions of miles, measuring one instantly affects the other.

Think of it like this: If you have two boxes, and a cat that can be either in one box or the other, when you open one box and see the cat, you instantly know it's not in the other box. But with quantum entanglement, it's as if the cat is in both boxes until you look!

## Why Does It Matter?
Quantum entanglement isn't just a cool science trick. It's helping us build:

1. **Quantum computers** that can solve problems regular computers can't handle
2. **Super-secure communications** that can't be hacked
3. **Quantum teleportation** (not like Star Trek, but for transferring quantum information)

## Fun Experiments You Can Understand
Scientists have shown entanglement is real through experiments with light. They create pairs of entangled photons (light particles) and measure their properties. If one photon has vertical polarization, its partner instantly has horizontal polarization, even if they're far apart.

The results consistently break the mathematical rules that Einstein thought would limit this "spookiness," showing that entanglement really does transcend our everyday understanding of reality.

## The Big Picture
Quantum entanglement reveals that our universe is more connected than we thought. It challenges our ideas about locality (things only affect nearby things) and reality (things have definite properties before we measure them).

As we continue to explore this quantum connection, we're not just advancing technology—we're deepening our understanding of how the universe fundamentally works.
`,
    publication: `
# Quantum Entanglement and Its Applications in Quantum Information Theory

**Authors:** J. Smith¹, A. Johnson², L. Williams¹  
**¹Department of Physics, University of Science, New York, USA**  
**²Quantum Research Center, National Laboratory, Chicago, USA**  

**DOI:** 10.1038/quantphys.2023.0123

## Abstract
Quantum entanglement represents one of the most profound departures from classical physics, enabling non-local correlations that have no classical analog. In this paper, we present recent advances in the theoretical understanding and experimental manipulation of multipartite entangled states. We demonstrate a novel protocol for generating high-fidelity three-particle GHZ states with a fidelity of 99.2±0.3%. Furthermore, we establish a mathematical framework for quantifying entanglement persistence in noisy quantum channels, providing upper bounds on entanglement survival times that improve upon previous estimations by a factor of 2.4. These results have significant implications for quantum communication networks and fault-tolerant quantum computation.

**Keywords:** quantum entanglement, GHZ states, quantum information, decoherence

## 1. Introduction
Quantum entanglement, first identified by Einstein, Podolsky, and Rosen [1] as a paradoxical feature of quantum mechanics, has evolved from a philosophical conundrum to a critical resource for quantum information processing. The ability to create, manipulate, and preserve entangled states underpins modern approaches to quantum computing [2], quantum cryptography [3], and quantum sensing [4].

The quantitative theory of entanglement has advanced considerably, with measures such as entanglement entropy, concurrence, and negativity providing mathematical tools to characterize the degree of non-separability between quantum subsystems [5]. For a bipartite pure state $|\\psi\\rangle_{AB}$, the von Neumann entropy of the reduced density matrix provides a canonical measure:

$$S(\\rho_A) = -\\text{Tr}(\\rho_A\\log_2\\rho_A)$$

where $\\rho_A = \\text{Tr}_B(|\\psi\\rangle\\langle\\psi|_{AB})$.

## 2. Materials and Methods
Our experimental apparatus consists of a type-II spontaneous parametric down-conversion source using a periodically poled KTP crystal pumped by a 405nm laser diode. The resulting entangled photon pairs exhibit polarization entanglement with a measured Bell state fidelity of 99.7%. 

To generate three-particle GHZ states, we employ the protocol described by Smith et al. [6], with the addition of a modified beamsplitter arrangement that improves phase stability. The state preparation circuit can be represented as:

$$|\\text{GHZ}\\rangle = \\frac{1}{\\sqrt{2}}(|000\\rangle + |111\\rangle)$$

Quantum state tomography was performed using the maximum likelihood estimation technique developed by James et al. [7], with additional robustness modifications as detailed in Appendix A.

## 3. Results and Discussion

### 3.1 High-Fidelity GHZ State Generation
Figure 1 shows the density matrix reconstruction of our three-particle GHZ state, with diagonal elements (0.495, 0.008, 0.006, 0.007, 0.006, 0.009, 0.007, 0.462) and significant off-diagonal elements (0.478±0.015, 0.472±0.014) indicating strong quantum coherence.

### 3.2 Entanglement Persistence
We have developed a theoretical framework for quantifying entanglement degradation in realistic quantum channels characterized by amplitude and phase damping. Our key result is the derivation of the entanglement half-life $t_{1/2}$ for GHZ states:

$$t_{1/2} = \\frac{\\ln 2}{N\\gamma}$$

where $N$ is the number of entangled particles and $\\gamma$ is the single-particle decoherence rate. This represents an improvement over previous estimates by a factor of 2.4.

## 4. Conclusion
Our results demonstrate both theoretical and experimental advances in quantum entanglement manipulation. The high-fidelity generation of multipartite entangled states, coupled with improved theoretical bounds on entanglement persistence, provides crucial building blocks for scalable quantum technologies.

Future work will focus on extending these protocols to higher-dimensional systems and investigating topologically protected entangled states that may offer enhanced resistance to environmental decoherence.

## Acknowledgements
This research was supported by the National Science Foundation grant QIS-1234567 and the Quantum Research Initiative.

## References
1. Einstein, A., Podolsky, B., & Rosen, N. (1935). Can quantum-mechanical description of physical reality be considered complete? Phys. Rev., 47                                                                                          (1935). Can quantum-mechanical description of physical reality be considered complete? Phys. Rev., 47, 777-780.
2. Bennett, C. H., & DiVincenzo, D. P. (2000). Quantum information and computation. Nature, 404, 247-255.
3. Ekert, A. K. (1991). Quantum cryptography based on Bell's theorem. Phys. Rev. Lett., 67, 661-663.
4. Giovannetti, V., Lloyd, S., & Maccone, L. (2011). Advances in quantum metrology. Nature Photonics, 5, 222-229.
5. Horodecki, R., Horodecki, P., Horodecki, M., & Horodecki, K. (2009). Quantum entanglement. Rev. Mod. Phys., 81, 865-942.
6. Smith, J., et al. (2022). Efficient generation of multipartite entanglement in optical systems. Phys. Rev. Lett., 128, 110503.
7. James, D. F. V., Kwiat, P. G., Munro, W. J., & White, A. G. (2001). Measurement of qubits. Phys. Rev. A, 64, 052312.
`,
  }

  // Auto-resize textarea
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const generateArticle = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedArticle("")

    try {
      // For demo purposes, we'll use template articles
      // In a real app, this would use a proper API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a title based on the prompt
      setArticleTitle(prompt.split(" ").slice(0, 5).join(" ") + "...")

      // Use a template based on selected style
      setGeneratedArticle(articleTemplates[articleStyle])

      // Switch to preview mode
      setViewMode("preview")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAsPDF = () => {
    // In a real app, this would generate an actual PDF
    alert("In a production environment, this would generate a PDF of the article.")
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ScientificLogo variant="simple" className="h-6 w-6 text-emerald-500" />
          <CardTitle className="text-lg font-bold text-white">Scientific Article Creator</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Generate publication-quality scientific articles from a prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-gray-950 space-y-4">
        <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as "edit" | "preview")}>
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <div>
                <div className="text-sm text-gray-400 mb-2">Article Style</div>
                <Select value={articleStyle} onValueChange={(v) => setArticleStyle(v as ArticleStyle)}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-800">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="formal">Formal Academic</SelectItem>
                    <SelectItem value="accessible">Accessible/Popular Science</SelectItem>
                    <SelectItem value="publication">Publication Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <div className="text-sm text-gray-400 mb-2">Article Topic</div>
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Describe the scientific topic you want to write about (e.g., 'Quantum entanglement and its implications for quantum computing')"
                    className="min-h-[100px] bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 flex-1"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={generateArticle}
              disabled={isGenerating || !prompt.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 mt-4"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Generate Article"}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 pt-4">
            {generatedArticle ? (
              <>
                <div className="bg-white text-black p-8 rounded-md shadow-md min-h-[60vh] overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: generatedArticle }} className="prose max-w-none" />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setViewMode("edit")}
                    className="border-gray-700 text-gray-300"
                  >
                    Back to Editor
                  </Button>

                  <Button onClick={downloadAsPDF} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" /> Download as PDF
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-500">Generate an article first to preview it</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
