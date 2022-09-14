import React from 'react';
import dispatcher from './../helpers/dispatcher';

import CopyToClipboard from './CopyToClipboard';
import { toType } from './../helpers/util';

//icons
import { Verify, Verified, RemoveCircle as Remove, AddCircle as Add } from './icons';

//theme
import Theme from './../themes/getStyle';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            verified: false,
        };
    }

    componentDidMount = () => {
        const { initParentPath } = this.props;
        const path = this.getPath();
        initParentPath(path, this.setState.bind(this));
    }

    getObjectSize = () => {
        const { size, theme, displayObjectSize } = this.props;
        if (displayObjectSize) {
            return (
                <span class="object-size" {...Theme(theme, 'object-size')}>
                    {size} item{size === 1 ? '' : 's'}
                </span>
            );
        }
    };

    getAddAttribute = rowHovered => {
        const { theme, namespace, name, src, rjvId, depth } = this.props;

        return (
            <span
                class="click-to-add"
                style={{
                    verticalAlign: 'top',
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Add
                    class="click-to-add-icon"
                    {...Theme(theme, 'addVarIcon')}
                    onClick={() => {
                        const request = {
                            name: depth > 0 ? name : null,
                            namespace: namespace.splice(
                                0,
                                namespace.length - 1
                            ),
                            existing_value: src,
                            variable_removed: false,
                            key_name: null
                        };
                        if (toType(src) === 'object') {
                            dispatcher.dispatch({
                                name: 'ADD_VARIABLE_KEY_REQUEST',
                                rjvId: rjvId,
                                data: request
                            });
                        } else {
                            dispatcher.dispatch({
                                name: 'VARIABLE_ADDED',
                                rjvId: rjvId,
                                data: {
                                    ...request,
                                    new_value: [...src, null]
                                }
                            });
                        }
                    }}
                />
            </span>
        );
    };

    getRemoveObject = rowHovered => {
        const { theme, hover, namespace, name, src, rjvId } = this.props;

        //don't allow deleting of root node
        if (namespace.length === 1) {
            return;
        }
        return (
            <span
                class="click-to-remove"
                style={{
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Remove
                    class="click-to-remove-icon"
                    {...Theme(theme, 'removeVarIcon')}
                    onClick={() => {
                        dispatcher.dispatch({
                            name: 'VARIABLE_REMOVED',
                            rjvId: rjvId,
                            data: {
                                name: name,
                                namespace: namespace.splice(
                                    0,
                                    namespace.length - 1
                                ),
                                existing_value: src,
                                variable_removed: true
                            }
                        });
                    }}
                />
            </span>
        );
    };

    render = () => {
        const {
            theme,
            onDelete,
            onAdd,
            enableClipboard,
            src,
            namespace,
            rowHovered,
            enableVerifyIcon,
            type,
        } = this.props;
        // if (type == 'array') {
        //     console.log('Array: ', namespace.join('.'))
        // } else {
        //     console.log('Object: ', namespace.join('.'))
        // }
            // console.log("🚀 ~ file: VariableMeta.js ~ line 119 ~ extends ~ namespace", namespace)
        return (
            <div
                {...Theme(theme, 'object-meta-data')}
                class="object-meta-data"
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                {/* size badge display */}
                {this.getObjectSize()}
                {enableVerifyIcon ? (this.state.verified ? this.getVerifiedIcon(rowHovered) : this.getVerifyIcon(rowHovered)) : null}
                {/* copy to clipboard icon */}
                {enableClipboard ? (
                    <CopyToClipboard
                        rowHovered={rowHovered}
                        clickCallback={enableClipboard}
                        {...{ src, theme, namespace }}
                    />
                ) : null}
                {/* copy add/remove icons */}
                {onAdd !== false ? this.getAddAttribute(rowHovered) : null}
                {onDelete !== false ? this.getRemoveObject(rowHovered) : null}
            </div>
        );
    };

    setAsVerified = (explicit = false) => {
        const { addToVerifiedParentPaths } = this.props;
        const path = this.getPath();
        addToVerifiedParentPaths(path, {explicit});
    }

    setAsUnverified = () => {
        const { removeFromVerifiedParentPaths } = this.props;
        const path = this.getPath();
        removeFromVerifiedParentPaths(path) // removing both addTo and removeFrom fixed the problem of icon not appearing
    }

    getPath = () => {
        const {namespace, pathSeparator} = this.props;
        return namespace.join(pathSeparator);
    }

    getVerifyIcon = (rowHovered) => {
        const { addToVerifiedParentPaths } = this.props;
        const path = this.getPath();
        return (
            <div
                class="click-to-edit"
                style={{
                    verticalAlign: 'top',
                    display: rowHovered ? 'inline-block' : 'none'
                }}
            >
                <Verify
                    onClick={() => {
                        this.setAsVerified(true);
                    }}
                />
            </div>
        );
    };

    getVerifiedIcon = (rowHovered) => {
        const { canBeRemovedFromVerifiedParentPaths } = this.props;

        return (
            <div
                class="click-to-action"
                style={{
                    verticalAlign: 'top',
                    // display: this.state.hovered ? 'inline-block' : 'none'
                    // show always
                    display: 'inline-block'
                }}
            >
                <Verified
                    onClick={() => {
                        const path = this.getPath();

                        if(canBeRemovedFromVerifiedParentPaths(path)) {
                            this.setAsUnverified();
                        }
                        // TODO: else consider showing a tool tip saying "you can't do this because..."
                    }}
                />
            </div>
        );
    };
}
