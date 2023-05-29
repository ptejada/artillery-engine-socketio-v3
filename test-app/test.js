const fs = require('fs')
const { execSync } = require('child_process')

const scenarioExpectation = {
  "default.yml": {
    Codes: {
      101: 11,
      400: 1
    },
    Events: 6
  },
  "auth-dynamic.yml": {
    Codes: {
      101: 1,
      200: 1
    },
    Events: 1
  },
  "auth-static.yml": {
    Codes: {
      101: 1
    },
    Events: 1
  },
  "auth-via-headers.yml": {
    Codes: {
      101: 3,
    },
    Events: 2
  },
  "auth-from-payload.yml": {
    Codes: {
      101: 1,
      200: 1,
    },
    Events: 1
  },
}

/*************** DO NOT EDIT BELOW THIS LINE ***********************/
const scenarioFiles = fs.readdirSync('artillery').filter(file => file.endsWith('.yml'))

let port = process.env.PORT || 3009;
let errors = [];
scenarioFiles.forEach((fileName) => {
  const file = `artillery/${fileName}`

  try {
    const result = execSync(`SERVER_PORT=${port++} npx artillery run ${file}`).toString();

    errors = errors.concat(validateResult(fileName, result))
    console.log(result)
  } catch (err) {
    console.log(`Failed run scenario ${fileName}.`)
    console.log(err.stderr.toString())
    console.log(err.stdout.toString())
    process.exit(err.status)
  }
})

if (errors.length) {
  console.log(`Assertion Errors:`)
  errors.map(err => console.log(`  ${err}`))
  console.log('\n');
}

function validateResult(fileName, result) {
  const errors = [];

  if (scenarioExpectation[fileName]) {
    const rules = scenarioExpectation[fileName]

    if (rules.Codes) {
      const codeChunk = strChunk(result, 'Codes:')
      for (const [code, count] of Object.entries(rules.Codes)) {
        const matched = codeChunk.includes(`${code}: ${count}`);

        if (!matched) {
          errors.push(`Failed matching Code ${code} was logged ${count} time(s)`);
        }
      }
    }

    if (rules.Events) {
      const matched = result.includes(`engine.socketio.emit: ${rules.Events}`);

      if (!matched) {
        errors.push(`Failed matching ${rules.Events} events were emitted.`);
      }
    }
  }

  if (result.includes('Errors:') || result.includes('Scenarios completed: 0')) {
    errors.push('Scenario expectations failed.')
  }

  return errors.map(err => `[${fileName}] ${err}`);
}

function strChunk(source, after) {
  const index = source.indexOf(after)

  if (index !== false) {
    return source.substring(index + after.length)
  }

  return ''
}

