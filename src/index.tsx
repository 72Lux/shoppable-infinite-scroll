import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

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
  id? : string
}

export interface Props {
  /* Fetch function to fetch more items */
  fetch : Function | Promise<any>,
  /* Whether there are more items to fetch */
  hasMore : boolean,
  /* Fetch function is currently fetching new items */
  searchInProgress : boolean,
  /* Array of items to map over */
  items : Array<any>,
  /* Function to map over items as defined in items parameter */
  renderMap : Function,
  /* Class names for different parent div for items */
  classNames : string,
  /* Object containing various settings for back to top button */
  buttonSettings : ButtonSettings,
  /* Function to return HTML for loading */
  loaderHTML : Function
}

export const ShoppableInfiniteScroll : React.FunctionComponent<Props> = props =>  {
  console.log('props: ', props);
  // @ts-ignore
  // const observer = useRef<IntersectionObserver>()
  const [loader] = useRef<null | IntersectionObserver>(null);
  const [initiateFetch, setInitiateFetch] = useState(false);
  // const [loader, setLoader] = useState();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    // @ts-ignore
    console.log('useLayoytEffect: ', loader.current);
    if (loader.current != null) {
      console.log('loader.current is not null! ');
      // @ts-ignore
      loader.current = document.getElementById('scrollableDiv')
    }
  }, []);

  const handleObserver = useCallback(<T,>(entries : T) => {
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
      el.addEventListener('scroll', toggleVisible)
    } else {
      window.addEventListener('scroll', toggleVisible);
    }
  }, [])

  const toggleVisible = () => {
    // limit at which the back to top will be revealed
    const limit = props.buttonSettings.limit ? props.buttonSettings.limit : 300;

    // @ts-ignore
    let scrolled = props.buttonSettings.id ? document.getElementById(props.buttonSettings.id).scrollTop : document.documentElement.scrollTop;
    if (scrolled > limit) {
      setVisible(true);
    } else if (scrolled <= limit) {
      setVisible(false);
    }
  };

  console.log('before return! ')
  console.log('loader: ', loader)

  return (
    <>
      {props.classNames ?
        <div className={props.classNames}>
          {props.items.map((item, index) => {
            return props.renderMap(item, index);
          })}
        </div> : props.items.map((item, index) => {
          return props.renderMap(item, index);
        })
      }
      {props.searchInProgress ? props.loaderHTML() : <></>}
      {props.buttonSettings.show &&
        <button className={'btn btn-primary back-to-top'}
                onClick={() => {
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
                }}
                style={{
                  display: visible ? 'block' : 'none',
                  backgroundColor: 'rgb(13, 110, 253)',
                  position: 'fixed',
                  width: '44px',
                  padding: '6px',
                  right: props.buttonSettings && props.buttonSettings.right ? props.buttonSettings.right : '0',
                  bottom: props.buttonSettings && props.buttonSettings.bottom ? props.buttonSettings.bottom : '25px',
                  borderWidth: '1px 0',
                  zIndex: '10'
                }}
        >
          <img src={'https://storage.googleapis.com/shoppable-mp/arrow_white.webp'}
               style={{height: '30px', padding: '.5rem'}}
               alt={'Back to top'}/>
        </button>
      }
      <div id={'scrollableDiv'} ref={(x : HTMLDivElement) => {loader.current = x}} style={{height: props.hasMore ? '10px' : '0'}}/>
    </>
  )
}