'use strict';

//import react and reactDom for browser rendering
import React from 'react';
import ReactDom from 'react-dom';

import Moment from 'moment';

//import the react-json-view component (installed with npm)
import JsonViewer from './../../src/js/index';

//just a function to get an example JSON object
function getExampleJson1() {
    return {
        a: 1,
        b: {
            k: [
                [
                    [
                        'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'
                    ]
                ]
            ],
            1: 'one',
            c: 3,
            d: [
                'x',
                'y',
                'z'
            ],
            e: [
                {
                    x: 11
                },
                {
                    y: 22
                },
                {
                    z: 33
                },
            ],
        },
    };
}

//render 2 different examples of the react-json-view component
ReactDom.render(
    <div>
        {/* just pass in your JSON to the src attribute */}
        <JsonViewer
            sortKeys
            enableVerifyIcon
            style={{ padding: '30px', backgroundColor: 'white' }}
            src={getExampleJson1()}
            quotesOnKeys={false}
            collapseStringsAfterLength={12}
            // onEdit={e => {
            //     console.log('edit callback', e);
            //     if (e.new_value == 'error') {
            //         return false;
            //     }
            // }}
            // onDelete={e => {
            //     console.log('delete callback', e);
            // }}
            // onAdd={e => {
            //     console.log('add callback', e);
            //     if (e.new_value == 'error') {
            //         return false;
            //     }
            // }}
            // onSelect={e => {
            //     console.log('select callback', e);
            //     console.log(e.namespace);
            // }}
            displayObjectSize={true}
            // name={'dev-server'}
            name={'root'}
            enableClipboard={false}
            // enableClipboard={copy => {
            //     console.log('you copied to clipboard!', copy);
            // }}
            shouldCollapse={({ src, namespace, type }) => {
                if (type === 'array' && src.indexOf('test') > -1) {
                    return true;
                } else if (namespace.indexOf('moment') > -1) {
                    return true;
                }
                return false;
            }}
            defaultValue=""
        />
    </div>,
    document.getElementById('app-container')
);