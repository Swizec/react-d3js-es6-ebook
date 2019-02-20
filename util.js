const { execSync } = require('child_process');

function conditionalLog(isLoggingEnabled, label) {
  let stackFramesInCurrentFile, indentationCount, indentation;
  if (isLoggingEnabled) {
    stackFramesInCurrentFile = new Error().stack
      .split('\n')
      .filter(line => line.match(__filename)).length;
    indentationCount = stackFramesInCurrentFile - 1;
    indentation = `${indentationCount}` + '>>'.repeat(indentationCount);
  }

  return function(value) {
    if (isLoggingEnabled)
      console.log(
        `\n\n\n\n${indentation}${label ? label + ':' : ''}\n\n${value}`
      );
    return value;
  };
}

function json(obj) {
  return JSON.stringify(obj, null, 2);
}

function runShellCommand(
  commandString,
  errorMessage = 'Something went wrong.'
) {
  console.log('\n\n=> Running shell command:');
  console.log('    $ ' + commandString);
  let output;
  try {
    output = String(execSync(commandString));
  } catch (e) {
    console.log(`\n    !ERROR!: ${errorMessage}`);
    output = String(e);
  }
  console.log('\n    output:', output);
}

module.exports = { conditionalLog, json, runShellCommand };
