import * as React from 'react';
export interface ButtonSettings {
    show?: boolean;
    right?: string;
    bottom?: string;
    limit?: number;
    id?: string;
}
export interface Props {
    fetch: Function | Promise<any>;
    hasMore: boolean;
    searchInProgress: boolean;
    items: Array<any>;
    renderMap: Function;
    classNames: string;
    buttonSettings: ButtonSettings;
    loaderHTML: Function;
}
declare const ShoppableInfiniteScroll: React.FC<Props>;
export default ShoppableInfiniteScroll;
