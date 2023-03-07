#!/usr/bin/env node
import * as fs from "fs";
import cp from "child_process";
import { ESLint } from "eslint";
import * as inspector from "node:inspector";
import cliMd from "cli-markdown";
import boxen from "boxen";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createInterface } from "readline";
import process, { stdin, stdout, platform, argv, versions } from "process";

const apiKeyName = "OPENAI_API_KEY";
const apiKeyUrl = "https://platform.openai.com/account/api-keys";
const __dirname = getDirname();
const fsPromises = fs.promises;

gptCLI();

async function gptCLI() {
  if (parseFloat(versions.node) < 18) {
    console.log("Node v18.0.0 and above required to use this app.");
    process.exit(1);
  }

  let apiKey = await getApiKey();

  const args = process.argv.slice(2);
  const prompt = args.join(" ");

  const eslint = new ESLint();

  const packageExists = await fs.existsSync('package.json');

  switch (prompt) {
    case "":
      console.log(
        "\r\n D E B U G  +  +  +  +  R E V I E W  +  +  +  +  L E A R N  +  +  +  +"
      );
      console.log(
        "\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\\r\n \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\\r\n\\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\\r\n \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\\r\n\\     \\     \\     \\     \\     \\     \\     \\     \\     \\     \\     \\     \\\r\n \\      \\      \\      \\      \\      \\      \\      \\      \\      \\      \\\r\n\\       \\       \\       \\       \\       \\       \\       \\       \\       \\\r\n \\        \\        \\        \\        \\        \\        \\        \\        \\\r\n\\         \\         \\         \\         \\         \\         \\         \\\r\n \\          \\          \\          \\          \\          \\          \\\r\n\\           \\           \\           \\           \\           \\           \\"
      );
      console.log(
        "  _    _          _          _____ _______ \r\n | |  | |   /\\   | |        |  __ \\__   __|\r\n | |__| |  /  \\  | |  ______| |__) | | |   \r\n |  __  | / /\\ \\ | | |______|  ___/  | |   \r\n | |  | |/ ____ \\| |____    | |      | |   \r\n |_|  |_/_/    \\_\\______|   |_|      |_|   \r\n                                           \r\n                                           "
      );
      console.log(
        " \\          \\          \\          \\          \\          \\          \\\r\n\\         \\         \\         \\         \\         \\         \\         \\\r\n \\        \\        \\        \\        \\        \\        \\        \\        \\\r\n\\       \\       \\       \\       \\       \\       \\       \\       \\       \\\r\n \\      \\      \\      \\      \\      \\      \\      \\      \\      \\      \\\r\n\\     \\     \\     \\     \\     \\     \\     \\     \\     \\     \\     \\     \\\r\n \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\    \\\r\n\\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\   \\\r\n \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\\r\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\"
      );
      console.log(
        "A  G P T - 3  P O W E R E D  C L I  D E V E L O P E R  A S S I S T A N T "
      );
      if (!apiKey) {
        console.log(cliMd("## No OpenAI Key detected! Type `hpt auth` to add your OpenAI API Key"));
      }
      if (apiKey) {
        console.log(
          cliMd(
            "## Type `hpt <prompt>` to ask a question or `hpt help` for more information"
          )
        );
        if (packageExists === true ) {
          const packageContents = fs.readFileSync("package.json", "utf-8", callback);
          console.log(cliMd("## NodeJS Application detected, HAL-PT has read your package.json"))
          savePackage(packageContents)
        }
      }
      // console.log("========== Contents of this application ==========" + packageContents)
      return;
    case "help":
      console.log(cliMd("## HAL-PT HELP: You can use the following commands"));
      console.log(cliMd("- `hpt auth` to add your OpenAI API Key"));
      console.log(cliMd("- `hpt <prompt>` to ask your question related to programming or pasting error codes"));
      console.log(cliMd("- `hpt debug` to run ESLint on NodeJS applications (WIP)"));
      return;
    case "inspect":
      inspector;
      console.debug();
      return;
    case "debug":
      const results = await eslint.lintFiles(["**/*.js"]);
      const formatter = await eslint.loadFormatter("stylish");
      const resultText = formatter.format(results);
      console.log(resultText);
      console.log(cliMd("# Need help? Type the error into HAL!"));
      return;
    case "auth":
      await promptPlusKey(false);
      return;
  }

  if (!apiKey) {
    apiKey = await promptPlusKey(Boolean(apiKey));
    if (!apiKey) {
      return;
    }
  }

  const response = await sendOpenGPTQuery(apiKey, prompt);
  const result = parseResult(response);

  // output to user
  console.log(cliMd(result));

  appendLogData(prompt, response);
}

function getDirname() {
  const filename = fileURLToPath(import.meta.url);
  return dirname(filename);
}

function savePackage(packageContents) {
  const packageData = packageContents;
  return
}

function callback(err, data) {
  if (err) {
    console.log(err)
  }
  if (err.code === 'ENOENT') {
    console.log('File not found!');
  }
  else {
    // Handle success
  }
}

async function getApiKey() {
  try {
    const envFile = await fsPromises.readFile(`${__dirname}/.env`, "utf-8", callback);
    const regex = new RegExp(`${apiKeyName}=(.+)`);
    const match = regex.exec(envFile);
    const apiKey = match?.[1];
    return apiKey;
  } catch (error) {
    return null;
  }
}

async function promptPlusKey(keySet) {
  const promptDesc = !keySet ? "not set" : "incorrect";
  console.log(cliMd("## You must add your OpenAI API Key"));
  const { rl, prompt } = createUserPrompt();

  const openDocsResp = await prompt(`Open OpenAI API Key  (y/N)? `);
  if (openDocsResp.toLowerCase() == "y") {
    openUrl(apiKeyUrl);
  }

  const apiKey = await prompt("Enter your API Key: ");

  rl.close();

  if (!apiKey) {
    return;
  }

  const secrets = `${apiKeyName}=${apiKey}`;
  await fsPromises.writeFile(`${__dirname}/.env`, secrets, callback);

  return console.log(cliMd("## OpenAI API key added successfully, you may now use `hpt <prompt>` to speak to HAL-PT"));
}

function createUserPrompt() {
  const rl = createInterface({ input: stdin, output: stdout });
  const prompt = (query) =>
    new Promise((resolve) => rl.question(query, resolve));
  return { rl, prompt };
}

function openUrl(url) {
  cp.exec(`${platformStartCommand()} ${url}`);
}

function platformStartCommand() {
  switch (platform) {
    case "darwin":
      return "open";
    case "win32":
      return "start";
    default:
      return "xdg-open";
  }
}

async function sendOpenGPTQuery(apiKey) {
  const spinner = loadingIcon();

  spinner.start();
  const { resp, data } = await openGPTChat(apiKey);
  spinner.stop();

  if (resp.status != 200) {
    if (resp.status == 401) {
      await promptPlusKey(true);
    } else {
      await logFailedRequest(resp, data);
    }
    process.exit(1);
  }

  return data;
}

async function openGPTChat(apiKey) {
  const args = process.argv.slice(2);
  const prompt = args.join(" ");
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const method = "POST";
  // const body = JSON.stringify( {model: "text-davinci-003", temperature: 0.2, max_tokens: 140, prompt: prompt })
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: "Your name is HAL-PT and you are a programming assistant who can debug, review and teach all programming languages like github or stack overflow" },{ role: "user", content: prompt }],
  });
  // const body = JSON.stringify( {model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt + "tell me how to fix this error:  ```" + resultOutput + "```" }]})
  const response = await fetch(url, { headers, method, body });
  const { status, statusText } = response;
  const resp = { status, statusText };
  const data = await response.json();
  console.log(cliMd("`==== HAL-PT ANSWERS ====`"))
  return { resp, data };
}

function parseResult(data) {
  const choice = data.choices[0].message;
  const response = choice.content;
  const suffix = choice.finish_reason == "length" ? "..." : "";
  return response;
}

async function appendLogData(prompt, response) {
  const logPath = `${__dirname}/log.json`;

  const curLogs = await getLogData(logPath);
  const newLog = { prompt, ...response };
  const newLogs = [...curLogs, newLog];

  const logContent = JSON.stringify(newLogs, null, 4) + "\n";
  await fs.writeFileSync(logPath, logContent);
}

async function getLogData(path) {
  try {
    const contents = await fs.readFileSync(path);
    return JSON.parse(contents);
  } catch (error) {
    return [];
  }
}

async function logFailedRequest(resp, data) {
  const errorFilePath = `${__dirname}/error.txt`;
  const timestamp = new Date();
  const errorLogData =
    JSON.stringify({ timestamp, resp, data }, null, 2) + "\n\n";

  await fs.appendFile(errorFilePath, errorLogData, callback);

  const errorMessage = data?.error?.message || resp?.statusText || "unknown";

  console.log(`Encountered '${errorMessage}' error`);
  console.log(`View full error log details at ${errorFilePath}`);
}

function loadingIcon() {
  const characters = ["=", "==", "===", "====", "======", "======="];
  const cursorEsc = {
    hide: "\u001B[?25l",
    show: "\u001B[?25h",
  };
  stdout.write(cursorEsc.hide);

  let timer;

  const start = () => {
    let i = 0;
    timer = setInterval(function () {
      stdout.write("\r" + characters[i++]);
      i = i >= characters.length ? 0 : i;
    }, 150);
  };

  const stop = () => {
    clearInterval(timer);
    stdout.write("\r");
    stdout.write(cursorEsc.show);
  };
  return { start, stop };
}
