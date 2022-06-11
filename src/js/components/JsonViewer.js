import React from 'react';
import JsonObject from './DataTypes/Object';
import ArrayGroup from './ArrayGroup';

export default class extends React.PureComponent {
    render = () => {
        this.verifiedDataRef = React.createRef();
        this.verifiedDataRef.current = [];
        this.props.verifiedDataRef = this.verifiedDataRef;
        const { props } = this;
        const namespace = [props.name];
        let ObjectComponent = JsonObject;

        if (
            Array.isArray(props.src) &&
            props.groupArraysAfterLength &&
            props.src.length > props.groupArraysAfterLength
        ) {
            ObjectComponent = ArrayGroup;
        }

        const printVerifiedDataRef = () => {
            console.log('-----> verifiedDataRef: ', this.verifiedDataRef.current);
        }

        return (
            <div class="pretty-json-container object-container">
                <div class="object-content">
                    <ObjectComponent
                        namespace={namespace}
                        depth={0}
                        jsvRoot={true}
                        {...props}
                    />
                </div>
                // TODO: Remove click me button and function to print
                <button onClick={printVerifiedDataRef}>click me</button>
            </div>
        );
    };
}
