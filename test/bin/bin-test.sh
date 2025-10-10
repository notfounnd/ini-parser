#!/usr/bin/env bash

# E2E Test Script for @notfounnd/ini-parser CLI
# Tests the binary executable in real-world scenarios
# Assumes npm link has been run

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Get current version from package.json
PACKAGE_VERSION=$(grep -oP '(?<="version": ")[^"]*' ../../package.json)

# Clean and prepare temp directory
rm -rf temp
mkdir -p temp

# Helper function to run test
run_test() {
  local test_name="$1"
  local command="$2"
  local expected_exit="$3"
  local output_file="$4"
  local validation="$5"

  echo -e "${YELLOW}Running:${NC} $test_name"

  # Execute command and save output
  if [[ "$command" == *"2>"* ]]; then
    # If command already redirects stderr, use it as is
    eval "$command > $output_file"
  else
    # Otherwise redirect both stdout and stderr
    eval "$command > $output_file 2>&1"
  fi
  local actual_exit=$?

  # Check exit code
  if [ $actual_exit -ne $expected_exit ]; then
    echo -e "${RED}✗ FAIL${NC}: $test_name (exit code: expected $expected_exit, got $actual_exit)"
    ((FAILED++))
    return
  fi

  # Run validation if provided
  if [ -n "$validation" ]; then
    eval "$validation"
    if [ $? -ne 0 ]; then
      echo -e "${RED}✗ FAIL${NC}: $test_name (validation failed)"
      ((FAILED++))
      return
    fi
  fi

  echo -e "${GREEN}✓ PASS${NC}: $test_name"
  ((PASSED++))
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}INI Parser - E2E Tests${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Test 1: Basic parse to stdout
run_test \
  "Test 1: Basic parse to stdout" \
  "ini-parser ../__fixtures__/valid-simple.ini" \
  0 \
  "temp/test1-stdout.txt" \
  "grep -q '\"app\"' temp/test1-stdout.txt"

# Test 2: --output flag
run_test \
  "Test 2: Flag --output" \
  "ini-parser ../__fixtures__/valid-complete.ini --output temp/test2-output.json" \
  0 \
  "temp/test2-stdout.txt" \
  "test -f temp/test2-output.json"

# Test 3: --meta flag
run_test \
  "Test 3: Flag --meta" \
  "ini-parser ../__fixtures__/valid-simple.ini --meta" \
  0 \
  "temp/test3-meta.txt" \
  "grep -q '\"type\"' temp/test3-meta.txt"

# Test 4: -o and --quiet flags
run_test \
  "Test 4: Flags -o and --quiet" \
  "ini-parser ../__fixtures__/valid-simple.ini -o temp/test4-quiet.json --quiet" \
  0 \
  "temp/test4-stdout.txt" \
  "test -f temp/test4-quiet.json"

# Test 5: --help flag
run_test \
  "Test 5: Flag --help" \
  "ini-parser --help" \
  0 \
  "temp/test5-help.txt" \
  "grep -q 'Usage:' temp/test5-help.txt"

# Test 6: --version flag
run_test \
  "Test 6: Flag --version" \
  "ini-parser --version" \
  0 \
  "temp/test6-version.txt" \
  "grep -q '$PACKAGE_VERSION' temp/test6-version.txt"

# Test 7: Non-existent file (expected error)
run_test \
  "Test 7: Non-existent file error" \
  "ini-parser nonexistent.ini" \
  1 \
  "temp/test7-output.txt" \
  "grep -q 'ERROR' temp/test7-output.txt"

# Test 8: --check flag
run_test \
  "Test 8: Flag --check" \
  "ini-parser ../__fixtures__/valid-complete.ini --check" \
  0 \
  "temp/test8-check.txt" \
  "grep -q 'SUCCESS' temp/test8-check.txt && grep -q 'sections' temp/test8-check.txt"

# Print summary
echo ""
echo -e "${BLUE}================================${NC}"
echo "E2E Test Results:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "  ${RED}Failed: $FAILED${NC}"
else
  echo -e "  Failed: $FAILED"
fi
echo -e "${BLUE}================================${NC}"

# Clean up temp directory
echo ""
echo -e "${YELLOW}Cleaning up...${NC}"
rm -rf temp
echo -e "${GREEN}Temp directory removed${NC}"

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
  exit 1
else
  exit 0
fi
