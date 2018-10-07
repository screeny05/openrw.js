import * as React from 'react';
import classnames from 'classnames';
import bind from 'bind-decorator';
import './index.scss';

enum FilePickerInputType {
    File,
    Folder
}

interface FilePickerInputState {
    isDragOver: boolean;
    selectedFiles: FileList | null;
}

interface FilePickerInputProps {
    type: FilePickerInputType;
    onChange: (files: File[]) => void;
}

export class FilePickerInput extends React.Component<FilePickerInputProps, FilePickerInputState> {
    state: FilePickerInputState = {
        isDragOver: false,
        selectedFiles: null
    }

    render(){
        const filePickerClasses = classnames('file-picker-input', {
            'file-picker-input--is-drop': this.state.isDragOver
        });

        const inputProps: any = {};
        if(this.props.type === FilePickerInputType.Folder){
            inputProps.webkitdirectory = 'true';
        }

        return (
            <label className={filePickerClasses} onDragOver={this.onDragStart} onDragEnd={this.onDragEnd} onDragLeave={this.onDragEnd} onDrop={this.onDragEnd}>
                <input className="file-picker-input__input" type="file" onChange={this.onChangeFile} {...inputProps}/>
                <div className="file-picker-input__label">
                    {this.getLabel()}
                </div>
            </label>
        );
    }

    getLabel(): string {
        if(this.state.isDragOver){
            return 'let it go 🎶';
        }
        if(!this.state.selectedFiles || this.state.selectedFiles.length === 0){
            return `Click or drop ${this.props.type === FilePickerInputType.File ? 'file' : 'folder'} ...`;
        }
        if(this.state.selectedFiles.length === 1){
            return this.state.selectedFiles[0].name;
        }
        return `${this.state.selectedFiles.length} files selected`;
    }

    @bind
    onDragStart(e: React.DragEvent): void {
        this.setState({ isDragOver: true });
    }

    @bind
    onDragEnd(e: React.DragEvent): void {
        this.setState({ isDragOver: false });
    }

    @bind
    onChangeFile(e: React.ChangeEvent<HTMLInputElement>): void {
        const { files } = e.target;
        if(!files || !this.checkFileNotFolder(files)){
            this.setState({
                selectedFiles: null
            });
            this.props.onChange([]);

            // prevent input from receiving value
            e.target.value = '';
            return;
        }

        this.setState({
            selectedFiles: files
        });
        this.props.onChange(Array.from(files));
    }

    // check if file is actually a file and not a folder
    checkFileNotFolder(files: FileList): boolean {
        const [file] = files;
        if(files.length > 1 || file.size > 2048 || file.type){
            return true;
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.abort();
        return !reader.error;
    }
}

interface FilePickerProps {
    onChange: (files: File[]) => void;
}

export class FilePicker extends React.Component<FilePickerProps, any> {
    state = {
        visibleType: null
    }

    render(){
        const type = this.state.visibleType;
        const { Folder, File } = FilePickerInputType;

        return (
            <div className="file-picker">
                {type === null || type === Folder ? <FilePickerInput type={FilePickerInputType.Folder} onChange={this.onSelectFolder}/> : ''}
                {type === null || type === File ? <FilePickerInput type={FilePickerInputType.File} onChange={this.onSelectFile}/> : ''}
            </div>
        );
    }

    @bind
    onSelectFolder(files: File[]){
        this.setState({
            visibleType: FilePickerInputType.Folder
        });
        this.props.onChange(files);
    }

    @bind
    onSelectFile(files: File[]){
        this.setState({
            visibleType: FilePickerInputType.File
        });
        this.props.onChange(files);
    }
}
