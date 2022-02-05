export declare function ReducerSyncWithStorage(reducerFunction: Function, { keysToBeSync, initialState, storageKeyName, storage, beforeSettingInitialState, }: {
    keysToBeSync?: string[];
    initialState?: Object;
    storageKeyName?: string;
    storage?: Storage;
    beforeSettingInitialState?: Function;
}): (state: Object, action: Object) => any;
declare const _default: {
    ReducerSyncWithStorage: typeof ReducerSyncWithStorage;
};
export default _default;
