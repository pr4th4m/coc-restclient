export const RequestVariableDefinitionWithNameRegexFactory = (
  name: string,
  flags?: string
): RegExp =>
  new RegExp(`^\\s*(?:#{1,}|\\/{2,})\\s+@name\\s+(${name})\\s*$`, flags);

export const RequestVariableDefinitionRegex: RegExp = RequestVariableDefinitionWithNameRegexFactory(
  "\\w+",
  "m"
);

export const LineSplitterRegex: RegExp = /\r?\n/g;

export const NoteCommentRegex = /^\s*(?:#{1,}|\/{2,})\s*@note\s*$/m;

export const WarnCommentRegex = /^\s*(?:#{1,}|\/{2,})\s*@warn\s*$/m;

export const CommentIdentifiersRegex: RegExp = /^\s*(#|\/{2})/;

export const FileVariableDefinitionRegex: RegExp = /^\s*@([^\s=]+)\s*=\s*(.*?)\s*$/;
