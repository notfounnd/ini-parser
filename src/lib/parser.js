// src/lib/parser.js

/**
 * Parses INI file content into a structured JavaScript object
 *
 * Supports:
 * - Sections: [section_name]
 * - Key-value pairs: key=value
 * - Multi-line values (indented)
 * - Global keys (outside of sections)
 * - Comments (lines starting with #)
 *
 * @param {string} content - The INI file content as a string
 * @param {object} [options] - Configuration options
 * @param {boolean} [options.meta=false] - If true, returns metadata format with type information; if false, returns simplified format
 * @returns {object} Parsed INI data as a JavaScript object. Returns empty object {} for invalid input.
 *
 * @example
 * // Simple usage with default options (simplified format)
 * const ini = parse('[section]\nkey=value');
 * // Returns: { section: { key: ['value'] } }
 *
 * @example
 * // With metadata format
 * const ini = parse('[section]\nkey=value', { meta: true });
 * // Returns: { section: { type: 'section', content: { key: { type: 'configuration', content: ['value'] } } } }
 */
function parse(content, options = { meta: false }) {
  if (!_isValidInput(content)) {
    return {};
  }

  const lines = _splitIntoLines(content);
  const rawResult = _parseLines(lines);

  return _formatOutput(rawResult, options);
}

function _isValidInput(content) {
  return content && typeof content === 'string';
}

function _splitIntoLines(content) {
  return content.split('\n');
}

/**
 * Parses all lines using Strategy Pattern with Guard Clauses
 * Refactored to eliminate nested if/else chains
 */
function _parseLines(lines) {
  const state = _createParserState();
  const classifier = _createLineClassifier();
  const handlers = _createLineHandlers();

  for (const line of lines) {
    const lineType = classifier.classify(line, state);
    const handler = handlers[lineType];

    // Guard clause: skip if no handler found
    if (!handler) continue;

    handler(line, state);
  }

  return state.result;
}

/**
 * Creates initial parser state
 */
function _createParserState() {
  return {
    result: {},
    currentSection: null,
    currentKey: null,
    expectingUnindentedValues: false
  };
}

/**
 * Line classifier using Strategy Pattern
 * Returns line type instead of executing logic directly
 */
function _createLineClassifier() {
  return {
    classify(line, state) {
      const trimmed = line.trim();

      // Guard clause: empty or comment lines
      if (_isEmptyOrComment(trimmed)) {
        return 'SKIP';
      }

      // Guard clause: section declaration
      if (_isSection(trimmed)) {
        return 'SECTION';
      }

      // Guard clause: indented value (works for both global and section keys)
      if (_isIndentedValue(line) && state.currentKey) {
        return 'INDENTED_VALUE';
      }

      // Guard clause: global key-value (no current section)
      if (state.currentSection === null && _isKeyValuePair(line)) {
        return 'GLOBAL_KEY_VALUE';
      }

      // Guard clause: unindented continuation for global keys
      if (state.currentSection === null && state.currentKey && trimmed && state.expectingUnindentedValues) {
        return 'UNINDENTED_CONTINUATION';
      }

      // Guard clause: invalid lines without section context
      if (state.currentSection === null) {
        return 'SKIP';
      }

      // Guard clause: key-value pair in section
      if (_isKeyValuePair(line)) {
        return 'KEY_VALUE';
      }

      // Guard clause: unindented continuation value in section
      if (state.currentKey && trimmed && state.expectingUnindentedValues) {
        return 'UNINDENTED_CONTINUATION';
      }

      return 'SKIP';
    }
  };
}

/**
 * Line handlers using Strategy Pattern
 * Each handler is a pure function with Guard Clauses
 */
function _createLineHandlers() {
  return {
    SKIP: () => {
      // Explicitly do nothing (no-op handler)
    },

    SECTION: (line, state) => {
      const trimmed = line.trim();
      const sectionName = _extractSectionName(trimmed);

      _initializeSection(state.result, sectionName);

      // Update state
      state.currentSection = sectionName;
      state.currentKey = null;
      state.expectingUnindentedValues = false;
    },

    GLOBAL_KEY_VALUE: (line, state) => {
      const { key, value } = _extractKeyValue(line);

      _initializeEntry(state.result, key, null);

      // Guard clause: empty value means expecting continuation
      if (!value) {
        state.currentKey = key;
        state.expectingUnindentedValues = true;
        return;
      }

      _addValueToEntry(state.result, key, null, value);

      // Update state
      state.currentKey = key;
      state.expectingUnindentedValues = false;
    },

    INDENTED_VALUE: (line, state) => {
      const trimmed = line.trim();

      // Guard clause: no current key to attach to
      if (!state.currentKey) return;

      // Guard clause: empty value
      if (!trimmed) return;

      _addValueToEntry(state.result, state.currentKey, state.currentSection, trimmed);

      // Update state
      state.expectingUnindentedValues = false;
    },

    KEY_VALUE: (line, state) => {
      const { key, value } = _extractKeyValue(line);

      _initializeEntry(state.result, key, state.currentSection);

      // Guard clause: empty value means expecting continuation
      if (!value) {
        state.currentKey = key;
        state.expectingUnindentedValues = true;
        return;
      }

      _addValueToEntry(state.result, key, state.currentSection, value);

      // Update state
      state.currentKey = key;
      state.expectingUnindentedValues = false;
    },

    UNINDENTED_CONTINUATION: (line, state) => {
      const trimmed = line.trim();

      _addValueToEntry(state.result, state.currentKey, state.currentSection, trimmed);
    }
  };
}

function _isEmptyOrComment(trimmedLine) {
  return !trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith(';');
}

/**
 * Removes inline comments from value using Guard Clauses
 * Refactored to eliminate nested if/else
 *
 * @param {string} value - Value that may contain inline comments
 * @returns {string} Value without comments
 */
function _removeInlineComment(value) {
  const commentChars = ['#', ';'];
  const indices = commentChars
    .map(char => value.indexOf(char))
    .filter(index => index !== -1);

  // Guard clause: no comment found
  if (indices.length === 0) {
    return value;
  }

  // Find earliest comment position and remove from there
  const firstCommentIndex = Math.min(...indices);
  return value.substring(0, firstCommentIndex).trim();
}

function _isSection(trimmedLine) {
  return trimmedLine.startsWith('[') && trimmedLine.endsWith(']');
}

function _extractSectionName(trimmedLine) {
  return trimmedLine.slice(1, -1).trim();
}

function _initializeSection(result, sectionName) {
  if (!result[sectionName]) {
    result[sectionName] = {
      type: 'section',
      content: {}
    };
  }
}

function _isIndentedValue(line) {
  return line.match(/^\s+/);
}

function _isKeyValuePair(line) {
  return line.indexOf('=') !== -1;
}

function _extractKeyValue(line) {
  const equalIndex = line.indexOf('=');
  const rawValue = line.substring(equalIndex + 1).trim();
  return {
    key: line.substring(0, equalIndex).trim(),
    value: _removeInlineComment(rawValue)
  };
}

/**
 * Unified entry initialization using Guard Clauses
 * Eliminates _initializeKey and _initializeGlobalKey duplication
 *
 * @param {object} result - Parser result object
 * @param {string} key - Key name
 * @param {string|null} sectionName - Section name (null for global keys)
 */
function _initializeEntry(result, key, sectionName) {
  // Guard clause: global key initialization
  if (sectionName === null) {
    if (!result[key]) {
      result[key] = {
        type: 'configuration',
        content: []
      };
    }
    return;
  }

  // Section key initialization
  if (!result[sectionName].content[key]) {
    result[sectionName].content[key] = {
      type: 'configuration',
      content: []
    };
  }
}

/**
 * Unified value addition using Guard Clauses
 * Eliminates _addValue, _addGlobalValue, and _addIndentedValue duplication
 *
 * @param {object} result - Parser result object
 * @param {string} key - Key name
 * @param {string|null} sectionName - Section name (null for global keys)
 * @param {string} value - Value to add
 */
function _addValueToEntry(result, key, sectionName, value) {
  // Guard clause: no value to add
  if (!value) return;

  const values = _shouldSplitBySpaces(value)
    ? value.split(/\s+/).filter((v) => v.trim() !== '')
    : [value];

  // Guard clause: global key
  if (sectionName === null) {
    result[key].content.push(...values);
    return;
  }

  // Section key
  result[sectionName].content[key].content.push(...values);
}

function _shouldSplitBySpaces(value) {
  return /\s/.test(value);
}

/**
 * Formats output using Guard Clause
 */
function _formatOutput(rawResult, options) {
  // Guard clause: return raw result if meta mode is enabled
  if (options.meta === true) {
    return rawResult;
  }

  return _createSimplifiedFormat(rawResult);
}

/**
 * Creates simplified format using Strategy Pattern
 * Eliminates if/else chains with type handlers
 */
function _createSimplifiedFormat(rawResult) {
  const simplified = {};

  // Strategy mapping for entry types
  const typeHandlers = {
    section: (sectionName, section) => {
      simplified[sectionName] = {};
      for (const key in section.content) {
        simplified[sectionName][key] = section.content[key].content;
      }
    },

    configuration: (entryName, entry) => {
      simplified[entryName] = entry.content;
    }
  };

  // Process each entry using Strategy Pattern
  for (const entryName in rawResult) {
    const entry = rawResult[entryName];
    const handler = typeHandlers[entry.type];

    // Guard clause: skip unknown types
    if (!handler) continue;

    handler(entryName, entry);
  }

  return simplified;
}

module.exports = { parse };
