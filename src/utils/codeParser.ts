export type ParsedCode = {
  cleanCode: string;
  labelMap: Record<string, number>;
};

/**
 * Parses a code string containing label comments (e.g., "// @label:compare")
 * Returns the clean code (without label comments) and a map of label -> line number.
 */
export const parseCodeWithLabels = (rawCode: string): ParsedCode => {
  const lines = rawCode.split('\n');
  const cleanLines: string[] = [];
  const labelMap: Record<string, number> = {};

  let currentLineIndex = 0;

  lines.forEach((line) => {
    // Regex to match:
    // 1. "// @label:name" (JS, Go)
    // 2. "# @label:name" (Python)
    // 3. "/* @label:name */" (Block comments)
    const labelMatch = 
      line.match(/\/\/\s*@label:(\w+)/) || 
      line.match(/#\s*@label:(\w+)/) ||
      line.match(/\/\*\s*@label:(\w+)\s*\*\//);

    if (labelMatch) {
      const label = labelMatch[1];
      // Map the label to the current line index (1-based for UI, or 0-based depending on preference)
      // We will use 0-based index for internal logic
      labelMap[label] = currentLineIndex;
      
      // Remove the label comment from the line for display
      // Replace the match with empty string, then trim trailing spaces if necessary
      const cleanLine = line.replace(labelMatch[0], '').trimEnd();
      cleanLines.push(cleanLine);
    } else {
      cleanLines.push(line);
    }
    currentLineIndex++;
  });

  return {
    cleanCode: cleanLines.join('\n'),
    labelMap,
  };
};
