import PluginAlias from 'metalsmith-alias';

export function handleAliases(options = {}) {
  return PluginAlias(options)
}

export default handleAliases