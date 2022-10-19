import * as React from 'react';
const ShoppableInfiniteScroll = props => {
    // @ts-ignore
    const observer = React.useRef(null);
    const [initiateFetch, setInitiateFetch] = React.useState(false);
    // const [loader, setLoader] = useState();
    const [visible, setVisible] = React.useState(false);
    const { fetch, hasMore, searchInProgress, items, buttonSettings, renderMap, loaderHTML, classNames } = props;
    // track if scrollable div is in view
    const lastItemRef = React.useCallback((node) => {
        var _a, _b;
        if (observer.current)
            (_a = observer.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        // Error: TS2532: Object is possibly 'undefined'.
        // why it should try to use `observer.current.disconnect()` after if(observer.current) condition
        observer.current = new IntersectionObserver(entries => {
            //Error: TS2322: Type 'IntersectionObserver' is not assignable to type 'undefined'.
            if (entries[0].isIntersecting && hasMore) {
                setInitiateFetch(true); // set true to initiate fetch
            }
        });
        if (node)
            (_b = observer.current) === null || _b === void 0 ? void 0 : _b.observe(node);
        // Error TS2532: Object is possibly 'undefined'.
    }, [initiateFetch, hasMore, searchInProgress]);
    // initiate fetch if all conditions met
    React.useEffect(() => {
        console.log('fetch: ');
        if (initiateFetch && hasMore && !searchInProgress) {
            // @ts-ignore
            fetch();
        }
        setInitiateFetch(false);
    }, [initiateFetch, hasMore, searchInProgress]);
    // check which dom element needs to be scrolled
    React.useEffect(() => {
        if (buttonSettings.id) {
            const el = document.getElementById(buttonSettings.id);
            // @ts-ignore
            el.addEventListener('scroll', toggleVisible);
        }
        else {
            window.addEventListener('scroll', toggleVisible);
        }
    }, [buttonSettings.id]);
    const toggleVisible = () => {
        // limit at which the back to top will be revealed
        const limit = buttonSettings.limit ? buttonSettings.limit : 300;
        // @ts-ignore
        let scrolled = buttonSettings.id ? document.getElementById(buttonSettings.id).scrollTop : document.documentElement.scrollTop;
        if (scrolled > limit) {
            setVisible(true);
        }
        else if (scrolled <= limit) {
            setVisible(false);
        }
    };
    return (items.length > 0 ?
        React.createElement(React.Fragment, null,
            classNames ?
                React.createElement("div", { className: classNames }, items.map((item, index) => {
                    return renderMap(item, index);
                }))
                :
                    items.map((item, index) => {
                        return renderMap(item, index);
                    }),
            searchInProgress ? loaderHTML() : React.createElement(React.Fragment, null),
            buttonSettings.show &&
                React.createElement("button", { className: 'btn btn-primary back-to-top', onClick: () => {
                        if (buttonSettings.id) {
                            // @ts-ignore
                            document.getElementById(buttonSettings.id).scroll({
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
                        right: buttonSettings && buttonSettings.right ? buttonSettings.right : '0',
                        bottom: buttonSettings && buttonSettings.bottom ? buttonSettings.bottom : '25px',
                        borderWidth: '1px 0',
                        zIndex: '10'
                    } },
                    React.createElement("img", { src: 'https://storage.googleapis.com/shoppable-mp/arrow_white.webp', style: { height: '30px', padding: '.5rem' }, alt: 'Back to top' })),
            React.createElement("div", { ref: lastItemRef, style: { height: hasMore ? '10px' : '0' } }))
        : null);
};
export default ShoppableInfiniteScroll;
//# sourceMappingURL=index.js.map