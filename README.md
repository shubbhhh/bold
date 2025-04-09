# Bold

This is a project inspired by **Bolt**, leveraging **Anthropic**'s language models and **WebContainers** for running the application in the browser with server-side capabilities.

## Features

- **AI-powered Responses**: Uses Anthropic's language models for intelligent conversations and query responses.
- **WebContainer Support**: Runs in-browser using WebContainers for seamless performance, enabling a rich server-client architecture directly from the browser.

## Requirements

- **WebContainers**: Ensure your environment supports WebContainers for the project to run properly. WebContainers are used to run Node.js in the browser, creating a server-like environment without an external backend.
- **Anthropic API**: To use the Anthropic language models, you need an API key to authenticate with Anthropic's service.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shubbhhh/bold.git
   cd bold
   ```

2. Install dependencies:
    - Backend
     ```bash
     cd backend
     npm install
     ```
    - Frontend
     ```bash
     cd frontend
     npm install
   ```
4. Set up your **Anthropic API Key**:

   Create an `.env` file in the `/backend` directory with the following content:

   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```
