// test/lib/parser.test.js

const fs = require('fs');
const path = require('path');
const { parse } = require('../../src/lib/parser.js');

/**
 * Helper function to read fixture files
 * @param {string} filename - The fixture file name
 * @returns {string} The file content
 */
function readFixture(filename) {
  const fixturePath = path.join(__dirname, '..', '__fixtures__', filename);
  return fs.readFileSync(fixturePath, 'utf8');
}

describe('parse', () => {
  describe('with valid fixtures', () => {
    describe('valid-simple.ini', () => {
      test('should parse basic sections and key-value pairs (simplified format)', () => {
        const content = readFixture('valid-simple.ini');
        const result = parse(content);

        expect(result).toEqual({
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

      test('should parse basic sections and key-value pairs (meta format)', () => {
        const content = readFixture('valid-simple.ini');
        const result = parse(content, { meta: true });

        expect(result).toEqual({
          app: {
            type: 'section',
            content: {
              name: {
                type: 'configuration',
                content: ['TestApp']
              },
              version: {
                type: 'configuration',
                content: ['1.0']
              }
            }
          },
          database: {
            type: 'section',
            content: {
              host: {
                type: 'configuration',
                content: ['localhost']
              },
              port: {
                type: 'configuration',
                content: ['3306']
              }
            }
          },
          settings: {
            type: 'section',
            content: {
              debug: {
                type: 'configuration',
                content: ['false']
              }
            }
          }
        });
      });
    });

    describe('valid-multiline.ini', () => {
      test('should parse multi-line indented values correctly', () => {
        const content = readFixture('valid-multiline.ini');
        const result = parse(content);

        expect(result).toEqual({
          pytest: {
            pythonpath: ['.', 'src', 'tests'],
            addopts: ['-rA', '--no-header', '--cov=package', '--cov-config=.coveragerc', '--cov-context=test', '--cov-report=term', '--junit-xml=coverage/junit.xml'],
            testpaths: ['tests', 'integration']
          },
          deployment: {
            servers: ['prod1', 'prod2', 'prod3', 'staging1'],
            connection_params: ['timeout=30', 'retry=3', 'pool_size=10']
          }
        });
      });

      test('should handle values with equals sign in multi-line context', () => {
        const content = readFixture('valid-multiline.ini');
        const result = parse(content);

        // Verify that values like --cov-config=.coveragerc are preserved
        expect(result.pytest.addopts).toContain('--cov-config=.coveragerc');
        expect(result.pytest.addopts).toContain('--cov=package');
      });
    });

    describe('valid-global-keys.ini', () => {
      test('should parse global keys (keys outside of sections)', () => {
        const content = readFixture('valid-global-keys.ini');
        const result = parse(content);

        expect(result).toEqual({
          app_name: ['GlobalKeysTest'],
          version: ['2.5.1'],
          author: ['Test', 'Author'],
          debug: ['true'],
          log_level: ['info'],
          root_dir: ['/var/app'],
          data_dir: ['/var/app/data'],
          allowed_hosts: ['localhost', '127.0.0.1', 'example.com']
        });
      });

      test('should parse global keys with meta format', () => {
        const content = readFixture('valid-global-keys.ini');
        const result = parse(content, { meta: true });

        expect(result.app_name).toEqual({
          type: 'configuration',
          content: ['GlobalKeysTest']
        });

        expect(result.version).toEqual({
          type: 'configuration',
          content: ['2.5.1']
        });

        expect(result.author).toEqual({
          type: 'configuration',
          content: ['Test', 'Author']
        });

        expect(result.debug).toEqual({
          type: 'configuration',
          content: ['true']
        });
      });
    });

    describe('valid-complete.ini', () => {
      test('should parse complete INI file with all features', () => {
        const content = readFixture('valid-complete.ini');
        const result = parse(content);

        // Verify global keys
        expect(result.app_name).toEqual(['MyApplication']);
        expect(result.version).toEqual(['1.0.0']);
        expect(result.debug).toEqual(['true']);

        // Verify database section
        expect(result.database).toBeDefined();
        expect(result.database.host).toEqual(['localhost']);
        expect(result.database.port).toEqual(['5432']);
        expect(result.database.connection_timeout).toEqual(['30']);
        expect(result.database.username).toEqual(['admin']);

        // Verify server section
        expect(result.server).toBeDefined();
        expect(result.server.address).toEqual(['0.0.0.0']);
        expect(result.server.port).toEqual(['8080']);
        expect(result.server.enabled).toEqual(['true']);

        // Verify features section with multi-line values
        expect(result.features).toBeDefined();
        expect(result.features.modules).toEqual(['auth', 'logging', 'api', 'database']);
        expect(result.features.tags).toEqual(['production', 'stable', 'v1.0']);

        // Verify logging section
        expect(result.logging).toBeDefined();
        expect(result.logging.level).toEqual(['info']);
        expect(result.logging.format).toEqual(['json']);
        expect(result.logging.output).toEqual(['stdout']);

        // Verify cache section
        expect(result.cache).toBeDefined();
        expect(result.cache.enabled).toEqual(['false']);
      });

      test('should ignore comments correctly (# and ;)', () => {
        const content = readFixture('valid-complete.ini');
        const result = parse(content);

        // Comments should not appear in the result
        const allValues = JSON.stringify(result);
        expect(allValues).not.toContain('Global configuration');
        expect(allValues).not.toContain('default PostgreSQL port');
        expect(allValues).not.toContain('comment');
      });
    });

    describe('valid-simple.config', () => {
      test('should parse .config files correctly', () => {
        const content = readFixture('valid-simple.config');
        const result = parse(content);

        expect(result).toEqual({
          app_name: ['test-application'],
          environment: ['development'],
          debug: ['true'],
          port: ['3000'],
          host: ['0.0.0.0']
        });
      });
    });

    describe('valid-simple.properties', () => {
      test('should parse .properties files (with space splitting)', () => {
        const content = readFixture('valid-simple.properties');
        const result = parse(content);

        // All properties are global keys (no sections in .properties files)
        expect(result['sonar.projectKey']).toEqual(['test-project']);

        // Note: "Test Project" is split into ["Test", "Project"] due to post-processing
        expect(result['sonar.projectName']).toEqual(['Test', 'Project']);
        expect(result['sonar.sourceEncoding']).toEqual(['UTF-8']);
        expect(result['sonar.sources']).toEqual(['src']);
        expect(result['sonar.tests']).toEqual(['test']);
        expect(result['sonar.test.inclusions']).toEqual(['**/*.test.js']);
        expect(result['sonar.javascript.lcov.reportPaths']).toEqual(['./coverage/lcov.info']);
        expect(result['sonar.coverage.exclusions']).toEqual(['**/*.test.js,**/node_modules/**']);
      });
    });

    describe('edge-cases.ini', () => {
      test('should handle empty sections', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.empty_section).toEqual({});
        expect(result.comments_only).toEqual({});
      });

      test('should handle special characters in values', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.special_chars).toBeDefined();
        expect(result.special_chars.path).toEqual(['C:\\Program', 'Files\\App']);
        expect(result.special_chars.url).toEqual(['https://example.com/path?param=value']);
        expect(result.special_chars.equation).toEqual(['x=y+z']);
      });

      test('should handle keys with no values followed by unindented values', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.unindented_values).toBeDefined();
        expect(result.unindented_values.key_no_initial_value).toEqual(['value1', 'value2', 'value3']);
      });

      test('should handle single key sections', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.single_key).toBeDefined();
        expect(result.single_key.lonely).toEqual(['value']);
      });

      test('should handle keys with empty values', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.empty_values).toBeDefined();
        expect(result.empty_values.key_with_no_value).toEqual([]);
        expect(result.empty_values.another_empty).toEqual([]);
      });

      test('should handle mixed indented and unindented values', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.mixed).toBeDefined();
        expect(result.mixed.first).toEqual(['initial']);
        expect(result.mixed.second).toEqual(['indented1', 'indented2']);
        expect(result.mixed.third).toEqual(['another']);
      });

      test('should handle multiline values that look like key=value', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.multiline_with_equals).toBeDefined();
        expect(result.multiline_with_equals.params).toEqual(['first', 'key_like=value_like', 'another=one']);
      });

      test('should handle consecutive sections', () => {
        const content = readFixture('edge-cases.ini');
        const result = parse(content);

        expect(result.first).toBeDefined();
        expect(result.first.key).toEqual(['value1']);
        expect(result.second).toBeDefined();
        expect(result.second.key).toEqual(['value2']);
      });
    });

    describe('empty.ini', () => {
      test('should return empty object for empty file', () => {
        const content = readFixture('empty.ini');
        const result = parse(content);

        expect(result).toEqual({});
      });
    });
  });

  describe('with invalid inputs', () => {
    test('should return empty object for null input', () => {
      const result = parse(null);
      expect(result).toEqual({});
    });

    test('should return empty object for undefined input', () => {
      const result = parse(undefined);
      expect(result).toEqual({});
    });

    test('should return empty object for non-string input (number)', () => {
      const result = parse(12345);
      expect(result).toEqual({});
    });

    test('should return empty object for non-string input (object)', () => {
      const result = parse({ key: 'value' });
      expect(result).toEqual({});
    });

    test('should return empty object for non-string input (array)', () => {
      const result = parse(['item1', 'item2']);
      expect(result).toEqual({});
    });

    test('should return empty object for empty string', () => {
      const result = parse('');
      expect(result).toEqual({});
    });
  });

  describe('with edge case content', () => {
    test('should handle global key with indented values', () => {
      const content = 'global_key=\n    value1\n    value2';
      const result = parse(content);
      expect(result).toEqual({
        global_key: ['value1', 'value2']
      });
    });

    test('should handle global key with unindented values after empty key', () => {
      const content = 'global_key=\nvalue1\nvalue2';
      const result = parse(content);
      expect(result).toEqual({
        global_key: ['value1', 'value2']
      });
    });

    test('should handle global key with initial value and indented continuation', () => {
      const content = 'global_key=initial\n    value1\n    value2';
      const result = parse(content);
      expect(result).toEqual({
        global_key: ['initial', 'value1', 'value2']
      });
    });

    test('should skip lines without section when not key=value', () => {
      const content = 'invalid_line_no_equals\nvalid_key=value';
      const result = parse(content);
      expect(result).toEqual({
        valid_key: ['value']
      });
    });

    test('should handle file with only comments', () => {
      const content = '# This is a comment\n; Another comment\n# Yet another';
      const result = parse(content);
      expect(result).toEqual({});
    });

    test('should handle file with only empty lines', () => {
      const content = '\n\n\n   \n\t\n';
      const result = parse(content);
      expect(result).toEqual({});
    });

    test('should handle file with only whitespace', () => {
      const content = '     \t\t   \n   ';
      const result = parse(content);
      expect(result).toEqual({});
    });

    test('should remove inline comments from values (# character)', () => {
      const content = 'key=value # this is a comment';
      const result = parse(content);
      expect(result).toEqual({
        key: ['value']
      });
    });

    test('should remove inline comments from values (; character)', () => {
      const content = 'key=value ; this is also a comment';
      const result = parse(content);
      expect(result).toEqual({
        key: ['value']
      });
    });

    test('should truncate values at semicolon (even in connection strings)', () => {
      const content = 'connection_string=server=localhost;database=test';
      const result = parse(content);
      expect(result).toEqual({
        connection_string: ['server=localhost']
      });
    });

    test('should split values with spaces into separate array items', () => {
      const content = 'tags=production stable v1.0';
      const result = parse(content);
      expect(result).toEqual({
        tags: ['production', 'stable', 'v1.0']
      });
    });

    test('should split values with spaces even if they contain equals signs', () => {
      const content = 'params=timeout=30 retry=3';
      const result = parse(content);
      expect(result).toEqual({
        params: ['timeout=30', 'retry=3']
      });
    });

    test('should handle mixed indented and non-indented multi-line values', () => {
      const content = '[section]\nkey=value1\n    value2\n    value3';
      const result = parse(content);
      expect(result).toEqual({
        section: {
          key: ['value1', 'value2', 'value3']
        }
      });
    });

    test('should ignore lines without equals sign (not in indented context)', () => {
      const content = '[section]\ninvalid_line_without_equals\nkey=value';
      const result = parse(content);
      expect(result).toEqual({
        section: {
          key: ['value']
        }
      });
    });
  });

  describe('meta option', () => {
    test('should return simplified format when meta is false (default)', () => {
      const content = '[section]\nkey=value';
      const result = parse(content);

      expect(result).toEqual({
        section: {
          key: ['value']
        }
      });

      // Should NOT have type/content structure
      expect(result.section.type).toBeUndefined();
      expect(result.section.content).toBeUndefined();
    });

    test('should return simplified format when meta is explicitly false', () => {
      const content = '[section]\nkey=value';
      const result = parse(content, { meta: false });

      expect(result).toEqual({
        section: {
          key: ['value']
        }
      });
    });

    test('should return metadata format when meta is true', () => {
      const content = '[section]\nkey=value';
      const result = parse(content, { meta: true });

      expect(result).toEqual({
        section: {
          type: 'section',
          content: {
            key: {
              type: 'configuration',
              content: ['value']
            }
          }
        }
      });
    });

    test('should return metadata format for global keys when meta is true', () => {
      const content = 'global_key=global_value';
      const result = parse(content, { meta: true });

      expect(result).toEqual({
        global_key: {
          type: 'configuration',
          content: ['global_value']
        }
      });
    });
  });
});
