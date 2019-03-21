export function downloadBuffer(name: string, buffer: ArrayBuffer): void {
    const blob = new Blob([buffer]);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = name;
    link.click();
};
