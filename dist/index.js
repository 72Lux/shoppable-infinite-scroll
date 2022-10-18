import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
export const ShoppableInfiniteScroll = props => {
    console.log('props: ', props);
    // @ts-ignore
    const [loader] = useRef({ current: null | undefined });
    const [initiateFetch, setInitiateFetch] = useState(false);
    // const [loader, setLoader] = useState();
    const [visible, setVisible] = useState(false);
    useLayoutEffect(() => {
        // @ts-ignore
        console.log('useLayoytEffect: ', loader.current);
        if (loader.current != null) {
            console.log('loader.current is not null! ');
            // @ts-ignore
            loader.current = document.getElementById('scrollableDiv');
        }
    }, []);
    const handleObserver = useCallback((entries) => {
        // @ts-ignore
        if (entries[0] && entries[0].isIntersecting) {
            setInitiateFetch(true); // set true to initiate fetch
        }
    }, []);
    // track if scrollable div is in view
    useEffect(() => {
        console.log('Observe div: ');
        const observer = new IntersectionObserver(handleObserver);
        if (loader.current != null) {
            console.log('Observe loader.current: ');
            observer.observe(loader.current);
        }
    }, [handleObserver]);
    // initiate fetch if all conditions met
    useEffect(() => {
        console.log('fetch: ');
        if (initiateFetch && props.hasMore && !props.searchInProgress) {
            // @ts-ignore
            props.fetch();
        }
        setInitiateFetch(false);
    }, [initiateFetch, props.hasMore, props.searchInProgress]);
    // check which dom element needs to be scrolled
    useEffect(() => {
        if (props.buttonSettings.id) {
            const el = document.getElementById(props.buttonSettings.id);
            // @ts-ignore
            el.addEventListener('scroll', toggleVisible);
        }
        else {
            window.addEventListener('scroll', toggleVisible);
        }
    }, []);
    const toggleVisible = () => {
        // limit at which the back to top will be revealed
        const limit = props.buttonSettings.limit ? props.buttonSettings.limit : 300;
        // @ts-ignore
        let scrolled = props.buttonSettings.id ? document.getElementById(props.buttonSettings.id).scrollTop : document.documentElement.scrollTop;
        if (scrolled > limit) {
            setVisible(true);
        }
        else if (scrolled <= limit) {
            setVisible(false);
        }
    };
    console.log('before return! ');
    console.log('loader: ', loader);
    return (React.createElement(React.Fragment, null,
        props.classNames ?
            React.createElement("div", { className: props.classNames }, props.items.map((item, index) => {
                return props.renderMap(item, index);
            })) : props.items.map((item, index) => {
            return props.renderMap(item, index);
        }),
        props.searchInProgress ? props.loaderHTML() : React.createElement(React.Fragment, null),
        props.buttonSettings.show &&
            React.createElement("button", { className: 'btn btn-primary back-to-top', onClick: () => {
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
        React.createElement("div", { id: 'scrollableDiv', ref: (x) => { loader.current = x; }, style: { height: props.hasMore ? '10px' : '0' } })));
};
