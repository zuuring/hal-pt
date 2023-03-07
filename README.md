# HAL-PT
Hardware Artificial Life Personal Trainer - A GPT-3 Powered Developer Assistant CLI

![halpt](https://user-images.githubusercontent.com/7145746/223463888-8cb27b1d-a076-483d-bc2d-d48e2bc267ff.gif)

## What is it?

HAL-PT is a new CLI tool built on node.js which allows you to use ChatGPT-3's language model directly in your CLI to ask coding questions, get help fixing errors and debug your code with ESLint. This is only the first v0.1.0 release and there will be much more cool features added later!

## Install

Before installing, you will need to create an OpenAI Account and [Create an API Key](https:/platform.openai.com/account/api-keys)


```bash
npm install hal-pt -g
```

## Commands

```bash
# Make sure the CLI is working
hpt

# Add your OpenAI API key
hpt auth

# check for commands
hpt help

# Ask HAL-PT a coding question, how to fix an error?
hpt <prompt>

#run ESLint on directory to check for errors
hpt debug
```

## Examples

Use the built in debugger with `hpt debug` and ask HAL-PT how to fix it
```hpt Tell me how to fix this error: <insert error here>```

Ask to get instructions how to install certain things
```hpt give me instructions how to add GPG to my CLI for github```

Generate snippets and code on the fly
```hpt Create a ReactJS component to fetch a JSON file from an external API```

## Logs

Logs are stored to a local `logs.json` file to help you debug info from the response that is not displayed on screen

## Upcoming Features
- Better prompts for reading package.json
- Better debugging tools with sync to ChatGPT

## Contribute

I encourage those interested in the tool to contribute to this repo either through PRs, forks or opening an issue! This is only the start.
