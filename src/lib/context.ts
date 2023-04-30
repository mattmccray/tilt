import { Config, getActiveConfiguration } from ".."
import { Content, ContentDatabase } from "./database"
import { useContainers } from "./markdown"

let _context: {
  config: Config,
  content: Content | null,
  db: ContentDatabase,
} | null = null

export function getContext() {
  if (!_context) throw new Error('Context not initialized')
  return _context!
}

export function initContext() {
  const config = getActiveConfiguration()
  if (!config) throw new Error('No active configuration')

  if (!config.tilt.source || !config.tilt.output) {
    throw new Error('Invalid configure, requires tilt.source and tilt.output')
  }

  if (config.tilt.markdown?.containers) {
    useContainers(config.tilt.markdown.containers)
  }

  _context = {
    config,
    content: null,
    db: new ContentDatabase(config.tilt.source),
  }

  return _context!
}

export function setActiveContent(content: Content | null) {
  _context!.content = content
}