import { FileItem } from "../types";
import { FileExplorer } from "./FileExplorer";

export function FileExplorerTab({ files, setSelectedFile }: { files: FileItem[], setSelectedFile: (file: FileItem | null) => void }) {
  return (
    <div className="col-span-1">
      <FileExplorer files={files} onFileSelect={setSelectedFile} />
    </div>
  );
}
