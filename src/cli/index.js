/**
 * CLI Module for INI Parser
 *
 * This module provides the command-line interface for the INI parser.
 * It uses Commander.js for argument parsing and Chalk for colored output.
 *
 * @module cli
 */

const { Command } = require('commander');
const chalk = require('chalk');
const { version } = require('../../package.json');
const fs = require('fs');
const { parse } = require('../lib/parser');

/**
 * Validates if a file exists and is readable
 *
 * Uses Guard Clauses to check file accessibility.
 * Returns false if file does not exist or is not readable.
 *
 * @param {string} filePath - Path to file
 * @returns {boolean} True if file exists and is readable
 *
 * @example
 * if (!_isFileValid('config.ini')) {
 *   console.error('File not found');
 * }
 */
function _isFileValid(filePath) {
  // Guard: Check if file path is provided
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

  // Guard: Check if file exists
  if (!fs.existsSync(filePath)) {
    return false;
  }

  // Guard: Check if file is readable
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads file content
 *
 * Uses Guard Clauses to validate input and handle errors.
 * Throws error if file cannot be read.
 *
 * @param {string} filePath - Path to file
 * @returns {string} File content
 * @throws {Error} If file cannot be read
 *
 * @example
 * const content = _readFile('config.ini');
 */
function _readFile(filePath) {
  // Guard: Validate file path
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // Guard: Attempt to read file
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    throw new Error(`Cannot read file: ${filePath}`);
  }
}

/**
 * Formats JSON with pretty-print
 *
 * Uses 2 spaces indentation (project standard).
 *
 * @param {object} data - Data to format
 * @returns {string} Formatted JSON string
 *
 * @example
 * const json = _formatJSON({ section: { key: ['value'] } });
 */
function _formatJSON(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Counts sections and keys in parsed result
 *
 * Handles both simplified and meta formats.
 * Uses Guard Clauses to handle edge cases.
 *
 * @param {object} parsedData - Parsed INI data
 * @returns {{sections: number, keys: number}} Statistics
 *
 * @example
 * const stats = _countStats({ section1: { key1: ['value'] } });
 * // Returns: { sections: 1, keys: 1 }
 */
function _countStats(parsedData) {
  // Guard: Handle empty or invalid data
  if (!parsedData || typeof parsedData !== 'object') {
    return { sections: 0, keys: 0 };
  }

  let sections = 0;
  let keys = 0;

  for (const entryName in parsedData) {
    const entry = parsedData[entryName];

    // Guard: Skip invalid entries
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    // Check if entry is a section (has nested content)
    // In meta format: entry.type === 'section'
    // In simplified format: entry is an object with nested keys
    const isSection = entry.type === 'section' ||
                      (typeof entry === 'object' && !Array.isArray(entry) && !entry.type);

    // Guard: Handle section entries first
    if (isSection) {
      sections++;

      // Count keys within section
      const content = entry.content || entry;
      for (const key in content) {
        // Guard: Skip type property in meta format
        if (key === 'type') continue;

        keys++;
      }
      continue;
    }

    // Global key (configuration type)
    keys++;
  }

  return { sections, keys };
}

/**
 * Writes content to file
 *
 * Uses Guard Clauses to validate input and handle errors.
 * Throws error if file cannot be written.
 *
 * @param {string} filePath - Output file path
 * @param {string} content - Content to write
 * @throws {Error} If file cannot be written
 *
 * @example
 * _writeFile('output.json', '{"key": "value"}');
 */
function _writeFile(filePath, content) {
  // Guard: Validate file path
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // Guard: Validate content
  if (content === undefined || content === null) {
    throw new Error('Invalid content');
  }

  // Guard: Attempt to write file
  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch {
    throw new Error(`Cannot write to file: ${filePath}`);
  }
}

/**
 * Displays a formatted message with color coding
 *
 * Formats messages with colored labels and uncolored content.
 * Uses Chalk for terminal color output.
 *
 * @param {string} msg - The message to display
 * @param {'error'|'success'|'warning'} type - Message type
 *
 * @example
 * _showMessage('File not found: config.ini', 'error');
 * // Output: [  ERROR  ] File not found: config.ini (ERROR in red)
 */
function _showMessage(msg, type) {
  // Guard: Validate type
  const validTypes = ['error', 'success', 'warning'];
  if (!validTypes.includes(type)) {
    type = 'error'; // Default to error if invalid type
  }

  // Define label formatting with exact spacing
  const labels = {
    error: chalk.red('[  ERROR  ]'),
    success: chalk.green('[ SUCCESS ]'),
    warning: chalk.yellow('[ WARNING ]')
  };

  // Output: colored label + space + uncolored message
  console.log(`${labels[type]} ${msg}`);
}

/**
 * Runs the CLI application
 *
 * Parses command-line arguments, configures the INI parser CLI,
 * and processes INI files according to specified options.
 *
 * Handles file validation, reading, parsing, and output formatting.
 * Supports multiple modes: normal parsing, check mode, and quiet output.
 *
 * @param {string[]} argv - Command-line arguments (typically process.argv)
 * @returns {void}
 *
 * @example
 * // Called from bin/ini-parser.js
 * runCli(process.argv);
 */
function runCli(argv) {
  // Guard: Ensure argv is provided
  if (!argv || !Array.isArray(argv)) {
    throw new TypeError('argv must be an array of strings');
  }

  // Create a new Command instance for this execution
  const program = new Command();

  // Configure program to catch errors instead of auto-exiting
  program.exitOverride();

  // Suppress Commander's default error output (we'll use our colored messages)
  program.configureOutput({
    writeErr: () => {
      // Suppress Commander's error messages - we handle them in catch block
    }
  });

  // Configure program metadata
  program
    .name('ini-parser')
    .description('Parse INI files into JSON format')
    .version(version, '-v, --version', 'Output the current version');

  // Configure required argument: INI file path
  program.argument(
    '<file>',
    'Path to INI file (relative or absolute)',
  );

  // Configure optional flags
  program
    .option(
      '-o, --output <file>',
      'Save output to JSON file',
    )
    .option(
      '--meta',
      'Return metadata format with type information',
    )
    .option(
      '-q, --quiet',
      'Suppress stdout output when saving to file',
    )
    .option(
      '--check',
      'Check INI file and display statistics without full output',
    );

  // Configure action handler
  program.action((file, options) => {
    try {
      // 1. Validate file exists and is readable
      if (!_isFileValid(file)) {
        _showMessage(`File not found or not readable: ${file}`, 'error');
        process.exit(1);
      }

      // 2. Read file content
      const content = _readFile(file);

      // 3. Parse content with appropriate options
      // Note: Parser expects { meta: false } for simplified format (default)
      //       and { meta: true } for meta format (when --meta is passed)
      const parsedData = parse(content, { meta: options.meta === true });

      // 4. Handle --check mode
      if (options.check) {
        const stats = _countStats(parsedData);

        _showMessage(`File found: ${file}`, 'success');
        _showMessage('File readable: yes', 'success');
        _showMessage(`Parsed successfully: ${stats.sections} sections, ${stats.keys} keys`, 'success');
        process.exit(0);
      }

      // 5. Format JSON with pretty-print
      const formattedJSON = _formatJSON(parsedData);

      // 6. Handle --output flag with Guard Clause
      if (options.output) {
        _writeFile(options.output, formattedJSON);

        // Guard: Skip stdout if --quiet is enabled
        if (options.quiet) {
          return;
        }
      }

      // Default: always print to stdout
      console.log(formattedJSON);

    } catch (error) {
      // Error handling with colored messages
      _showMessage(error.message, 'error');
      process.exit(1);
    }
  });

  // Parse command-line arguments with custom error handling using Strategy Pattern
  try {
    program.parse(argv);
  } catch (error) {
    // Strategy Pattern: Map Commander error codes to handlers
    const errorHandlers = {
      'commander.version': () => {
        // --version was called - this should exit 0 (success)
        process.exit(0);
      },

      'commander.helpDisplayed': () => {
        // --help was called (always uses helpDisplayed code)
        // Check if help was triggered by --help flag (exit 0) or by an error (exit 2)
        // If message is just "(outputHelp)", it was --help flag
        if (error.message === '(outputHelp)') {
          process.exit(0);
        }
        // Help shown due to error
        process.exit(2);
      }
    };

    // Guard: Check if we have a specific handler for this error code
    const handler = errorHandlers[error.code];
    if (handler) {
      handler();
      return;
    }

    // Default handler: Argument/parsing errors should exit 2
    // Remove "error: " prefix from Commander's error messages
    const cleanMessage = error.message.replace(/^error:\s*/i, '');
    _showMessage(cleanMessage, 'error');
    process.exit(2);
  }
}

// Export the main CLI function
module.exports = { runCli };
