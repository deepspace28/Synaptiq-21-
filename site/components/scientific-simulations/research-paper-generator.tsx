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

type PaperType = "physics" | "biology" | "computer-science" | "mathematics"
type PaperFormat = "standard" | "conference" | "journal"

export function ResearchPaperGenerator() {
  const [topic, setTopic] = useState("")
  const [paperType, setPaperType] = useState<PaperType>("physics")
  const [paperFormat, setPaperFormat] = useState<PaperFormat>("standard")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPaper, setGeneratedPaper] = useState("")
  const [paperTitle, setPaperTitle] = useState("")
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sample paper templates
  const paperTemplates = {
    physics: `
\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{natbib}
\\usepackage{physics}

\\title{Quantum Entanglement: Theoretical Foundations and Experimental Verification}
\\author{J. Smith$^1$, A. Johnson$^2$, L. Williams$^1$\\\\
$^1$Department of Physics, University of Science\\\\
$^2$Quantum Research Center, National Laboratory}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
Quantum entanglement represents one of the most profound departures from classical physics, enabling non-local correlations that have no classical analog. In this paper, we present recent advances in the theoretical understanding and experimental manipulation of multipartite entangled states. We demonstrate a novel protocol for generating high-fidelity three-particle GHZ states with a fidelity of 99.2±0.3\\%. Furthermore, we establish a mathematical framework for quantifying entanglement persistence in noisy quantum channels, providing upper bounds on entanglement survival times that improve upon previous estimations by a factor of 2.4. These results have significant implications for quantum communication networks and fault-tolerant quantum computation.
\\end{abstract}

\\section{Introduction}
Quantum entanglement, first identified by Einstein, Podolsky, and Rosen \\cite{einstein1935} as a paradoxical feature of quantum mechanics, has evolved from a philosophical conundrum to a critical resource for quantum information processing. The ability to create, manipulate, and preserve entangled states underpins modern approaches to quantum computing \\cite{bennett2000}, quantum cryptography \\cite{ekert1991}, and quantum sensing \\cite{giovannetti2011}.

The quantitative theory of entanglement has advanced considerably, with measures such as entanglement entropy, concurrence, and negativity providing mathematical tools to characterize the degree of non-separability between quantum subsystems \\cite{horodecki2009}. For a bipartite pure state $|\\psi\\rangle_{AB}$, the von Neumann entropy of the reduced density matrix provides a canonical measure:

\\begin{equation}
S(\\rho_A) = -\\text{Tr}(\\rho_A\\log_2\\rho_A)
\\end{equation}

where $\\rho_A = \\text{Tr}_B(|\\psi\\rangle\\langle\\psi|_{AB})$.

\\section{Theoretical Framework}
The Bell inequalities, formulated by John Bell in 1964, provide a mathematical framework for testing whether quantum entanglement produces results that can be explained by local hidden variable theories. Bell's theorem states that no physical theory of local hidden variables can reproduce all of the predictions of quantum mechanics.

The CHSH (Clauser-Horne-Shimony-Holt) inequality is expressed as:

\\begin{equation}
S = E(a,b) - E(a,b') + E(a',b) + E(a',b') \\leq 2
\\end{equation}

Where $E(a,b)$ represents the correlation between measurements along axes $a$ and $b$.

\\section{Experimental Methods}
Our experimental apparatus consists of a type-II spontaneous parametric down-conversion source using a periodically poled KTP crystal pumped by a 405nm laser diode. The resulting entangled photon pairs exhibit polarization entanglement with a measured Bell state fidelity of 99.7\\%. 

To generate three-particle GHZ states, we employ the protocol described by Smith et al. \\cite{smith2022}, with the addition of a modified beamsplitter arrangement that improves phase stability. The state preparation circuit can be represented as:

\\begin{equation}
|\\text{GHZ}\\rangle = \\frac{1}{\\sqrt{2}}(|000\\rangle + |111\\rangle)
\\end{equation}

Quantum state tomography was performed using the maximum likelihood estimation technique developed by James et al. \\cite{james2001}, with additional robustness modifications as detailed in Appendix A.

\\section{Results and Discussion}

\\subsection{High-Fidelity GHZ State Generation}
Figure 1 shows the density matrix reconstruction of our three-particle GHZ state, with diagonal elements (0.495, 0.008, 0.006, 0.007, 0.006, 0.009, 0.007, 0.462) and significant off-diagonal elements (0.478±0.015, 0.472±0.014) indicating strong quantum coherence.

\\subsection{Entanglement Persistence}
We have developed a theoretical framework for quantifying entanglement degradation in realistic quantum channels characterized by amplitude and phase damping. Our key result is the derivation of the entanglement half-life $t_{1/2}$ for GHZ states:

\\begin{equation}
t_{1/2} = \\frac{\\ln 2}{N\\gamma}
\\end{equation}

where $N$ is the number of entangled particles and $\\gamma$ is the single-particle decoherence rate. This represents an improvement over previous estimates by a factor of 2.4.

\\section{Conclusion}
Our results demonstrate both theoretical and experimental advances in quantum entanglement manipulation. The high-fidelity generation of multipartite entangled states, coupled with improved theoretical bounds on entanglement persistence, provides crucial building blocks for scalable quantum technologies.

Future work will focus on extending these protocols to higher-dimensional systems and investigating topologically protected entangled states that may offer enhanced resistance to environmental decoherence.

\\section*{Acknowledgements}
This research was supported by the National Science Foundation grant QIS-1234567 and the Quantum Research Initiative.

\\bibliographystyle{plain}
\\begin{thebibliography}{9}
\\bibitem{einstein1935} Einstein, A., Podolsky, B., \\& Rosen, N. (1935). Can quantum-mechanical description of physical reality be considered complete? Phys. Rev., 47, 777-780.
\\bibitem{bennett2000} Bennett, C. H., \\& DiVincenzo, D. P. (2000). Quantum information and computation. Nature, 404, 247-255.
\\bibitem{ekert1991} Ekert, A. K. (1991). Quantum cryptography based on Bell's theorem. Phys. Rev. Lett., 67, 661-663.
\\bibitem{giovannetti2011} Giovannetti, V., Lloyd, S., \\& Maccone, L. (2011). Advances in quantum metrology. Nature Photonics, 5, 222-229.
\\bibitem{horodecki2009} Horodecki, R., Horodecki, P., Horodecki, M., \\& Horodecki, K. (2009). Quantum entanglement. Rev. Mod. Phys., 81, 865-942.
\\bibitem{smith2022} Smith, J., et al. (2022). Efficient generation of multipartite entanglement in optical systems. Phys. Rev. Lett., 128, 110503.
\\bibitem{james2001} James, D. F. V., Kwiat, P. G., Munro, W. J., \\& White, A. G. (2001). Measurement of qubits. Phys. Rev. A, 64, 052312.
\\end{thebibliography}

\\end{document}
`,
    biology: `
\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{natbib}

\\title{CRISPR-Cas9 Gene Editing: Advances in Therapeutic Applications for Genetic Disorders}
\\author{M. Rodriguez$^1$, S. Chen$^2$, K. Patel$^1$\\\\
$^1$Department of Molecular Biology, University of Medical Sciences\\\\
$^2$Institute for Genetic Research, National Medical Center}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
The CRISPR-Cas9 system has revolutionized genome editing by providing a precise, efficient, and versatile tool for modifying DNA sequences in living cells. This paper reviews recent advances in CRISPR-Cas9 technology for therapeutic applications targeting genetic disorders. We discuss improvements in delivery methods, specificity, and efficiency that have enabled successful preclinical studies for conditions including cystic fibrosis, Duchenne muscular dystrophy, and sickle cell disease. Additionally, we present new data on reduced off-target effects using our modified guide RNA design, achieving a 94\\% reduction in unintended edits while maintaining on-target efficiency above 85\\%. These developments suggest that CRISPR-based therapies may soon provide treatment options for previously intractable genetic conditions, though significant challenges in delivery, safety, and regulation remain to be addressed.
\\end{abstract}

\\section{Introduction}
The discovery and development of CRISPR-Cas9 (Clustered Regularly Interspaced Short Palindromic Repeats and CRISPR-associated protein 9) has transformed genetic engineering by providing researchers with unprecedented control over genomic modifications \\cite{jinek2012}. Unlike previous gene editing technologies such as zinc finger nucleases (ZFNs) and transcription activator-like effector nucleases (TALENs), CRISPR-Cas9 offers simplicity, versatility, and cost-effectiveness that has accelerated both basic research and therapeutic applications \\cite{doudna2014}.

The basic mechanism of CRISPR-Cas9 involves a guide RNA (gRNA) that directs the Cas9 nuclease to a specific DNA sequence, where it creates a double-strand break. This break can be repaired through either non-homologous end joining (NHEJ) or homology-directed repair (HDR), allowing for gene knockout or precise gene editing, respectively \\cite{hsu2014}.

\\section{Advances in Delivery Methods}
One of the primary challenges in translating CRISPR-Cas9 technology to clinical applications has been developing effective delivery systems that can target specific tissues while minimizing immunogenicity and toxicity.

\\subsection{Viral Vectors}
Adeno-associated viruses (AAVs) have emerged as promising vectors for CRISPR-Cas9 delivery due to their low immunogenicity, ability to transduce both dividing and non-dividing cells, and long-term expression \\cite{wang2020}. However, their limited packaging capacity (approximately 4.7 kb) presents challenges for delivering both Cas9 and gRNA in a single vector.

Recent innovations have addressed this limitation through:
\\begin{itemize}
    \\item Split-Cas9 systems that divide the Cas9 protein into two components delivered by separate AAVs
    \\item Development of smaller Cas9 orthologs, such as SaCas9 from Staphylococcus aureus
    \\item Trans-splicing AAVs that reconstitute a full-length Cas9 mRNA from two separate vectors
\\end{itemize}

\\subsection{Non-viral Delivery}
Lipid nanoparticles (LNPs) have shown promise for delivering CRISPR components, particularly to the liver. Our recent work has demonstrated that ionizable lipid nanoparticles can achieve editing efficiencies of up to 80\\% in hepatocytes following intravenous administration, with minimal accumulation in off-target tissues \\cite{yin2018}.

\\section{Enhancing Specificity and Efficiency}
Off-target effects remain a significant concern for clinical applications of CRISPR-Cas9. Several strategies have been developed to improve specificity:

\\subsection{Modified Cas9 Variants}
High-fidelity Cas9 variants such as eSpCas9, SpCas9-HF1, and HypaCas9 contain mutations that reduce non-specific DNA interactions, significantly decreasing off-target activity while maintaining on-target efficiency \\cite{slaymaker2016, kleinstiver2016}.

\\subsection{Optimized Guide RNA Design}
Our laboratory has developed an algorithm for guide RNA design that incorporates secondary structure predictions and specificity scores. Using this approach, we have observed a 94\\% reduction in off-target effects compared to conventional guide RNAs, as measured by GUIDE-seq analysis (Figure 1).

\\section{Therapeutic Applications}
\\subsection{Cystic Fibrosis}
Recent work has demonstrated successful correction of the F508del mutation in the CFTR gene in patient-derived organoids using CRISPR-Cas9 delivered via lipid nanoparticles \\cite{schwank2013}. Our group has extended this approach to an in vivo mouse model, achieving functional correction in 28\\% of airway epithelial cells following intranasal administration.

\\subsection{Duchenne Muscular Dystrophy}
CRISPR-Cas9-mediated exon skipping has shown promise for treating Duchenne muscular dystrophy (DMD) by restoring the reading frame of the dystrophin gene. In mdx mice, AAV-delivered CRISPR systems targeting exon 23 have restored dystrophin expression to 3-15\\% of wild-type levels, resulting in significant improvement in muscle function \\cite{long2016}.

\\subsection{Sickle Cell Disease}
Clinical trials are currently underway using ex vivo CRISPR editing of hematopoietic stem cells to induce fetal hemoglobin production by disrupting the BCL11A erythroid-specific enhancer \\cite{wu2019}. Preliminary results show promising levels of fetal hemoglobin induction and clinical improvement in patients.

\\section{Ethical and Regulatory Considerations}
The rapid advancement of CRISPR technology has outpaced regulatory frameworks and raised important ethical questions, particularly regarding germline editing. International consensus is emerging that clinical applications should currently be limited to somatic cell editing for treating or preventing serious disease, with appropriate oversight and transparency \\cite{lander2019}.

\\section{Conclusion}
CRISPR-Cas9 technology has made remarkable progress toward clinical application for genetic disorders. Improvements in delivery methods, specificity, and efficiency have enabled successful preclinical studies for multiple conditions. While significant challenges remain, particularly in delivery to certain tissues and ensuring long-term safety, the first wave of CRISPR-based therapies is now entering clinical trials, potentially offering new treatment options for previously untreatable genetic conditions.

Future directions include the development of more precise editing techniques such as base editing and prime editing, which may further reduce off-target effects and expand the range of mutations that can be corrected.

\\section*{Acknowledgements}
This research was supported by the National Institutes of Health grant GM098765 and the Foundation for Genetic Medicine.

\\bibliographystyle{plain}
\\begin{thebibliography}{9}
\\bibitem{jinek2012} Jinek, M., Chylinski, K., Fonfara, I., Hauer, M., Doudna, J. A., \\& Charpentier, E. (2012). A programmable dual-RNA-guided DNA endonuclease in adaptive bacterial immunity. Science, 337(6096), 816-821.
\\bibitem{doudna2014} Doudna, J. A., \\& Charpentier, E. (2014). The new frontier of genome engineering with CRISPR-Cas9. Science, 346(6213), 1258096.
\\bibitem{hsu2014} Hsu, P. D., Lander, E. S., \\& Zhang, F. (2014). Development and applications of CRISPR-Cas9 for genome engineering. Cell, 157(6), 1262-1278.
\\bibitem{wang2020} Wang, D., Zhang, F., \\& Gao, G. (2020). CRISPR-based therapeutic genome editing: strategies and in vivo delivery by AAV vectors. Cell, 181(1), 136-150.
\\bibitem{yin2018} Yin, H., Kauffman, K. J., \\& Anderson, D. G. (2018). Delivery technologies for genome editing. Nature Reviews Drug Discovery, 17(7), 475-486.
\\bibitem{slaymaker2016} Slaymaker, I. M., Gao, L., Zetsche, B., Scott, D. A., Yan, W. X., \\& Zhang, F. (2016). Rationally engineered Cas9 nucleases with improved specificity. Science, 351(6268), 84-88.
\\bibitem{kleinstiver2016} Kleinstiver, B. P., Pattanayak, V., Prew, M. S., Tsai, S. Q., Nguyen, N. T., Zheng, Z., \\& Joung, J. K. (2016). High-fidelity CRISPR-Cas9 nucleases with no detectable genome-wide off-target effects. Nature, 529(7587), 490-495.
\\bibitem{schwank2013} Schwank, G., Koo, B. K., Sasselli, V., Dekkers, J. F., Heo, I., Demircan, T., ... \\& Clevers, H. (2013). Functional repair of CFTR by CRISPR/Cas9 in intestinal stem cell organoids of cystic fibrosis patients. Cell Stem Cell, 13(6), 653-658.
\\bibitem{long2016} Long, C., Amoasii, L., Mireault, A. A., McAnally, J. R., Li, H., Sanchez-Ortiz, E., ... \\& Olson, E. N. (2016). Postnatal genome editing partially restores dystrophin expression in a mouse model of muscular dystrophy. Science, 351(6271), 400-403.
\\bibitem{wu2019} Wu, Y., Zeng, J., Roscoe, B. P., Liu, P., Yao, Q., Lazzarotto, C. R., ... \\& Liu, D. R. (2019). Highly efficient therapeutic gene editing of human hematopoietic stem cells. Nature Medicine, 25(5), 776-783.
\\bibitem{lander2019} Lander, E. S., Baylis, F., Zhang, F., Charpentier, E., Berg, P., Bourgain, C., ... \\& Winnacker, E. L. (2019). Adopt a moratorium on heritable genome editing. Nature, 567(7747), 165-168.
\\end{thebibliography}

\\end{document}
`,
  }

  // Auto-resize textarea
  const handleTopicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTopic(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const generatePaper = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setGeneratedPaper("")

    try {
      // For demo purposes, we'll use template papers
      // In a real app, this would use a proper API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a title based on the topic
      setPaperTitle(topic.split(" ").slice(0, 5).join(" ") + "...")

      // Use a template based on selected paper type
      setGeneratedPaper(paperTemplates[paperType] || paperTemplates.physics)

      // Switch to preview mode
      setViewMode("preview")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAsPDF = () => {
    // In a real app, this would generate an actual PDF
    alert("In a production environment, this would generate a PDF of the research paper.")
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ScientificLogo variant="simple" className="h-6 w-6 text-emerald-500" />
          <CardTitle className="text-lg font-bold text-white">Research Paper Generator</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Generate LaTeX-style scientific papers from a topic prompt
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
                <div className="text-sm text-gray-400 mb-2">Paper Type</div>
                <Select value={paperType} onValueChange={(v) => setPaperType(v as PaperType)}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-800">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Format</div>
                <Select value={paperFormat} onValueChange={(v) => setPaperFormat(v as PaperFormat)}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-800">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <div className="text-sm text-gray-400 mb-2">Research Topic</div>
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={topic}
                    onChange={handleTopicChange}
                    placeholder="Enter research topic or paper title (e.g., 'Quantum entanglement and its applications in quantum computing')"
                    className="min-h-[100px] bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 flex-1"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={generatePaper}
              disabled={isGenerating || !topic.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 mt-4"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Generate Research Paper"}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 pt-4">
            {generatedPaper ? (
              <>
                <div className="bg-white text-black p-8 rounded-md shadow-md min-h-[60vh] overflow-auto">
                  <pre className="font-mono text-xs whitespace-pre-wrap">{generatedPaper}</pre>
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
              <div className="text-center py-20 text-gray-500">Generate a paper first to preview it</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
