"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var ShoppableInfiniteScroll = function (props) {
    // @ts-ignore
    var observer = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)(false), initiateFetch = _a[0], setInitiateFetch = _a[1];
    // const [loader, setLoader] = useState();
    var _b = (0, react_1.useState)(false), visible = _b[0], setVisible = _b[1];
    var fetch = props.fetch, hasMore = props.hasMore, searchInProgress = props.searchInProgress, items = props.items, buttonSettings = props.buttonSettings, renderMap = props.renderMap, loaderHTML = props.loaderHTML, classNames = props.classNames;
    // track if scrollable div is in view
    var lastItemRef = (0, react_1.useCallback)(function (node) {
        var _a, _b;
        if (observer.current)
            (_a = observer.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        // Error: TS2532: Object is possibly 'undefined'.
        // why it should try to use `observer.current.disconnect()` after if(observer.current) condition
        observer.current = new IntersectionObserver(function (entries) {
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
    (0, react_1.useEffect)(function () {
        console.log('fetch: ');
        if (initiateFetch && hasMore && !searchInProgress) {
            // @ts-ignore
            fetch();
        }
        setInitiateFetch(false);
    }, [initiateFetch, hasMore, searchInProgress]);
    // check which dom element needs to be scrolled
    (0, react_1.useEffect)(function () {
        if (buttonSettings.id) {
            var el = document.getElementById(buttonSettings.id);
            // @ts-ignore
            el.addEventListener('scroll', toggleVisible);
        }
        else {
            window.addEventListener('scroll', toggleVisible);
        }
    }, [buttonSettings.id]);
    var toggleVisible = function () {
        // limit at which the back to top will be revealed
        var limit = buttonSettings.limit ? buttonSettings.limit : 300;
        // @ts-ignore
        var scrolled = buttonSettings.id ? document.getElementById(buttonSettings.id).scrollTop : document.documentElement.scrollTop;
        if (scrolled > limit) {
            setVisible(true);
        }
        else if (scrolled <= limit) {
            setVisible(false);
        }
    };
    return (items.length > 0 ?
        react_1.default.createElement(react_1.default.Fragment, null,
            classNames ?
                react_1.default.createElement("div", { className: classNames }, items.map(function (item, index) {
                    return renderMap(item, index);
                }))
                :
                    items.map(function (item, index) {
                        return renderMap(item, index);
                    }),
            searchInProgress ? loaderHTML() : react_1.default.createElement(react_1.default.Fragment, null),
            buttonSettings.show &&
                react_1.default.createElement("button", { className: 'btn btn-primary back-to-top', onClick: function () {
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
                    react_1.default.createElement("img", { src: 'https://storage.googleapis.com/shoppable-mp/arrow_white.webp', style: { height: '30px', padding: '.5rem' }, alt: 'Back to top' })),
            react_1.default.createElement("div", { ref: lastItemRef, style: { height: hasMore ? '10px' : '0' } }))
        : null);
};
exports.default = ShoppableInfiniteScroll;
//# sourceMappingURL=index.js.map