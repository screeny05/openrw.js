import { TreeviewNodeProps } from "../components/molecule/treenode";
import { BrowserFile } from "@rws/platform-fs-browser/file";
import { DirEntry } from "@rws/library/type/dir-entry";
import { ImgIndex } from "@rws/library/index/img";
import { SdtEntry } from "@rws/library/type/sdt-entry";
import { RawIndex } from "@rws/library/index/raw";

export async function treeviewnodeToBuffer(node: TreeviewNodeProps): Promise<ArrayBuffer|undefined> {
    const file: BrowserFile|undefined = node.data.file;
    const entry: DirEntry|undefined = node.data.entry;
    const sdtEntry: SdtEntry|undefined = node.data.sdtEntry;

    if(file){
        return await file.getData();
    }

    if(entry){
        const img: ImgIndex = node.data.img;
        return await img.imgFile.getData(entry.offset, entry.offset + entry.size);
    }

    if(sdtEntry){
        const raw: RawIndex = node.data.raw;
        return await raw.rawFile.getData(sdtEntry.offset, sdtEntry.offset + sdtEntry.size);
    }
}
