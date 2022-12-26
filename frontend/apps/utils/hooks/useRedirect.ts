import { useRouter } from "next/router";

//no tiene input y regresa una funcion
export default () => {
    const router = useRouter()

    //recive una ruta y redirige a esa ruta
    const redirectPath = (route: string) => {
        router.push({
            pathname: route,
        });
    }

    const redirectUrl = (url: string) => {
        router.push(url)
    }

    return [redirectPath, redirectUrl]
}

