import React from 'react';
import JsonObject from './DataTypes/Object';
import ArrayGroup from './ArrayGroup';
import { Splitscreen } from '@mui/icons-material';
import { isTheme } from '../helpers/util';
import _ from 'lodash';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        // this.state = {
        //     verifiedParentPaths: {},
        //     verifiedData: {},
        // }

        /**
         * verifiedData
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
    }

    initialState = {
        verifiedParentPaths: {},
        verifiedData: {},
    }

    addVerifiedData = (key, value) => {
        const printValue = () => {
            // console.log('add verifiedData: ', this.state.verifiedData);
        }
        const data = {};
        data[key] = value;
        this.setState({verifiedData: {...this.state.verifiedData, ...data}}, printValue)
    }

    removeVerifiedData = (key) => {
        const printValue = () => {
            // console.log('remove verifiedData: ', this.state.verifiedData);
        }
        const copy = {...this.state.verifiedData};
        delete copy[key];
        this.setState({verifiedData: copy}, printValue)
    }

    /**
     * { path: { explicit: true } }
     */
    addToVerifiedParentPaths = (pathObject) => {
        if (_.size(pathObject) > 1) throw new Error('cant add multiple parent paths at once')
        const printValue = () => {
            // console.log('add verifiedParentPaths: ', this.state.verifiedParentPaths);
        }

        const pathAlreadyPresent = Object.keys(this.state.verifiedParentPaths).some((verifiedParentPath) => verifiedParentPath === Object.keys(pathObject)[0]);

        if(!pathAlreadyPresent) {
            this.setState({verifiedParentPaths: {...this.state.verifiedParentPaths, ...pathObject}}, printValue)
        }
    }

    removeFromVerifiedParentPaths = (path) => {
        // if (_.size(pathObject) > 1) throw new Error('cant remove multiple parent paths at once')
        const printValue = () => {
            console.log('remove verifiedParentPaths: ', this.state.verifiedParentPaths);
        }
        const updatedVerifiedParentPaths = _.cloneDeep(this.state.verifiedParentPaths)
        delete updatedVerifiedParentPaths[path]
        // const updatedVerifiedParentPaths = this.state.verifiedParentPaths.filter((item) => item !== path)
        this.setState({verifiedParentPaths: updatedVerifiedParentPaths}, printValue)
    }

    isSubParentSelected = (path) => {
        return Object.keys(this.state.verifiedParentPaths).some((verifiedParentPath) => verifiedParentPath.match(new RegExp(`^${path}\..+`)));
    }

    getSelfSelectionInfo = (path) => {
        return this.state.verifiedParentPaths[path];
    }
    
    inClearState = () => {
        return _.size(this.state.verifiedData) === 0 && _.size(this.state.verifiedParentPaths) === 0;
    }

    render = () => {
        this.props.addVerifiedData = this.addVerifiedData;
        this.props.removeVerifiedData = this.removeVerifiedData;
        this.props.verifiedData = this.state.verifiedData;

        this.props.inClearState = this.inClearState;

        this.props.addToVerifiedParentPaths = this.addToVerifiedParentPaths;
        this.props.removeFromVerifiedParentPaths = this.removeFromVerifiedParentPaths;
        this.props.isSubParentSelected = this.isSubParentSelected;
        this.props.getSelfSelectionInfo = this.getSelfSelectionInfo;
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

        const printVerifiedData = () => {
            console.log('verifiedData: ', this.state.verifiedData);
        }
        const printVerifiedParentPaths = () => {
            console.log('verifiedParentPaths: ', this.state.verifiedParentPaths);
        }
        const removeAllSelections = () => {
            this.setState(this.initialState)
            // Object.keys(this.state.verifiedParentPaths).forEach((path) => this.removeFromVerifiedParentPaths(path));
            // Object.keys(this.state.verifiedData).forEach((path) => this.removeVerifiedData(path));

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
                <button onClick={printVerifiedData}>Print verified data</button>
                <button onClick={printVerifiedParentPaths}>Print verified parent paths</button>
                <button onClick={removeAllSelections}>Clear</button>
            </div>
        );
    };
}
