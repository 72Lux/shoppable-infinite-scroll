# Shoppable Pagination

This project is the for the internal component for infinite scrolling for Shoppable.

## Node 18.10.0

## Install

```  
  npm install --save @shoppable-tools/shoppable-infinite-scroll

  or

  yarn add @shoppable-tools/shoppable-infinite-scroll

  // in code ES6
  import InfiniteScroll from '@shoppable-tools/shoppable-infinite-scroll';
  // or commonjs
  var InfiniteScroll = require('@shoppable-tools/shoppable-infinite-scroll');
```

## props

| Name             | Type           | Description                                                   |
|------------------|----------------|---------------------------------------------------------------|
| fetch            | Function       | Fetch function to fetch more items                            |
| hasMore          | boolean        | Whether or not there are more items to fetch                  |
| searchInProgress | boolean        | Whether or not fetch function is currently fetching new items |
| items            | Array<T>       | Array of items to map over                                    |
| renderMap        | Function       | Function to map over items as defined in items parameter      |
| classNames       | string         | Class names for different parent div for items                |
| buttonSettings   | ButtonSettings | containing various settings for back to top button            |
| loaderHTML       | Function       | Function to return HTML for loading                           |

### ButtonSettings

| Name   | Type    | Description                                                            |
|--------|---------|------------------------------------------------------------------------|
| show   | boolean | Show back to top button                                                |
| right  | string  | How far to position from the right side of the screen                  |
| bottom | string  | How far to position from the bottom of the screen                      |
| limit  | number  | The limit to reveal the back to top button                             |
| id     | string  | If there is a secondary element that needs to be scrolled for the page |