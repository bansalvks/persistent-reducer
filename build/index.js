function filterKeys({ keysToKeep = [], target = {} }) {
    const output = Object.assign({}, target);
    for (const key in output) {
        if (Object.prototype.hasOwnProperty.call(output, key)) {
            if (!keysToKeep.includes(key)) {
                delete output[key];
            }
        }
    }
    return output;
}
function getStateFromStorage({ key, storage }) {
    const initialStateFromStorageString = storage.getItem(key);
    try {
        if (initialStateFromStorageString) {
            return JSON.parse(initialStateFromStorageString);
        }
    }
    catch (error) {
        console.error('state is not json', error);
    }
    return null;
}
function setStateToStorage({ key, storage, target, keysToBeSync, }) {
    try {
        const objectToSync = keysToBeSync ? filterKeys({
            keysToKeep: keysToBeSync,
            target,
        }) : target;
        const valueAsString = JSON.stringify(objectToSync);
        storage.setItem(key, valueAsString);
        return true;
    }
    catch (error) {
        console.error('state is not set to storage', error);
    }
    return null;
}
export function ReducerSyncWithStorage(reducerFunction, { keysToBeSync = [], initialState = {}, storageKeyName, storage, beforeSettingInitialState, }) {
    if (!storageKeyName) {
        throw new Error('Please provide a unique storageKeyName');
    }
    if (!storage) {
        throw new Error('storage is not provided');
    }
    if (!storage.getItem) {
        throw new Error('storage does not has "getItem" function');
    }
    if (!storage.setItem) {
        throw new Error('storage does not has "setItem" function');
    }
    if (keysToBeSync && !Array.isArray(keysToBeSync)) {
        throw new Error('keysToBeSync should be an "Array"');
    }
    if (initialState && Object.prototype.toString.call(initialState) !== '[object Object]') {
        throw new Error('keysToBeSync should be an "Object"');
    }
    let initialStateFromStorageObject = getStateFromStorage({
        key: storageKeyName,
        storage,
    }) || {};
    // initialStateFromStorageObject might not have all the keys as user might storing only a few keys from reducer
    initialStateFromStorageObject = Object.assign(Object.assign({}, initialState), initialStateFromStorageObject);
    // let the user do something with the initial state
    if (beforeSettingInitialState) {
        initialStateFromStorageObject = beforeSettingInitialState(initialStateFromStorageObject);
    }
    let prevState = initialStateFromStorageObject;
    const reducer = (state, action) => {
        const newState = reducerFunction(state || initialStateFromStorageObject, action);
        if (newState !== prevState) {
            setStateToStorage({
                key: storageKeyName,
                storage,
                target: newState,
                keysToBeSync,
            });
            prevState = newState;
        }
        return newState;
    };
    return reducer;
}
export default {
    ReducerSyncWithStorage,
};
