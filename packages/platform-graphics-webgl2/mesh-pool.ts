import { IMeshPool } from "@rws/platform/graphic";

export class MeshPool implements IMeshPool {
    get(name: string): import("../platform/graphic").IMesh {
        throw new Error("Method not implemented.");
    }    has(name: string): boolean {
        throw new Error("Method not implemented.");
    }
    findMeshChild(name: string): import("../platform/graphic").IMesh | null {
        throw new Error("Method not implemented.");
    }
    loadFromFile(fileName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    loadFromImg(imgName: string, fileName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
