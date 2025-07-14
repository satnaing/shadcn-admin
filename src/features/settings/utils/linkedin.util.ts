export function buildSearchUrl(keywords: string[], authorTitles?: string[]) {
  const encodeKeywords = (terms: string[]) =>
    terms
      ? terms?.length === 1
        ? encodeURIComponent(terms[0])
        : `(${encodeURIComponent(terms.join(' OR '))})`
      : ``
  const searchKeyword = encodeKeywords(keywords)
  const authorTitle =
    authorTitles && authorTitles.length
      ? encodeKeywords(authorTitles)
      : undefined

  const baseUrl = `https://www.linkedin.com/search/results/content/?datePosted="past-24h"&keywords=${searchKeyword}&origin=GLOBAL_SEARCH_HEADER&sid=eme&sortBy="relevance"`

  return authorTitle ? `${baseUrl}&authorJobTitle="${authorTitle}"` : baseUrl
}
