// in pockitux
const SET = Symbol('SET_POCKITUX_PROPERTY');

function assertValidReducerName(reducerName) {
    if (typeof reducerName !== 'string') {
        throw new Error(`Pockitux.setState received an invalid first argument.
            The first argument should be a string (matching the name of a reducer in the store) but was ${typeof payload}.`.replace(/\s\s+/g, ' '));
    } else if (reducerName.length === 0) {
        throw new Error(`Pockitux.setState received an invalid first argument.
            The first argument should be a string (matching the name of a reducer in the store) but the string was empty.`.replace(/\s\s+/g, ' '));
    }
}

function assertValidPayload(payload) {
    if (typeof payload !== 'object') {
        throw new Error(`Pockitux.setState received an invalid second argument. The second argument should be an object, but was of type ${typeof payload}.`);
    } else if (payload === null) {
        throw new Error(`Pockitux.setState received an invalid second argument. The second argument should be a non-null object, but was null.`);
    }
}

export const setState = (reducerName, payload) => {
    assertValidReducerName(reducerName);
    assertValidPayload(payload);

    dispatch({
        SET,
        payload,
        reducerName
    });
};

export const createPockituxReducer = (reducerName, initialState = {}, getValidator = () => {}) => {

    const assertAcceptance = (props) => {
        const errorMessages = Object.keys(props)
            .filter(key =>
                true !== getValidator(key)(props[key])
            )
            .map(key =>
                `Property ${key} received an unacceptable value ${props[key]}. Reason: ${getValidator(key)(props[key]) || 'unknown'}.`
            );

        switch (errorMessages.length) {
            case 0:
                return; // ACCEPTED
            case 1:
                throw new Error('Failed to update prop: ' + errorMessages[0]);
            default:
                throw new Error('Failed to update multiple props: \n\t¤' + errorMessages.join('\n\t¤'));
        }
    }

    return (state = { ...initialState }, action) => {
        if (action.type === SET && action.reducerName = reducerName) {
            assertAcceptance(action.payload);

            return {
                ...state,
                ...action.payload
            };
        } else {
            return state;
        }
    }
}



// in store.js
const flags = createPockituxReducer('flags', {
    // ... rules?
});

const store = createStore(combineReducers({
    flags, // <- our pockituxReducer
    someOtherReducer,
    complicatedState
}));

export default store;



// anywhere
import { setState } from 'pockitux';

dispatch(setState('flags', {
    readyToRumble: true
}));



// anywhere
import store from 'store';

store.subscribe(() => {
    if (store.getState().flags.readyToRumble) {
        console.debug('``*¤,,¤*``*¤,,¤*  READY TO RUMBLE  ¤*``*¤,,¤*``*¤,,');
    }
});



// with react-redux' connect ("Smart" way)
import React from 'react';

const Rumble = ({ readyToRumble, toggleReadyToRumble }) => (
    <div onClick={toggleReadyToRumble}>
        {!readyToRumble ? (
            ' . . . . . . . .  LETS . . . GET  . . . . . . . . '
        ) : (
            '``*¤,,¤*``*¤,,¤*  READY TO RUMBLE  ¤*``*¤,,¤*``*¤,,'
        )}
    </div>
);

import { connect } from 'react-redux';
import { setState } from 'pockitux';

const mapStateToProps = (store) => {
    const { readyToRumble } = store.flags;
    return { readyToRumble };
};

const mapDispatchToProps = (dispatch) => ({
    setFlags(flagsUpdate) {
        dispatch(setState('flags', flagsUpdate));
    }
});

const mergeProps = (stateProps, dispatchProps) => ({
    ...stateProps,
    toggleReadyToRumble() {
        dispatchProps.setFlags({
            readyToRumble: !stateProps.readyToRumble
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Rumble);



// with react-redux' connect (Simple way)
import React from 'react';

const Rumble = ({ flags, setFlags }) => (
    <div onClick={() => setFlags({ readyToRumble: !flags.readyToRumble })}>
        {!flags.readyToRumble ? (
            ' . . . . . . . .  LETS . . . GET  . . . . . . . . '
        ) : (
            '``*¤,,¤*``*¤,,¤*  READY TO RUMBLE  ¤*``*¤,,¤*``*¤,,'
        )}
    </div>
);

import { connect } from 'react-redux';
import { setState } from 'pockitux';

const mapStateToProps = (store) => ({
    flags: store.flags
});

const mapDispatchToProps = (dispatch) => ({
    setFlags(flagsUpdate) {
        dispatch(setState('flags', flagsUpdate));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Rumble);
