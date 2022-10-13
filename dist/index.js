import React, { useCallback, useEffect, useRef, useState } from "react";
export var ShoppablePagination = function (props) {
    var loader = useRef(null);
    var _a = useState(false), initiateFetch = _a[0], setInitiateFetch = _a[1];
    var _b = useState(false), visible = _b[0], setVisible = _b[1];
    var handleObserver = useCallback(function (entries) {
        // @ts-ignore
        if (entries[0] && entries[0].isIntersecting) {
            setInitiateFetch(true); // set true to initiate fetch
        }
    }, []);
    // track if scrollable div is in view
    useEffect(function () {
        var observer = new IntersectionObserver(handleObserver);
        if (loader.current) {
            observer.observe(loader.current);
        }
    }, [handleObserver]);
    // initiate fetch if all conditions met
    useEffect(function () {
        if (initiateFetch && props.hasMore && !props.searchInProgress) {
            // @ts-ignore
            props.fetch();
        }
        setInitiateFetch(false);
    }, [initiateFetch, props.hasMore, props.searchInProgress]);
    // check which dom element needs to be scrolled
    useEffect(function () {
        if (props.buttonSettings.id) {
            var el = document.getElementById(props.buttonSettings.id);
            // @ts-ignore
            el.addEventListener('scroll', toggleVisible);
        }
        else {
            window.addEventListener('scroll', toggleVisible);
        }
    }, []);
    var toggleVisible = function () {
        // limit at which the back to top will be revealed
        var limit = props.buttonSettings.limit ? props.buttonSettings.limit : 300;
        // @ts-ignore
        var scrolled = props.buttonSettings.id ? document.getElementById(props.buttonSettings.id).scrollTop : document.documentElement.scrollTop;
        if (scrolled > limit) {
            setVisible(true);
        }
        else if (scrolled <= limit) {
            setVisible(false);
        }
    };
    return (React.createElement(React.Fragment, null,
        props.classNames ?
            React.createElement("div", { className: props.classNames }, props.items.map(function (item, index) {
                return props.renderMap(item, index);
            })) : props.items.map(function (item, index) {
            return props.renderMap(item, index);
        }),
        props.searchInProgress ? props.loaderHTML() : React.createElement(React.Fragment, null),
        props.buttonSettings.show &&
            React.createElement("button", { className: 'btn btn-primary back-to-top', onClick: function () {
                    if (props.buttonSettings.id) {
                        // @ts-ignore
                        document.getElementById(props.buttonSettings.id).scroll({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                    window.scroll({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, style: {
                    display: visible ? 'block' : 'none',
                    backgroundColor: 'rgb(13, 110, 253)',
                    position: 'fixed',
                    width: '44px',
                    padding: '6px',
                    right: props.buttonSettings && props.buttonSettings.right ? props.buttonSettings.right : '0',
                    bottom: props.buttonSettings && props.buttonSettings.bottom ? props.buttonSettings.bottom : '25px',
                    borderWidth: '1px 0',
                    zIndex: '10'
                } },
                React.createElement("img", { src: 'https://storage.googleapis.com/shoppable-mp/arrow_white.webp', style: { height: '30px', padding: '.5rem' }, alt: 'Back to top' })),
        React.createElement("div", { id: 'scrollableDiv', ref: loader, style: { height: props.hasMore ? '10px' : '0' } })));
};
