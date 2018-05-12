import { IMesh, IGeometry, IMaterial } from "../../rwscore/graphic";
import { ThreeObject3d } from "./object3d";

export class ThreeMesh extends ThreeObject3d implements IMesh {
    geometry: IGeometry;
    material: IMaterial;
}
