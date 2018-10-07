import * as React from 'react';

export class Toolbar extends React.Component {
    render(){
        return (
            <div className="title-bar">
                <div className="title-bar-left">
                    <span className="title-bar-title">rwexplorer</span>
                </div>
                <div className="title-bar-right">
                    <ul className="menu">
                        <li>
                            <a href="#">
                                <i className="fi-list"></i>
                                <span>One</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fi-list"></i>
                                <span>Two</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fi-list"></i>
                                <span>Three</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fi-list"></i>
                                <span>Four</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
