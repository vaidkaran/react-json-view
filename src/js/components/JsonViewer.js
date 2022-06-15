import React from 'react';
import JsonObject from './DataTypes/Object';
import ArrayGroup from './ArrayGroup';
import { Splitscreen } from '@mui/icons-material';
import { isTheme } from '../helpers/util';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            verifiedParentPaths: []
        }
        this.verifiedDataRef = React.createRef();

        /**
         * Object with variablePath as key and {namespace, variable} as value
         * example:
         * 
         * {
         *   "root.b.e.2.z": {
         *       "namespace": [
         *           "root",
         *           "b",
         *           "e",
         *           "2"
         *       ],
         *       "variable": {
         *           "name": "z",
         *           "value": 33,
         *           "type": "integer"
         *       }
         *   }
         * }
         */
        this.verifiedDataRef.current = {};
    }

    addToVerifiedParentPaths = (path) => {
        this.setState({verifiedParentPaths: [...this.state.verifiedParentPaths, path]})
    }

    removeFromVerifiedParentPaths = (path) => {
        const updatedVerifiedParentPaths = this.state.verifiedParentPaths.filter((item) => item !== path)
        this.setState({verifiedParentPaths: updatedVerifiedParentPaths})
    }

    render = () => {
        this.props.verifiedDataRef = this.verifiedDataRef;
        this.props.addToVerifiedParentPaths = this.addToVerifiedParentPaths;
        this.props.removeFromVerifiedParentPaths = this.removeFromVerifiedParentPaths;
        this.props.verifiedParentPaths = this.state.verifiedParentPaths;
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
            console.log('verifiedDataRef: ', this.verifiedDataRef.current);
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
                {/* TODO: Remove click me button and function to print */}
                <button onClick={printVerifiedDataRef}>Print verified data ref</button>
            </div>
        );
    };
}
