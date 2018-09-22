import { IGroup } from "@rws/platform/graphic/group";
import { Group } from "three";
import { ThreeObject3d } from "./object3d";

export class ThreeGroup extends ThreeObject3d implements IGroup {
    constructor(){
        super(new Group());
    }
}
