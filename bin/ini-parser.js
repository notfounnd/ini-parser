#!/usr/bin/env node

/**
 * INI Parser CLI Entry Point
 *
 * This is the executable entry point for the INI parser command-line tool.
 * It serves as a minimal wrapper that invokes the main CLI implementation.
 *
 * All CLI logic, argument parsing, and business rules are handled by the
 * runCli function in src/cli/index.js. This file simply:
 * - Imports the CLI runner
 * - Passes process.argv to it
 * - Allows the CLI to handle all exits and errors
 *
 * @file bin/ini-parser.js
 * @module bin
 */

const { runCli } = require('../src/cli/index.js');

// Execute CLI with command-line arguments
runCli(process.argv);
