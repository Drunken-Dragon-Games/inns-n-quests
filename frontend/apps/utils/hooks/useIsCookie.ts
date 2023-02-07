import { hasCookie  } from 'cookies-next';

export default (cookie: string) => {

    const isCookie = hasCookie (cookie)

    return isCookie
}