import { useTema } from "../context/TemaContext";
 
function CompTema(){
    const{tema, cambiarTema} = useTema();
 
    return(
        <button onClick={cambiarTema} className="btn-tema">
        Modo { tema==="light" ? "oscuro" : "claro"}
        </button>
    );
}
 
export default CompTema;
