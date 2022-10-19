import * as React from 'react'

export interface ButtonSettings {
    /* Show back to top button */
    show?: boolean,
    /* How far to position from the right side of the screen */
    right?: string,
    /* How far to position from the bottom of the screen */
    bottom?: string,
    /* The limit to reveal the back to top button */
    limit?: number,
    /* If there is a secondary element that needs to be scrolled for the page  */
    id?: string
}

export interface Props {
    /* Fetch function to fetch more items */
    fetch: Function | Promise<any>,
    /* Whether there are more items to fetch */
    hasMore: boolean,
    /* Fetch function is currently fetching new items */
    searchInProgress: boolean,
    /* Array of items to map over */
    items: Array<any>,
    /* Function to map over items as defined in items parameter */
    renderMap: Function,
    /* Class names for different parent div for items */
    classNames: string,
    /* Object containing various settings for back to top button */
    buttonSettings: ButtonSettings,
    /* Function to return HTML for loading */
    loaderHTML: Function
}

const ShoppableInfiniteScroll: React.FC<Props> = props => {
    // @ts-ignore
    const observer = React.useRef<T>(null)
    const [initiateFetch, setInitiateFetch] = React.useState(false);
    // const [loader, setLoader] = useState();
    const [visible, setVisible] = React.useState(false);
    const {
        fetch,
        hasMore,
        searchInProgress,
        items,
        buttonSettings,
        renderMap,
        loaderHTML,
        classNames
    } = props

    // track if scrollable div is in view
    const lastItemRef = React.useCallback((node: any) => {
        if (observer.current) observer.current?.disconnect()
        // Error: TS2532: Object is possibly 'undefined'.
        // why it should try to use `observer.current.disconnect()` after if(observer.current) condition

        observer.current = new IntersectionObserver(entries => {
            //Error: TS2322: Type 'IntersectionObserver' is not assignable to type 'undefined'.
            if (entries[0].isIntersecting && hasMore) {
                setInitiateFetch(true); // set true to initiate fetch
            }
        })

        if (node) observer.current?.observe(node)
        // Error TS2532: Object is possibly 'undefined'.
    }, [initiateFetch, hasMore, searchInProgress])

    // initiate fetch if all conditions met
    React.useEffect(() => {
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
            el.addEventListener('scroll', toggleVisible)
        } else {
            window.addEventListener('scroll', toggleVisible);
        }
    }, [buttonSettings.id])

    const toggleVisible = () => {
        // limit at which the back to top will be revealed
        const limit = buttonSettings.limit ? buttonSettings.limit : 300;

        // @ts-ignore
        let scrolled = buttonSettings.id ? document.getElementById(buttonSettings.id).scrollTop : document.documentElement.scrollTop;
        if (scrolled > limit) {
            setVisible(true);
        } else if (scrolled <= limit) {
            setVisible(false);
        }
    };

    return (
        items.length > 0 ?
            <>
                {classNames ?
                    <div className={classNames}>
                        {
                            items.map((item, index) => {
                                return renderMap(item, index);
                            })
                        }
                    </div>
                    :
                    items.map((item, index) => {
                        return renderMap(item, index);
                    })
                }
                {searchInProgress ? loaderHTML() : <></>}
                {buttonSettings.show &&
                  <button className={'btn btn-primary back-to-top'}
                          onClick={() => {
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
                          }}
                          style={{
                              display: visible ? 'block' : 'none',
                              backgroundColor: 'rgb(13, 110, 253)',
                              position: 'fixed',
                              width: '44px',
                              padding: '6px',
                              right: buttonSettings && buttonSettings.right ? buttonSettings.right : '0',
                              bottom: buttonSettings && buttonSettings.bottom ? buttonSettings.bottom : '25px',
                              borderWidth: '1px 0',
                              zIndex: '10'
                          }}
                  >
                    <img src={'https://storage.googleapis.com/shoppable-mp/arrow_white.webp'}
                         style={{height: '30px', padding: '.5rem'}}
                         alt={'Back to top'}
                    />
                  </button>
                }
                <div ref={lastItemRef!} style={{height: hasMore ? '10px' : '0'}}/>
            </>
            : null
    )
}

export default ShoppableInfiniteScroll;