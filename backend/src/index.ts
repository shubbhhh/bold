require("dotenv").config();

import express from "express";
import cors from "cors";

import Anthropic from '@anthropic-ai/sdk';
import { TextBlock } from "@anthropic-ai/sdk/resources";

import { BASE_PROMPT } from "./prompt";
import { reactBasePrompt } from "./defaults/reactBase";
import { nodeBasePrompt } from "./defaults/nodeBase";


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());


app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    const response = await anthropic.messages.create({
        messages: [{
            role: "user",
            content: prompt
        }],
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2000,
        system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
    })

    const resText = (response.content[0] as TextBlock).text;

    if (resText == 'react') {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    } 

    if (resText == "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(500).json({
        message: "Something went wrong"
    })
    return;
});


console.log("Listening on port: 3000")
app.listen(3000);