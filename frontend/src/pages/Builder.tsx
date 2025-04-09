import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { FileItem, Step } from "../types";
import { BACKEND_URL } from "../config";

import { parseXML } from "../utils/xmlParser";

import { Loader } from "lucide-react";

import axios from "axios";

import { FileExplorer } from "../components/FileExplorer";
import { StepsList } from "../components/SetpsList";
import { TabView } from "../components/TabView";
import { CodeEditor } from "../components/CodeEditor";


export default function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };

  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  // const webcontainer = useWebContainer();
  
  // Leftmost tab: Steps
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);
  
  // File explorer tab
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  // Rightmost tab
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXML(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXML(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
                <div className='flex'>
                  <br />
                  {(loading || !templateSet) && <Loader />}
                  {!(loading || !templateSet) && <div className='flex'>
                    <textarea value={userPrompt} onChange={(e) => {
                    setPrompt(e.target.value)
                  }} className='p-2 w-full'></textarea>
                  <button onClick={async () => {
                    const newMessage = {
                      role: "user" as "user",
                      content: userPrompt
                    };

                    setLoading(true);
                    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                      messages: [...llmMessages, newMessage]
                    });
                    setLoading(false);

                    setLlmMessages(x => [...x, newMessage]);
                    setLlmMessages(x => [...x, {
                      role: "assistant",
                      content: stepsResponse.data.response
                    }]);
                    
                    setSteps(s => [...s, ...parseXML(stepsResponse.data.response).map(x => ({
                      ...x,
                      status: "pending" as "pending"
                    }))]);

                  }} className='bg-purple-400 px-4'>Send</button>
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
              <FileExplorer 
                files={files} 
                onFileSelect={setSelectedFile}
              />
            </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <div></div>
                // <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}