export enum PathNodeType {
    FileTxd,
    FileBmp,
    FileDff,
    FileFont,
    FilePE,
    FileDLL,
    FileImg,
    FileDir,
    FileIni,
    FileIde,
    FileIpl,
    FileWav,
    FileMp3,
    FileGxt,
    FileTxt,
    FileRaw,
    FileRawEntry,
    FileSdt,
    FileWater,
    FileWaterpro,
    FileTimecyc,
    FileHandling,
    FileCarcols,
    FileFistfite,
    FileWeapon,
    FileObject,
    FileCullzone,
    FilePed,
    FilePedgrp,
    FilePedstats,
    FileZon,
    FileCol,
    FileScm,
    FileSave,
    FileIfp,
    FileDat,
    FileTrain,
    FileFlight,
    FileParticle,
    FileSurface,
    File,
    Folder
}

type TypeDatabaseEntry = [string | RegExp, PathNodeType];
type TypeDatabase = TypeDatabaseEntry[];

type NodeIconSingle = [string, string, string];
type NodeIcon = NodeIconSingle | [NodeIconSingle, NodeIconSingle];

type NodeIconDatabase = {
    [P in PathNodeType]: NodeIcon;
}

const DatabaseFiles: TypeDatabase = [
    [/\.dff$/, PathNodeType.FileDff],
    [/\.txd$/, PathNodeType.FileTxd],
    [/\.bmp$/, PathNodeType.FileBmp],
    [/font.\.txd$/, PathNodeType.FileFont],
    [/\.exe$/, PathNodeType.FilePE],
    [/\.dll$/, PathNodeType.FileDLL],
    [/\.img$/, PathNodeType.FileImg],
    [/\.dir$/, PathNodeType.FileDir],
    [/\.ini$/, PathNodeType.FileIni],
    [/\.wav$/, PathNodeType.FileWav],
    [/\.mp3$/, PathNodeType.FileMp3],
    [/\.gxt$/, PathNodeType.FileGxt],
    [/\.scm$/, PathNodeType.FileScm],
    [/\.ide$/, PathNodeType.FileIde],
    [/\.ipl$/, PathNodeType.FileIpl],
    [/\.b$/, PathNodeType.FileSave],
    [/\.ifp$/, PathNodeType.FileIfp],
    [/\.col$/, PathNodeType.FileCol],
    [/\.zon$/, PathNodeType.FileZon],
    [/\.txt/, PathNodeType.FileTxt],
    ['waterpro.dat', PathNodeType.FileWaterpro],
    ['water.dat', PathNodeType.FileWater],
    ['timecyc.dat', PathNodeType.FileTimecyc],
    ['handling.cfg', PathNodeType.FileHandling],
    ['cullzone.dat', PathNodeType.FileCullzone],
    ['fistfite.dat', PathNodeType.FileFistfite],
    ['weapon.dat', PathNodeType.FileWeapon],
    ['carcols.dat', PathNodeType.FileCarcols],
    ['object.dat', PathNodeType.FileObject],
    ['particle.cfg', PathNodeType.FileParticle],
    ['ped.dat', PathNodeType.FilePed],
    ['pedgrp.dat', PathNodeType.FilePedgrp],
    ['pedstats.dat', PathNodeType.FilePedstats],
    ['surface.dat', PathNodeType.FileSurface],
    [/train.?\.dat$/, PathNodeType.FileTrain],
    [/flight.?\.dat$/, PathNodeType.FileFlight],
    [/\.dat$/, PathNodeType.FileDat],
    [/\.raw$/, PathNodeType.FileRaw],
    [/\.rawentry$/, PathNodeType.FileRawEntry],
    [/\.sdt$/, PathNodeType.FileSdt],
];

const DatabaseTextTypes = [
    PathNodeType.FileIni,
    PathNodeType.FileIde,
    PathNodeType.FileIpl,
    PathNodeType.FileZon,
    PathNodeType.FileTxt,
    PathNodeType.FileWater,
    PathNodeType.FileDat,
    PathNodeType.FileTimecyc,
    PathNodeType.FileHandling,
    PathNodeType.FileFistfite,
    PathNodeType.FileWeapon,
    PathNodeType.FileCarcols,
    PathNodeType.FileObject,
    PathNodeType.FileParticle,
    PathNodeType.FilePed,
    PathNodeType.FilePedgrp,
    PathNodeType.FilePedstats,
    PathNodeType.FileSurface,
    PathNodeType.FileTrain,
    PathNodeType.FileFlight,
];

const DatabaseInspectableTypes = [
    PathNodeType.FileTxd,
    PathNodeType.FileDff,
    PathNodeType.FileDir,
    PathNodeType.FileGxt,
    PathNodeType.FileWaterpro,
    PathNodeType.FileIfp,
    PathNodeType.FileCol
];

const DatabaseFolders: TypeDatabase = [];

const NodeIcons: NodeIconDatabase = {
    [PathNodeType.Folder]: [['fa', 'folder', '#fe7600'], ['fa', 'folder-open', '#fe7600']],
    [PathNodeType.File]: ['fi', 'default', '#fe7600'],
    [PathNodeType.FileDff]: ['fi', 'model', '#fe7600'],
    [PathNodeType.FileTxd]: ['fi', 'image', '#fe7600'],
    [PathNodeType.FileBmp]: ['fi', 'image', '#fe7600'],
    [PathNodeType.FileFont]: ['fi', 'font-bitmap', '#fe7600'],
    [PathNodeType.FilePE]: ['fi', 'manpage', '#fe7600'],
    [PathNodeType.FileDLL]: ['fas', 'cogs', '#fe7600'],
    [PathNodeType.FileImg]: ['fas', 'archive', '#fe7600'],
    [PathNodeType.FileDir]: ['fas', 'list-ul', '#fe7600'],
    [PathNodeType.FileIni]: ['fas', 'wrench', '#fe7600'],
    [PathNodeType.FileIde]: ['fas', 'database', '#fe7600'],
    [PathNodeType.FileIpl]: ['fas', 'map-pin', '#fe7600'],
    [PathNodeType.FileWav]: ['fa', 'file-audio', '#fe7600'],
    [PathNodeType.FileMp3]: ['fa', 'file-audio', '#fe7600'],
    [PathNodeType.FileGxt]: ['fa', 'file-alt', '#fe7600'],
    [PathNodeType.FileTxt]: ['fas', 'file-alt', '#fe7600'],
    [PathNodeType.FileWaterpro]: ['fas', 'tint', '#fe7600'],
    [PathNodeType.FileWater]: ['fas', 'tint', '#fe7600'],
    [PathNodeType.FileTimecyc]: ['fas', 'sun', '#fe7600'],
    [PathNodeType.FileScm]: ['fas', 'code', '#fe7600'],
    [PathNodeType.FileSave]: ['fa', 'save', '#fe7600'],
    [PathNodeType.FileIfp]: ['fas', 'child', '#fe7600'],
    [PathNodeType.FileDat]: ['fas', 'book', '#fe7600'],
    [PathNodeType.FileHandling]: ['fas', 'car', '#fe7600'],
    [PathNodeType.FileCarcols]: ['fas', 'palette', '#fe7600'],
    [PathNodeType.FileCol]: ['fas', 'car-crash', '#fe7600'],
    [PathNodeType.FileZon]: ['fas', 'atlas', '#fe7600'],
    [PathNodeType.FileTrain]: ['fas', 'subway', '#fe7600'],
    [PathNodeType.FileFlight]: ['fas', 'plane', '#fe7600'],
    [PathNodeType.FileFistfite]: ['fa', 'hand-rock', '#fe7600'],
    [PathNodeType.FileWeapon]: ['fas', 'crosshairs', '#fe7600'],
    [PathNodeType.FileCullzone]: ['fa', 'map', '#fe7600'],
    [PathNodeType.FileObject]: ['fas', 'project-diagram', '#fe7600'],
    [PathNodeType.FileParticle]: ['fas', 'compress', '#fe7600'],
    [PathNodeType.FilePed]: ['fas', 'male', '#fe7600'],
    [PathNodeType.FilePedgrp]: ['fas', 'user-friends', '#fe7600'],
    [PathNodeType.FilePedstats]: ['fa', 'chart-bar', '#fe7600'],
    [PathNodeType.FileSurface]: ['fas', 'road', '#fe7600'],
    [PathNodeType.FileRaw]: ['fas', 'file-audio', '#fe7600'],
    [PathNodeType.FileRawEntry]: ['fa', 'file-audio', '#fe7600'],
    [PathNodeType.FileSdt]: ['fas', 'list-ul', '#fe7600'],
};

const guessByNameDatabase = (name: string, database: TypeDatabase): PathNodeType | undefined => {
    const match = DatabaseFiles.find(([pattern]) => {
        if(typeof pattern === 'string'){
            return name.toLowerCase() === pattern;
        }
        return pattern.test(name.toLowerCase());
    });
    if(typeof match === 'undefined'){
        return;
    }
    return match[1];
};

export const guessFileNodeType = (name: string): PathNodeType => {
    const dbGuess = guessByNameDatabase(name, DatabaseFiles);
    if(typeof dbGuess !== 'undefined'){
        return dbGuess;
    }

    return PathNodeType.File;
}

export const isTextFileType = (type: PathNodeType): boolean => {
    return DatabaseTextTypes.includes(type);
}

export const isInspectableFileType = (type: PathNodeType): boolean => {
    return DatabaseInspectableTypes.includes(type);
}

export const guessFolderNodeType = (name: string): PathNodeType => {
    const dbGuess = guessByNameDatabase(name, DatabaseFolders);
    if(dbGuess){
        return dbGuess;
    }

    return PathNodeType.Folder;
}

export const getIconByNodeType = (type: PathNodeType, isOpen: boolean = false): NodeIconSingle => {
    const icon = NodeIcons[type];
    if(icon.length === 2){
        return icon[isOpen ? 1 : 0];
    }
    return icon;
}

export const isExpandableType = (type: PathNodeType): boolean => {
    return [
        PathNodeType.FileRaw,
        PathNodeType.FileImg,
    ].includes(type);
}
