import patternMatches from 'multimatch';
import { useFiles } from '../core/hooks';
import { Fileset } from '../core/types';

export const getMatchingFilenames = (files: Fileset, pattern: string) => Object
  .keys(files)
  .filter(filename =>
    patternMatches(filename, pattern).length)


export function getMatchingFiles(pattern: string) {
  const files = useFiles()
  const filenames = getMatchingFilenames(files, pattern)

  return filenames.map(filename => files[filename])
}


export function getMatchingFile(filename: string) {
  const files = useFiles()
  return files[filename]
}

export default getMatchingFiles