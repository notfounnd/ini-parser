# CLI Reference

Complete command-line interface documentation for `@notfounnd/ini-parser` - a professional INI file parser for Node.js.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
   - [Global Installation](#global-installation)
   - [Local Installation](#local-installation)
3. [Synopsis](#synopsis)
4. [Arguments](#arguments)
5. [Options](#options)
   - [--output / -o](#--output---o)
   - [--meta](#--meta)
   - [--quiet / -q](#--quiet---q)
   - [--check](#--check)
   - [--version / -v](#--version---v)
   - [--help / -h](#--help---h)
6. [Advanced Example](#advanced-example)
7. [Exit Codes](#exit-codes)
8. [Error Messages and Solutions](#error-messages-and-solutions)
   - [Common Error Messages](#common-error-messages)
   - [Troubleshooting Guide](#troubleshooting-guide)
9. [See Also](#see-also)

---

## Introduction

The `@notfounnd/ini-parser` CLI provides a command-line interface for parsing INI configuration files into JSON format. It offers a simple, fast way to convert INI files to structured JSON data directly from your terminal.

**What it does:**
- Parses INI files into JSON format
- Validates INI file syntax and structure
- Outputs results to stdout or saves to file
- Supports both simplified and metadata output formats
- Provides colored output for better readability

**What it doesn't do:**
- Convert JSON back to INI format
- Modify or edit INI files
- Merge multiple INI files

---

## Installation

### Global Installation

Install the CLI globally to use the `ini-parser` command from anywhere:

```bash
npm install -g @notfounnd/ini-parser
```

Or install directly from GitHub (since the package is not yet published on NPM):

```bash
npm install -g github:notfounnd/ini-parser
```

After global installation, the `ini-parser` command will be available system-wide:

```bash
ini-parser --version
```

### Local Installation

Install as a project dependency and use via npm scripts or npx:

```bash
npm install @notfounnd/ini-parser
```

Then use with `npx`:

```bash
npx ini-parser config.ini
```

Or add to your `package.json` scripts:

```json
{
  "scripts": {
    "parse-config": "ini-parser config.ini --output config.json"
  }
}
```

---

## Synopsis

```bash
ini-parser <file> [options]
```

**General usage:**
- Parse and output to stdout: `ini-parser <file>`
- Save to file: `ini-parser <file> --output <output-file>`
- Validate file: `ini-parser <file> --check`
- Show version: `ini-parser --version`
- Show help: `ini-parser --help`

---

## Arguments

### `<file>`

**Required.** Path to the INI file to parse.

**Type:** `string`

**Description:**
- Can be a relative or absolute path
- File must exist and be readable
- Supports any file extension (`.ini`, `.config`, `.properties`, etc.)

**Examples:**

```bash
# Relative path
ini-parser config.ini

# Absolute path (Windows)
ini-parser C:\projects\app\config.ini

# Absolute path (Unix/Linux)
ini-parser /etc/app/config.ini

# Different file extensions
ini-parser app.config
ini-parser database.properties
```

---

## Options

### `--output <file>` / `-o <file>`

Save the parsed JSON output to a file.

**Syntax:**
```bash
ini-parser <file> --output <output-file>
ini-parser <file> -o <output-file>
```

**Description:**
- Writes formatted JSON to the specified file
- Creates the file if it doesn't exist
- Overwrites the file if it already exists
- Output is still displayed to stdout (unless `--quiet` is used)
- Uses UTF-8 encoding

**Example:**

```bash
ini-parser config.ini --output result.json
```

**Input file (config.ini):**
```ini
[database]
host=localhost
port=5432
```

**Output file (result.json):**
```json
{
  "database": {
    "host": ["localhost"],
    "port": ["5432"]
  }
}
```

**Expected terminal output:**
```json
{
  "database": {
    "host": ["localhost"],
    "port": ["5432"]
  }
}
```

### `--meta`

Return metadata format with type information.

**Syntax:**
```bash
ini-parser <file> --meta
```

**Description:**
- Returns an object with type information for each entry
- Distinguishes between sections and configuration keys
- Useful for building tools that process INI structure
- Each entry includes a `type` field and a `content` field

**Example:**

```bash
ini-parser config.ini --meta
```

**Input file (config.ini):**
```ini
debug=true

[database]
host=localhost
```

**Expected output:**
```json
{
  "debug": {
    "type": "configuration",
    "content": ["true"]
  },
  "database": {
    "type": "section",
    "content": {
      "host": {
        "type": "configuration",
        "content": ["localhost"]
      }
    }
  }
}
```

**Type values:**
- `"configuration"`: Global keys or keys within sections
- `"section"`: Section entries

### `--quiet` / `-q`

Suppress stdout output when saving to file.

**Syntax:**
```bash
ini-parser <file> --output <output-file> --quiet
ini-parser <file> -o <output-file> -q
```

**Description:**
- Only works when combined with `--output`
- Suppresses all stdout output
- File is still written normally
- Useful for scripts and automation

**Example:**

```bash
ini-parser config.ini --output result.json --quiet
```

**Expected terminal output:**
```
(no output)
```

**Note:** The file `result.json` is still created with the parsed content.

**Without `--quiet`:**
```bash
ini-parser config.ini --output result.json
```

**Expected terminal output:**
```json
{
  "database": {
    "host": ["localhost"],
    "port": ["5432"]
  }
}
```

### `--check`

Check INI file and display statistics without full output.

**Syntax:**
```bash
ini-parser <file> --check
```

**Description:**
- Validates that the file exists and is readable
- Parses the file and counts sections and keys
- Displays success messages with statistics
- Does not output the full parsed JSON
- Exits with code 0 on success, 1 on error

**Example:**

```bash
ini-parser config.ini --check
```

**Input file (config.ini):**
```ini
[database]
host=localhost
port=5432

[server]
host=0.0.0.0
port=8080
```

**Expected output:**
```
[ SUCCESS ] File found: config.ini
[ SUCCESS ] File readable: yes
[ SUCCESS ] Parsed successfully: 2 sections, 4 keys
```

**Example with empty file:**

```bash
ini-parser empty.ini --check
```

**Expected output:**
```
[ SUCCESS ] File found: empty.ini
[ SUCCESS ] File readable: yes
[ SUCCESS ] Parsed successfully: 0 sections, 0 keys
```

### `--version` / `-v`

Output the current version.

**Syntax:**
```bash
ini-parser --version
ini-parser -v
```

**Description:**
- Displays the installed version of the CLI
- Exits with code 0

**Example:**

```bash
ini-parser --version
```

**Expected output:**
```
1.0.0
```

### `--help` / `-h`

Display help information.

**Syntax:**
```bash
ini-parser --help
ini-parser -h
```

**Description:**
- Shows usage information
- Lists all available options
- Displays examples
- Exits with code 0

**Example:**

```bash
ini-parser --help
```

**Expected output:**
```
Usage: ini-parser [options] <file>

Parse INI files into JSON format

Arguments:
  file                      Path to INI file (relative or absolute)

Options:
  -v, --version             Output the current version
  -o, --output <file>       Save output to JSON file
  --meta                    Return metadata format with type information
  -q, --quiet               Suppress stdout output when saving to file
  --check                   Check INI file and display statistics without full output
  -h, --help                display help for command
```

---

## Advanced Example

Here's a real-world example combining multiple flags for a typical workflow:

**Scenario:** Parse a complex configuration file with metadata format, save to file, and suppress stdout output.

```bash
ini-parser app.ini --meta --output app-config.json --quiet
```

**Input file (app.ini):**
```ini
# Application configuration
app_name=MyApp
version=1.0.0

[database]
host=localhost
port=5432
users=
    admin
    readonly
    backup

[server]
host=0.0.0.0
port=8080
allowed_origins=http://localhost:3000 http://localhost:8080
```

**Output file (app-config.json):**
```json
{
  "app_name": {
    "type": "configuration",
    "content": ["MyApp"]
  },
  "version": {
    "type": "configuration",
    "content": ["1.0.0"]
  },
  "database": {
    "type": "section",
    "content": {
      "host": {
        "type": "configuration",
        "content": ["localhost"]
      },
      "port": {
        "type": "configuration",
        "content": ["5432"]
      },
      "users": {
        "type": "configuration",
        "content": ["admin", "readonly", "backup"]
      }
    }
  },
  "server": {
    "type": "section",
    "content": {
      "host": {
        "type": "configuration",
        "content": ["0.0.0.0"]
      },
      "port": {
        "type": "configuration",
        "content": ["8080"]
      },
      "allowed_origins": {
        "type": "configuration",
        "content": ["http://localhost:3000", "http://localhost:8080"]
      }
    }
  }
}
```

**Terminal output:**
```
(no output due to --quiet flag)
```

**Benefits of this combination:**
- `--meta`: Preserves type information for later processing
- `--output`: Saves result to file for use by other tools
- `--quiet`: Clean output for use in scripts or CI/CD pipelines

---

## Exit Codes

The CLI uses standard exit codes to indicate success or failure:

### Exit Code 0: Success

**Description:**
- Command completed successfully
- File was parsed without errors
- Validation passed (with `--check`)

**Examples:**
```bash
ini-parser config.ini
# Exit code: 0 (if successful)

ini-parser config.ini --check
# Exit code: 0 (if valid)

ini-parser --version
# Exit code: 0

ini-parser --help
# Exit code: 0
```

### Exit Code 1: File Errors

**Description:**
- File not found
- File not readable
- File parsing errors (though parser is resilient)

**Examples:**
```bash
ini-parser nonexistent.ini
# Exit code: 1
# Error: File not found or not readable: nonexistent.ini

ini-parser /path/to/unreadable.ini
# Exit code: 1
# Error: File not found or not readable: /path/to/unreadable.ini
```

### Exit Code 2: Argument Errors

**Description:**
- Missing required file argument
- Invalid command-line options
- Unknown flags

**Examples:**
```bash
ini-parser
# Exit code: 2
# Error: missing required argument 'file'

ini-parser config.ini --unknown-flag
# Exit code: 2
# Error: unknown option '--unknown-flag'

ini-parser --invalid-option
# Exit code: 2
# Error: unknown option '--invalid-option'
```

**Using exit codes in scripts:**

```bash
#!/bin/bash

ini-parser config.ini --check

if [ $? -eq 0 ]; then
  echo "Configuration is valid"
  ini-parser config.ini --output config.json
else
  echo "Configuration is invalid"
  exit 1
fi
```

---

## Error Messages and Solutions

### Common Error Messages

#### 1. File not found or not readable

**Error message:**
```
[  ERROR  ] File not found or not readable: config.ini
```

**Causes:**
- File does not exist at the specified path
- Incorrect file path (typo or wrong directory)
- File exists but has no read permissions

**Solutions:**
- Verify the file exists: `ls config.ini` (Unix) or `dir config.ini` (Windows)
- Check the file path is correct
- Use absolute path if relative path is not working
- Verify file permissions: `ls -l config.ini` (Unix)
- Grant read permissions: `chmod +r config.ini` (Unix)

**Example:**
```bash
# Check if file exists
ls config.ini

# Use absolute path
ini-parser /full/path/to/config.ini

# Check permissions (Unix/Linux)
ls -l config.ini
# Should show: -rw-r--r-- or similar with 'r' in user permissions
```

#### 2. Missing required argument 'file'

**Error message:**
```
[  ERROR  ] missing required argument 'file'
```

**Causes:**
- No file argument provided
- Command run with only flags

**Solutions:**
- Always provide a file path as the first argument
- File argument is required even with other flags

**Example:**
```bash
# Incorrect
ini-parser --check

# Correct
ini-parser config.ini --check
```

#### 3. Unknown option

**Error message:**
```
[  ERROR  ] unknown option '--invalid-flag'
```

**Causes:**
- Typo in option name
- Using an option that doesn't exist
- Wrong flag syntax

**Solutions:**
- Check spelling of the option
- Use `--help` to see available options
- Verify option syntax (single dash for short, double dash for long)

**Example:**
```bash
# Incorrect
ini-parser config.ini --quite  # typo

# Correct
ini-parser config.ini --quiet

# Get help
ini-parser --help
```

#### 4. Cannot write to file

**Error message:**
```
[  ERROR  ] Cannot write to file: output.json
```

**Causes:**
- No write permissions in target directory
- Directory does not exist
- Disk is full
- File is locked by another process

**Solutions:**
- Verify directory exists: `ls -d output/` (Unix) or `dir output\` (Windows)
- Create directory if needed: `mkdir -p output/` (Unix) or `md output\` (Windows)
- Check write permissions for directory
- Ensure sufficient disk space
- Close any programs that may have the file open

**Example:**
```bash
# Create output directory
mkdir -p output/

# Verify directory exists
ls -d output/

# Try again
ini-parser config.ini --output output/result.json
```

### Troubleshooting Guide

#### Problem: CLI command not found

```bash
ini-parser: command not found
```

**Solutions:**

1. **If installed globally:**
   - Verify installation: `npm list -g @notfounnd/ini-parser`
   - Reinstall: `npm install -g @notfounnd/ini-parser`
   - Check npm global bin path is in PATH: `npm config get prefix`

2. **If installed locally:**
   - Use npx: `npx ini-parser config.ini`
   - Or use via npm script in `package.json`

#### Problem: Parsing produces unexpected results

**Symptoms:**
- Values are split incorrectly
- Comments are included in values
- Multi-line values not recognized

**Solutions:**

1. **Check INI file syntax:**
   - Use `--check` to validate: `ini-parser config.ini --check`
   - Review parsing rules in [Parser Rules](./PARSER_RULES.md)

2. **Common syntax issues:**
   - Values with spaces are automatically split (use indented multi-line for paths)
   - Semicolons (`;`) in values are treated as comments
   - Indented lines must use spaces or tabs consistently

3. **Test with simplified content:**
   - Create a minimal test file
   - Add complexity incrementally
   - Identify which line causes issues

**Example debugging process:**
```bash
# 1. Check file is valid
ini-parser config.ini --check

# 2. Parse and review output
ini-parser config.ini

# 3. Try with metadata to see structure
ini-parser config.ini --meta

# 4. Save to file for detailed inspection
ini-parser config.ini --output debug.json
```

#### Problem: Permission denied errors

**Unix/Linux:**
```bash
# Check current permissions
ls -l config.ini

# Add read permission
chmod +r config.ini

# For output directory
chmod +w output/
```

**Windows:**
```powershell
# Check file properties
Get-Acl config.ini | Format-List

# Run as administrator if needed
# Right-click terminal and select "Run as administrator"
```

#### Problem: Output file is empty or corrupted

**Solutions:**

1. **Verify input file is valid:**
   ```bash
   cat config.ini  # Unix
   type config.ini  # Windows
   ```

2. **Check file encoding:**
   - Ensure input file is UTF-8 encoded
   - Some encodings may cause parsing issues

3. **Test with minimal file:**
   ```bash
   echo "[test]" > test.ini
   echo "key=value" >> test.ini
   ini-parser test.ini
   ```

4. **Use `--check` to validate:**
   ```bash
   ini-parser config.ini --check
   ```

#### Problem: Colors not showing in terminal

**Causes:**
- Terminal doesn't support colors
- Running in environment without TTY

**Solutions:**
- Use a modern terminal (supports ANSI colors)
- On Windows: Use Windows Terminal, PowerShell, or Git Bash
- Colors are automatically disabled in non-TTY environments (this is normal behavior for logs/files)

---

## See Also

- **[API Reference](./API.md)** - Complete API documentation for using the parser programmatically.
- **[Parser Rules](./PARSER_RULES.md)** - Detailed documentation on how the parser interprets INI files.

---

**Made with ❤️ by Júnior Sbrissa | Errør 404 | NotFounnd**
