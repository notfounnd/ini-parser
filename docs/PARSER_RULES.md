# INI Parser - Parsing Rules

This document describes how the `@notfounnd/ini-parser` interprets INI files.

---

## Table of Contents

1. [Processing Order](#processing-order)
2. [Basic Structure](#basic-structure)
   - [Sections](#sections)
   - [Global Keys](#global-keys)
   - [Key-Value Pairs](#key-value-pairs)
3. [Comments](#comments)
   - [Comment Characters](#comment-characters)
   - [Line Comments](#line-comments)
   - [Inline Comments](#inline-comments)
   - [Comments in Values](#comments-in-values)
4. [Multi-line Values](#multi-line-values)
   - [Indented Values](#indented-values)
   - [First Value on Same Line](#first-value-on-same-line)
   - [Non-indented Values After Empty Key](#non-indented-values-after-empty-key)
5. [Value Splitting](#value-splitting)
   - [Values with Spaces](#values-with-spaces)
   - [Values with Spaces and Equals Signs](#values-with-spaces-and-equals-signs)
   - [Indented Values with Equals Signs](#indented-values-with-equals-signs)
6. [Output Formats](#output-formats)
   - [Simplified Format (Default)](#simplified-format-default)
   - [Format with Metadata](#format-with-metadata)
7. [Special Cases](#special-cases)
8. [Supported File Extensions](#supported-file-extensions)
9. [Known Limitations](#known-limitations)
10. [Complete Examples](#complete-examples)

---

## Processing Order

The parser processes each line of the INI file sequentially, applying the following logic:

1. **Trim** whitespace from the line
2. **Check if empty or comment** → skip the line
3. **Check if section** (`[...]`) → initialize new section
4. **Check if global key** (no current section) → process as global key
5. **Check if indented line** → add as value to previous key
6. **Check if key-value pair** (`key=value`) → process normally
7. **Check if non-indented value** (after empty key) → add as value

---

## Basic Structure

### Sections

Sections group related configuration keys together.

**Syntax:**
- Defined by `[section_name]`
- Must be on their own line
- Section name is extracted by removing `[` and `]` and trimming whitespace
- Sections can be empty (no keys inside)

**Example:**

```ini
[database]
host=localhost

[empty_section]
```

**Output:**

```json
{
  "database": {
    "host": ["localhost"]
  },
  "empty_section": {}
}
```

### Global Keys

Keys defined **before** any section are considered global.

**Behavior:**
- Global keys don't belong to any section
- Processed identically to keys within sections
- Appear at the root level of the output

**Example:**

```ini
app_name=MyApp
version=1.0.0

[database]
host=localhost
```

**Output:**

```json
{
  "app_name": ["MyApp"],
  "version": ["1.0.0"],
  "database": {
    "host": ["localhost"]
  }
}
```

### Key-Value Pairs

**Syntax:**
- Format: `key=value`
- Spaces around `=` are allowed and will be removed (trimmed)
- Keys without `=` are ignored (unless they are indented values)

**Example:**

```ini
host=localhost
port = 5432
name  =  test
```

**Output:**

```json
{
  "host": ["localhost"],
  "port": ["5432"],
  "name": ["test"]
}
```

---

## Comments

### Comment Characters

Two characters indicate comments:
- `#` (hash)
- `;` (semicolon)

### Line Comments

Lines starting with `#` or `;` are **completely ignored**.

**Example:**

```ini
# This is a comment
; This is also a comment
[section]
key=value
```

**Output:**

```json
{
  "section": {
    "key": ["value"]
  }
}
```

### Inline Comments

Everything after `#` or `;` until the end of the line is considered a comment and **removed**.

**Example:**

```ini
host=localhost # this is the local server
port=5432 ; default PostgreSQL port
```

**Output:**

```json
{
  "host": ["localhost"],
  "port": ["5432"]
}
```

### Comments in Values

**IMPORTANT:** If `#` or `;` appears in a value, **everything after it is removed**, even if it's part of the original value.

**Example:**

```ini
connection_string=server=localhost;database=test
```

**Output:**

```json
{
  "connection_string": ["server=localhost"]
}
```

⚠️ **Warning:** This means SQL connection strings or other values using `;` as a separator will be truncated. This is standard INI specification behavior.

---

## Multi-line Values

### Indented Values

Lines starting with spaces or tabs are considered **indented values** and belong to the previous key.

**Example:**

```ini
[section]
key=
    value1
    value2
    value3
```

**Output:**

```json
{
  "section": {
    "key": ["value1", "value2", "value3"]
  }
}
```

### First Value on Same Line

The first value can be on the same line as the key, with additional indented values following.

**Example:**

```ini
servers=prod1
    prod2
    prod3
```

**Output:**

```json
{
  "servers": ["prod1", "prod2", "prod3"]
}
```

### Non-indented Values After Empty Key

If a key has no initial value (just `key=`), subsequent **non-indented** lines are treated as values until a new key or section is encountered.

**Example:**

```ini
key=
value1
value2
```

**Output:**

```json
{
  "key": ["value1", "value2"]
}
```

---

## Value Splitting

### Values with Spaces

Values containing **whitespace** (spaces, tabs, etc.) are **automatically split** into multiple values during parsing.

**Example:**

```ini
tags=production stable v1.0
```

**Output:**

```json
{
  "tags": ["production", "stable", "v1.0"]
}
```

### Values with Spaces and Equals Signs

**IMPORTANT:** Values containing spaces are split **regardless** of whether they contain `=` or not.

This ensures consistency, as the INI format doesn't support multi-word strings.

**Example:**

```ini
params=timeout=30 retry=3
```

**Output:**

```json
{
  "params": ["timeout=30", "retry=3"]
}
```

**Equivalent to:**

```ini
params=
    timeout=30
    retry=3
```

⚠️ **Notes:**
- Remember that `;` in values will be treated as a comment (see [Comments in Values](#comments-in-values))
- `.properties` files with multi-word values will be split (use a properties-specific library if you need to preserve spaces)
- Splitting occurs **during parsing**, not as a separate post-processing step

### Indented Values with Equals Signs

Indented values containing `=` are treated as **normal values**, not as new key declarations.

**Example (correct - no spaces around `=`):**

```ini
[pytest]
addopts=
    --cov-config=.coveragerc
    --cov-context=test
```

**Output:**

```json
{
  "pytest": {
    "addopts": ["--cov-config=.coveragerc", "--cov-context=test"]
  }
}
```

#### Malformed Indented Values

⚠️ **IMPORTANT:** If an indented line contains `=` **with spaces around it**, it will be automatically split during parsing (see [Values with Spaces](#values-with-spaces)).

**Example (malformed):**

```ini
key = value
    key_indented = value_indented
```

**Output:**

```json
{
  "key": ["value", "key_indented", "=", "value_indented"]
}
```

The value `"key_indented = value_indented"` contains spaces and is split into multiple array elements.

**How to avoid this:**
1. **Don't indent** key declarations: place them at the beginning of the line
2. **Remove spaces** around `=` in indented values: use `key_indented=value_indented`

**Example (corrected):**

```ini
key = value
    key_indented=value_indented
```

**Output:**

```json
{
  "key": ["value", "key_indented=value_indented"]
}
```

---

## Output Formats

### Simplified Format (Default)

By default (`meta: false`), the parser returns a simplified format:

**Input:**

```ini
global_key=value

[section_name]
key=value1
    value2
```

**Output:**

```json
{
  "global_key": ["value"],
  "section_name": {
    "key": ["value1", "value2"]
  }
}
```

### Format with Metadata

With `meta: true`, the parser returns a format with type information:

**Input:**

```ini
global_key=value

[section_name]
key=value1
    value2
```

**Output:**

```json
{
  "global_key": {
    "type": "configuration",
    "content": ["value"]
  },
  "section_name": {
    "type": "section",
    "content": {
      "key": {
        "type": "configuration",
        "content": ["value1", "value2"]
      }
    }
  }
}
```

---

## Special Cases

### Empty File

Returns empty object `{}`.

### Invalid Input

- `null`, `undefined`, or non-string: returns `{}`
- Empty string: returns `{}`

### Empty Sections

Sections without keys result in an empty object for that section.

**Example:**

```ini
[empty_section]

[normal_section]
key=value
```

**Output:**

```json
{
  "empty_section": {},
  "normal_section": {
    "key": ["value"]
  }
}
```

### Empty Lines

Empty lines or lines with only whitespace are ignored.

### Comment-only Files

Files containing only comments return `{}`.

### Empty Values

Keys with no value and no continuation values result in an empty array.

**Example:**

```ini
[section]
empty_key=
key_with_value=test
```

**Output:**

```json
{
  "section": {
    "empty_key": [],
    "key_with_value": ["test"]
  }
}
```

---

## Supported File Extensions

The parser works with any file extension that follows the INI format:
- `.ini` - Traditional INI files
- `.config` - Configuration files
- `.properties` - Java-style properties files
- Any other extension using INI format

---

## Known Limitations

1. **Values with semicolons**: Any value containing `;` will be truncated (treated as inline comment)
2. **No quote support**: Values with quotes have no special handling
3. **No escape sequences**: Escape characters (`\`) are not processed
4. **No nested sections**: `[section.subsection]` is treated as a unique name, not nested structure
5. **Order not preserved**: Key order is not guaranteed (JavaScript object limitation)
6. **File paths with spaces**: Any path containing spaces will be split into multiple values. Use paths without spaces or store paths as multi-value arrays

---

## Complete Examples

### Example 1: Full Configuration File

**Input:**

```ini
# Global configuration
app_name=MyApp
version=1.0.0

[database]
host=localhost
port=5432 ; default PostgreSQL port
users=
    admin
    readonly
    backup

[features]
enabled_modules=auth api logging
```

**Output:**

```json
{
  "app_name": ["MyApp"],
  "version": ["1.0.0"],
  "database": {
    "host": ["localhost"],
    "port": ["5432"],
    "users": ["admin", "readonly", "backup"]
  },
  "features": {
    "enabled_modules": ["auth", "api", "logging"]
  }
}
```

### Example 2: Pytest-style Configuration

**Input:**

```ini
[pytest]
addopts=
    -rA
    --cov=package
    --cov-config=.coveragerc
testpaths=
    tests
```

**Output:**

```json
{
  "pytest": {
    "addopts": ["-rA", "--cov=package", "--cov-config=.coveragerc"],
    "testpaths": ["tests"]
  }
}
```

### Example 3: Mixed Global and Sectioned Keys

**Input:**

```ini
; Application metadata
title=Configuration Parser
author=NotFound

[server]
host=0.0.0.0
port=8080
allowed_origins=http://localhost:3000 http://localhost:8080

[logging]
level=info
format=json
outputs=
    console
    file
```

**Output:**

```json
{
  "title": ["Configuration Parser"],
  "author": ["NotFound"],
  "server": {
    "host": ["0.0.0.0"],
    "port": ["8080"],
    "allowed_origins": ["http://localhost:3000", "http://localhost:8080"]
  },
  "logging": {
    "level": ["info"],
    "format": ["json"],
    "outputs": ["console", "file"]
  }
}
```

---


## See Also

- **[API Reference](./API.md)** - Complete API documentation for using the parser programmatically.
- **[CLI Reference](./CLI.md)** - Complete guide for using the command-line interface.

---

**Made with ❤️ by Júnior Sbrissa | Errør 404 | NotFounnd**
