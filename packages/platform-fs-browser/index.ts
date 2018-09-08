// add non-standard extension
declare global {
    interface File {
        webkitRelativePath: string;
    }
}

export * from './file';
export * from './file-index';
