// test/cli/index.test.js

const fs = require('fs');
const path = require('path');

/**
 * Helper function to get fixture file path
 * @param {string} filename - The fixture file name
 * @returns {string} The absolute fixture path
 */
function getFixturePath(filename) {
  return path.join(__dirname, '..', '__fixtures__', filename);
}

/**
 * Helper function to create temporary output file path
 * @param {string} filename - The output file name
 * @returns {string} The absolute output path
 */
function getTempOutputPath(filename) {
  return path.join(__dirname, '..', '..', 'temp', filename);
}

/**
 * Helper function to clean up temporary files
 * @param {string} filePath - Path to file to delete
 */
function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Helper to get a fresh runCli instance
 * Clears cache and requires the module fresh to avoid Commander state issues
 * @returns {Function} Fresh runCli function
 */
function getFreshRunCli() {
  // Clear the module from cache
  delete require.cache[require.resolve('../../src/cli/index.js')];
  delete require.cache[require.resolve('commander')];

  const { runCli } = require('../../src/cli/index.js');
  return runCli;
}

describe('runCli', () => {
  // Mock spies
  let consoleLogSpy;
  let processExitSpy;
  let writeFileSyncSpy;

  beforeEach(() => {
    // Mock console.log to capture output
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Mock process.exit to prevent test termination
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    // Mock fs.writeFileSync to track file writes
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Restore all mocks
    consoleLogSpy.mockRestore();
    processExitSpy.mockRestore();
    writeFileSyncSpy.mockRestore();

    // Clean up temp files
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        cleanupFile(path.join(tempDir, file));
      });
    }
  });

  describe('basic parsing', () => {
    test('should parse INI file and output to stdout', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toEqual({
        app: {
          name: ['TestApp'],
          version: ['1.0']
        },
        database: {
          host: ['localhost'],
          port: ['3306']
        },
        settings: {
          debug: ['false']
        }
      });
    });

    test('should parse complete INI file with global keys and sections', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-complete.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // Validate structure contains global keys and sections
      expect(parsed).toHaveProperty('app_name');
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('debug');
      expect(parsed).toHaveProperty('database');
      expect(parsed).toHaveProperty('server');
    });

    test('should parse INI file with only global keys', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-global-keys.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // Should contain global keys only (no sections)
      expect(parsed).toHaveProperty('app_name');
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('author');
      expect(parsed.app_name).toBeDefined();
    });

    test('should parse INI file with multiline values', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-multiline.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toHaveProperty('pytest');
      expect(parsed).toHaveProperty('deployment');
      expect(Array.isArray(parsed.pytest.pythonpath)).toBe(true);
    });

    test('should handle empty INI file', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('empty.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toEqual({});
    });

    test('should parse edge cases correctly', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('edge-cases.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // Should handle edge cases without errors
      expect(parsed).toBeDefined();
      expect(typeof parsed).toBe('object');
    });

    test('should parse .config files', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.config');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed).toHaveProperty('app_name');
      expect(parsed).toHaveProperty('environment');
      expect(parsed).toHaveProperty('debug');
    });

    test('should parse .properties files', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.properties');
      runCli(['node', 'ini-parser', fixturePath]);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // Properties with dots in the key name are preserved
      expect(parsed['sonar.projectKey']).toEqual(['test-project']);
      expect(parsed['sonar.projectName']).toEqual(['Test', 'Project']); // Split by spaces
      expect(parsed['sonar.sourceEncoding']).toEqual(['UTF-8']);
    });
  });

  describe('--output flag', () => {
    test('should write parsed output to file and display to stdout', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      const outputPath = getTempOutputPath('output-test.json');

      runCli(['node', 'ini-parser', fixturePath, '--output', outputPath]);

      // Should write to file
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        outputPath,
        expect.any(String),
        'utf8'
      );

      // Should also display to stdout
      expect(consoleLogSpy).toHaveBeenCalled();
      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      const parsed = JSON.parse(writtenContent);

      expect(parsed).toEqual({
        app: {
          name: ['TestApp'],
          version: ['1.0']
        },
        database: {
          host: ['localhost'],
          port: ['3306']
        },
        settings: {
          debug: ['false']
        }
      });
    });

    test('should write complete file with global keys to output', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-complete.ini');
      const outputPath = getTempOutputPath('complete-output.json');

      runCli(['node', 'ini-parser', fixturePath, '-o', outputPath]);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      const parsed = JSON.parse(writtenContent);

      // Validate rich content
      expect(parsed).toHaveProperty('app_name');
      expect(parsed).toHaveProperty('database');
      expect(parsed).toHaveProperty('server');
    });
  });

  describe('--meta flag', () => {
    test('should return metadata format with type information', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      runCli(['node', 'ini-parser', fixturePath, '--meta']);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // Meta format should have 'type' and 'content' properties
      expect(parsed.app).toHaveProperty('type', 'section');
      expect(parsed.app).toHaveProperty('content');
      expect(parsed.app.content.name).toHaveProperty('type', 'configuration');
      expect(parsed.app.content.name).toHaveProperty('content', ['TestApp']);
    });

    test('should include metadata for file with global keys and sections', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-complete.ini');
      runCli(['node', 'ini-parser', fixturePath, '--meta']);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // Global keys should have configuration type
      expect(parsed.app_name).toHaveProperty('type', 'configuration');

      // Sections should have section type
      expect(parsed.database).toHaveProperty('type', 'section');
      expect(parsed.server).toHaveProperty('type', 'section');
    });

    test('should handle metadata format for global keys only', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-global-keys.ini');
      runCli(['node', 'ini-parser', fixturePath, '--meta']);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      // All entries should be configuration type (no sections)
      expect(parsed.app_name).toHaveProperty('type', 'configuration');
      expect(parsed.version).toHaveProperty('type', 'configuration');
    });
  });

  describe('--quiet flag', () => {
    test('should suppress stdout output when used with --output', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      const outputPath = getTempOutputPath('quiet-output.json');

      runCli(['node', 'ini-parser', fixturePath, '--output', outputPath, '-q']);

      // Should write to file
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);

      // Should NOT display to stdout
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    test('should suppress stdout with --output and --meta combination', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-complete.ini');
      const outputPath = getTempOutputPath('quiet-meta-output.json');

      runCli(['node', 'ini-parser', fixturePath, '-o', outputPath, '--meta', '--quiet']);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).not.toHaveBeenCalled();

      // Verify meta format was written
      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      const parsed = JSON.parse(writtenContent);
      expect(parsed.database).toHaveProperty('type', 'section');
    });
  });

  describe('--check flag', () => {
    test('should display file statistics without full output', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-complete.ini');
      runCli(['node', 'ini-parser', fixturePath, '--check']);

      // Should display success messages with statistics
      expect(consoleLogSpy).toHaveBeenCalled();

      // Verify success messages were logged
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('SUCCESS');
      expect(allOutput).toContain('File found');
      expect(allOutput).toContain('File readable');
      expect(allOutput).toContain('Parsed successfully');
      expect(allOutput).toContain('sections');
      expect(allOutput).toContain('keys');

      // Should exit with code 0
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    test('should show correct statistics for simple file', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      runCli(['node', 'ini-parser', fixturePath, '--check']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      // valid-simple.ini has 3 sections, 5 keys total (app: 2, database: 2, settings: 1)
      expect(allOutput).toContain('3 sections');
      expect(allOutput).toContain('5 keys');
    });

    test('should show statistics for global keys only file', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-global-keys.ini');
      runCli(['node', 'ini-parser', fixturePath, '--check']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      // Should show 0 sections (all global keys)
      expect(allOutput).toContain('0 sections');
    });

    test('should show statistics for empty file', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('empty.ini');
      runCli(['node', 'ini-parser', fixturePath, '--check']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('0 sections');
      expect(allOutput).toContain('0 keys');
    });
  });

  describe('flag combinations', () => {
    test('should handle --output and --meta together', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-complete.ini');
      const outputPath = getTempOutputPath('meta-output.json');

      runCli(['node', 'ini-parser', fixturePath, '--output', outputPath, '--meta']);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      const parsed = JSON.parse(writtenContent);

      // Verify meta format
      expect(parsed.database).toHaveProperty('type', 'section');
      expect(parsed.app_name).toHaveProperty('type', 'configuration');

      // Should also display to stdout
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    test('should handle short flags -o and -q together', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      const outputPath = getTempOutputPath('short-flags.json');

      runCli(['node', 'ini-parser', fixturePath, '-o', outputPath, '-q']);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    test('should handle multiple flags --output --meta --quiet', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-multiline.ini');
      const outputPath = getTempOutputPath('multi-flags.json');

      runCli(['node', 'ini-parser', fixturePath, '-o', outputPath, '--meta', '-q']);

      expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).not.toHaveBeenCalled();

      const writtenContent = writeFileSyncSpy.mock.calls[0][1];
      const parsed = JSON.parse(writtenContent);
      expect(parsed.pytest).toHaveProperty('type', 'section');
    });
  });

  describe('error handling', () => {
    test('should exit with code 1 when file not found', () => {
      const runCli = getFreshRunCli();
      const nonexistentPath = getFixturePath('nonexistent.ini');
      runCli(['node', 'ini-parser', nonexistentPath]);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('ERROR');
      expect(allOutput).toContain('File not found');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('should exit with code 2 for invalid arguments', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', '--invalid-flag']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('ERROR');
      expect(processExitSpy).toHaveBeenCalledWith(2);
    });

    test('should exit with code 2 for missing required file argument', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('ERROR');
      expect(processExitSpy).toHaveBeenCalledWith(2);
    });

    test('should exit with code 2 for unknown option', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      runCli(['node', 'ini-parser', fixturePath, '--unknown-option']);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('ERROR');
      expect(processExitSpy).toHaveBeenCalledWith(2);
    });

    test('should handle file path that is not readable', () => {
      const runCli = getFreshRunCli();
      // Test with a path that doesn't exist
      const invalidPath = '/path/to/invalid/file.ini';
      runCli(['node', 'ini-parser', invalidPath]);

      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls;
      const allOutput = calls.map(call => call[0]).join(' ');

      expect(allOutput).toContain('ERROR');
      expect(allOutput).toContain('not found');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('exit codes validation', () => {
    test('should exit with 0 for successful parsing', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      runCli(['node', 'ini-parser', fixturePath]);

      // Normal parsing doesn't call process.exit (successful completion)
      // Only --check or errors call process.exit
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    test('should exit with 0 for successful --check', () => {
      const runCli = getFreshRunCli();
      const fixturePath = getFixturePath('valid-simple.ini');
      runCli(['node', 'ini-parser', fixturePath, '--check']);

      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    test('should exit with 1 for file errors', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', 'nonexistent.ini']);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    test('should exit with 2 for argument errors', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', '--bad-arg']);
      expect(processExitSpy).toHaveBeenCalledWith(2);
    });
  });

  describe('version and help', () => {
    test('should display version with --version flag', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', '--version']);

      // --version triggers process.exit(0)
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    test('should display version with -v flag', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', '-v']);

      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    test('should display help with --help flag', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', '--help']);

      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    test('should display help with -h flag', () => {
      const runCli = getFreshRunCli();
      runCli(['node', 'ini-parser', '-h']);

      expect(processExitSpy).toHaveBeenCalledWith(0);
    });
  });
});
