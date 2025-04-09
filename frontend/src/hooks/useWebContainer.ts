import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";
import { FileItem } from "../types";

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    async function main() {
        const webcontainerInstance = await WebContainer.boot();
        setWebcontainer(webcontainerInstance);
    }

    useEffect(() => {
        main();
    }, [])

    function useWebContainerMount(files: FileItem[], webcontainer: any) {
      useEffect(() => {
        const createMountStructure = (files: FileItem[]): Record<string, any> => {
          const mountStructure: Record<string, any> = {};
    
          const processFile = (file: FileItem, isRootFolder: boolean) => {  
            if (file.type === 'folder') {
              mountStructure[file.name] = {
                directory: file.children ? 
                  Object.fromEntries(
                    file.children.map(child => [child.name, processFile(child, false)])
                  ) 
                  : {}
              };
            } else if (file.type === 'file') {
              if (isRootFolder) {
                mountStructure[file.name] = {
                  file: {
                    contents: file.content || ''
                  }
                };
              } else {
                return {
                  file: {
                    contents: file.content || ''
                  }
                };
              }
            }
    
            return mountStructure[file.name];
          };
    
          files.forEach(file => processFile(file, true));
    
          return mountStructure;
        };
    
        const mountStructure = createMountStructure(files);
    
        if (webcontainer) {
          webcontainer?.mount(mountStructure);
        }
      }, [files, webcontainer]);
    }
    return { 
        webcontainer,
        useWebContainerMount
    };
}

