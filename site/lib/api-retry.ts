/**
 * Utility function to retry API calls with exponential backoff
 */
export async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  initialDelay = 500,
): Promise<Response> {
  let retries = 0
  let delay = initialDelay

  while (true) {
    try {
      const response = await fetch(url, options)

      // If the response is successful or we've reached max retries, return it
      if (response.ok || retries >= maxRetries) {
        return response
      }

      // If we get a 429 (rate limit) or 5xx (server error), retry
      if (response.status === 429 || response.status >= 500) {
        retries++

        // Get retry-after header if available
        const retryAfter = response.headers.get("retry-after")
        let waitTime = delay

        if (retryAfter) {
          // retry-after can be a date or seconds
          if (isNaN(Number(retryAfter))) {
            const retryDate = new Date(retryAfter)
            waitTime = retryDate.getTime() - Date.now()
          } else {
            waitTime = Number(retryAfter) * 1000
          }
        }

        console.log(`Retrying fetch (${retries}/${maxRetries}) after ${waitTime}ms`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))

        // Exponential backoff
        delay *= 2
        continue
      }

      // For other error codes, don't retry
      return response
    } catch (error) {
      // For network errors, retry if we haven't reached max retries
      if (retries < maxRetries) {
        retries++
        console.log(`Fetch failed with error, retrying (${retries}/${maxRetries}) after ${delay}ms:`, error)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
      } else {
        throw error
      }
    }
  }
}
