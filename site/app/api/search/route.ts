import { NextResponse } from "next/server"

// Google API constants
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID

// Fallback search data for when the API fails
const fallbackSearchData = {
  "quantum computing": [
    {
      title: "Quantum Computing - Wikipedia",
      snippet:
        "Quantum computing is a type of computation whose operations can harness the phenomena of quantum mechanics, such as superposition, interference, and entanglement.",
      link: "https://en.wikipedia.org/wiki/Quantum_computing",
    },
    {
      title: "What is Quantum Computing? - IBM",
      snippet:
        "Quantum computers harness the unique behavior of quantum physics to perform calculations in fundamentally different ways than classical computers.",
      link: "https://www.ibm.com/quantum/what-is-quantum-computing",
    },
    {
      title: "Quantum Computing: Progress and Prospects",
      snippet:
        "Quantum computing is an emerging technology that has the potential to solve certain problems that are intractable for classical computers.",
      link: "https://www.nap.edu/catalog/25196/quantum-computing-progress-and-prospects",
    },
  ],
  "artificial intelligence": [
    {
      title: "Artificial Intelligence - Wikipedia",
      snippet:
        "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence of humans and other animals.",
      link: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    },
    {
      title: "What is AI? - IBM",
      snippet:
        "Artificial intelligence leverages computers and machines to mimic the problem-solving and decision-making capabilities of the human mind.",
      link: "https://www.ibm.com/topics/artificial-intelligence",
    },
  ],
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log(`Searching for: ${query}`)

    // Try to use Google Search API first
    if (GOOGLE_API_KEY && SEARCH_ENGINE_ID) {
      try {
        console.log("Attempting to use Google Search API")
        const searchResults = await fetchGoogleSearchResults(query)

        if (searchResults && searchResults.items && searchResults.items.length > 0) {
          const formattedResponse = formatSearchResponse(query, searchResults.items)
          return NextResponse.json({ text: formattedResponse })
        }
      } catch (error: any) {
        console.error("Google Search API error:", error.message)

        // Log specific details for 403 errors
        if (error.message && error.message.includes("403")) {
          console.error("403 Forbidden error from Google API. This typically means:")
          console.error("- The API key doesn't have permission for Custom Search API")
          console.error("- The API key might be invalid or expired")
          console.error("- There might be billing issues with the Google Cloud account")
          console.error("- The Search Engine ID might be incorrect")
        }
      }
    } else {
      console.log("Google Search API credentials not available")
    }

    // If we get here, either the API failed or credentials weren't available
    // Use fallback search mechanism
    console.log("Using fallback search mechanism")
    return NextResponse.json({
      text: generateFallbackSearchResponse(query),
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({
      text: "I apologize, but I encountered an error while processing your search request. Please try again later.",
    })
  }
}

async function fetchGoogleSearchResults(query: string) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`

  console.log("Fetching from Google API...")
  const res = await fetch(url)

  if (!res.ok) {
    const errorText = await res.text()
    console.error(`Google Search API error status: ${res.status}`)
    console.error("Google Search API error response:", errorText)
    throw new Error(`Google Search API returned ${res.status}: ${errorText}`)
  }

  return res.json()
}

function formatSearchResponse(query: string, results: any[]) {
  const response = `
# Search Results for: "${query}"

I've searched the web for information about "${query}" and found the following:

## Summary
Based on the search results, ${query} is a topic with several important aspects worth exploring. The search results provide both overview information and specific details.

## Key Information
${results
  .slice(0, 5)
  .map((result, index) => `${index + 1}. **${result.title}**: ${result.snippet || "No snippet available."}`)
  .join("\n\n")}

## Sources
${results
  .slice(0, 5)
  .map((result, index) => `${index + 1}. [${result.title}](${result.link})`)
  .join("\n\n")}

This information was gathered from web search results. For the most accurate and up-to-date information, I recommend visiting the source websites or consulting specialized scientific literature.
  `.trim()

  return response
}

function generateFallbackSearchResponse(query: string) {
  // Check if we have fallback data for this query
  const normalizedQuery = query.toLowerCase()
  let matchedResults = null

  // Try to find a matching topic in our fallback data
  for (const [topic, results] of Object.entries(fallbackSearchData)) {
    if (normalizedQuery.includes(topic)) {
      matchedResults = results
      break
    }
  }

  // If we don't have fallback data, generate a generic response
  if (!matchedResults) {
    return `
# Search Results for: "${query}"

I attempted to search the web for information about "${query}", but I encountered an issue with the search service.

Instead, I'll provide information based on my training data:

${query} is a topic that spans multiple domains of knowledge. To get the most accurate and up-to-date information, I recommend:

1. Consulting academic journals and publications
2. Checking reputable news sources for recent developments
3. Exploring educational websites and online courses related to this topic

If you have more specific questions about ${query}, please feel free to ask and I'll do my best to provide information based on my knowledge.
    `.trim()
  }

  // Format the fallback results
  return `
# Search Results for: "${query}"

I've searched for information about "${query}" and found the following:

## Summary
Based on available information, ${query} is a topic with several important aspects worth exploring. The results provide both overview information and specific details.

## Key Information
${matchedResults.map((result, index) => `${index + 1}. **${result.title}**: ${result.snippet}`).join("\n\n")}

## Sources
${matchedResults.map((result, index) => `${index + 1}. [${result.title}](${result.link})`).join("\n\n")}

Note: Due to technical limitations with the search service, I'm providing information from my knowledge base. For the most up-to-date information, I recommend visiting the source websites or consulting specialized literature.
  `.trim()
}
