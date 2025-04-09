import { CodeEditor } from "./CodeEditor";
import { PreviewFrame } from "./PrivewFrame";
import { TabView } from "./TabView";

export function CodeAndPreviewTabs({ activeTab, setActiveTab, files, selectedFile, webcontainer }: any) {
    return (
      <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
        <TabView activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="h-[calc(100%-4rem)]">
          {activeTab === 'code' ? (
            <CodeEditor file={selectedFile} />
          ) : (
            webcontainer && <PreviewFrame webContainer={webcontainer} files={files} />
          )}
        </div>
      </div>
    );
}