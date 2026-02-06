import { createContext, useContext, useState, useEffect } from "react"; // <-- Importar useEffect

// crear el context global
const TemaContext = createContext();

// generar el provider del contexto
export function TemaProvider({ children }){
    // crear hooks guardar el estado del tema (light,dark)
    const[tema, setTema] = useState("light");

    // VALIDACIÓN CLAVE: Aplicar la clase al BODY
    useEffect(() => {
        // Establece la clase 'light' o 'dark' en el elemento body
        document.body.className = tema;
    }, [tema]); // Se ejecuta cada vez que 'tema' cambia

    // validar el tema actual para cambiarlo
    function cambiarTema(){
        setTema((prev)=>(prev==="light" ? "dark" : "light"));
    }

    return(
        // compartir el estado en todo el sistema
        <TemaContext.Provider value={{tema, cambiarTema}}>
            {/* 
            IMPORTANTE: Ya no necesitamos el div envolvente aquí, 
            porque la clase se aplica directamente al body.
            */}
            { children }
        </TemaContext.Provider>
    );
}

export function useTema(){
    return useContext(TemaContext);
}
