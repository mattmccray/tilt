import pluralize from 'pluralize'

export function calculateContentStats(content: string) {
  const count = wordCount(content)
  const wordCountRounded = count < 50 ? 50 : Math.round(count / 50) * 50
  const readingTimeValue = parseFloat((count / 200).toFixed(1))
  const wholeMinutes = Math.round(readingTimeValue)
  const readingTime = wholeMinutes < 1
    ? '< 1 minute'
    : `${wholeMinutes} ${pluralize('minute', wholeMinutes)}`

  return { wordCount: count, wordCountRounded, readingTimeValue, wholeMinutes, readingTime }
}

export default calculateContentStats

export function wordCount(content: string) {
  return String(content)
    .replace(/\s/g, '|')
    .split('|')
    .filter(w => w != '')
    .length
}

export const readingTime = (wordCount: number) => (wordCount / 200).toFixed(1)
export const readingTimeInMinutes = (readingTimeValue: number) => Math.ceil(readingTimeValue)
export const readingTimeInMinutesLabel = (wholeMinutes: number) => `${wholeMinutes} ${pluralize('minute', wholeMinutes)}`