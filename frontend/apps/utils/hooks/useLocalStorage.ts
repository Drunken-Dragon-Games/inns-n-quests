interface localStorage{
    setLocalStorage: (name: string, value: string ) => void
    deleteLocalStorage: (name: string) => void
    getLocalStorage: (name: string) => string | null
}

export default (): localStorage => {
    
    const setLocalStorage = (name: string, value: string ) =>{
        localStorage.setItem(name, value)
    }

    const deleteLocalStorage = (name: string) =>{ 
        localStorage.removeItem(name)
    }

    const getLocalStorage = (name: string): string | null=>{ 
        const item: string | null = localStorage.getItem(name)

        return item
    }
   
    return {setLocalStorage, deleteLocalStorage, getLocalStorage}

}