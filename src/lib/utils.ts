import * as fs from 'fs'
import * as path from 'path'
import { Header } from "./markdown"
import { Content } from "./database"

/**
    A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
    @param {string} text - String to hash
    @return {number} Resulting number.
*/
export function calcHash(text: string): number {
  'use strict'

  var hash = 5381
  var index = text.length

  while (index) {
    hash = (hash * 33) ^ text.charCodeAt(--index)
  }

  return hash >>> 0
}


export function getFilesInDirectoryRecursivelySync(dirPath: string, excludeFiles: string[] = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  const filePaths: string[] = entries.flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      return getFilesInDirectoryRecursivelySync(fullPath, excludeFiles)
    } else {
      return fullPath
    }
  })

  return filePaths.filter((filePath) => {
    const fileName = path.basename(filePath)
    return !excludeFiles.includes(fileName)
  })
}


export function countWordsInText(text: string) {
  // Remove HTML tags and entities
  let textOnly = text.replace(/\.|\!|\?/g, ' ').replace(/&\w+;/g, '') ?? ''
  // Remove punctuation marks, numbers, and special characters
  const textClean = textOnly.replace(/[^\p{L}\p{M}\p{N}\s]/gu, '')
  // Split the text into an array of words using whitespace as a delimiter
  const wordsArray = textClean.split(/\s+/)
  // Remove any empty elements from the array
  const wordsFiltered = wordsArray.filter(word => word !== '')

  // Return the length of the words array
  return wordsFiltered.length
}

export function normalizeHeadingLevels(headings: Header[], rootLevel = 1) {
  // Find the minimum heading level
  const minLevel = Math.min(...headings.map(heading => parseInt(heading.level, 10)))

  // Calculate the level adjustment based on the specified root level
  const levelAdjustment = rootLevel - minLevel

  // Normalize the heading levels and return a new array with the updated levels
  return headings.map(heading => ({
    id: heading.id,
    level: String(parseInt(heading.level, 10) + levelAdjustment),
    text: heading.text,
  }))
}

export function getContentUri(content: Content, attachment?: string) {
  // TODO: Make this more robust, getContent to figure out the collection to route mapping...
  let uri = `/${content.collection}/${content.slug}`
  if (attachment) uri += `/${attachment}`
  return uri
}

export function ensure(truthy: any, message: string) {
  if (!truthy) throw new Error(message)
}