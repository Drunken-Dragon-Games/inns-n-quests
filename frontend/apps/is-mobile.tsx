import { createContext, useContext, useEffect, useState } from "react"
import { GetServerSidePropsContext } from "next"
import { getSelectorsByUserAgent } from "react-device-detect"

export const getIsSsrMobile = (context: GetServerSidePropsContext): boolean => {
  const { isMobile } = getSelectorsByUserAgent(context.req.headers["user-agent"] as string)
  return Boolean(isMobile)
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Don't forget to remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export const IsSsrMobileContext = createContext(false);

export const useIsMobile = (): boolean => {
  const isSsrMobile = useContext(IsSsrMobileContext)
  //const { width: windowWidth } = useWindowSize()
  //const isBrowserMobile = !!windowWidth && windowWidth < 768
  return isSsrMobile //|| isBrowserMobile
}
