import { TreeviewNodeProps } from "../components/molecule/treenode";
import { BrowserFile } from "@rws/platform-fs-browser/file";
import { DirEntry } from "@rws/library/type/dir-entry";
import { ImgIndex } from "@rws/library/index/img";

export async function treeviewnodeToBuffer(node: TreeviewNodeProps): Promise<ArrayBuffer|undefined> {
    const file: BrowserFile|undefined = node.data.file;
    const entry: DirEntry|undefined = node.data.entry;

    if(file){
        return await file.getData()
    }

    if(entry){
        const img: ImgIndex = node.data.img;
        return await img.imgFile.getData(entry.offset, entry.offset + entry.size);
    }
}
