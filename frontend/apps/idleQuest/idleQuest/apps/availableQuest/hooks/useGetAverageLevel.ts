import { useState, useEffect } from "react"
import { useGeneralSelector, useGeneralDispatch } from "../../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../../features/generalReducer"


interface DataAdventurer{
    id: string
    name: string,
    experience: number
    adventurer_img: string
    in_quest: boolean
    on_chain_ref: string
    onRecruitment?: boolean
    sprites: string
    type: "pixeltile" | "gma"
    metadata: metadata
    race: string
    class: string
}

interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
}

interface enrolls{
    adventurer: adventurer
    adventurer_id: string
    taken_quest_id: string
}

interface adventurer{
    experience: number
    id: string
    in_quest: boolean
    metadata: metadata
    on_chain_ref: string
    player_stake_address: string
    type: "pixeltile" | "gma"
}

interface metadata{
    is_alive?: boolean,
    dead_cooldown?: number
}

export default (slots: number, adventurerList: (string | undefined) [] | enrolls [], type: "available" | "inProgress") => {
    
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    const allAdventurer = generalSelector.idleQuest.adventurers.data.data
    
    const [averageLevel, setAverageLevel] = useState<number>(0)
    

    //este efecto se activa cuando cambia la lista de aventuraros
    useEffect(()=>{

        if(type == "available"){
            getAverageLevelAvailable()
        } else if (type == "inProgress"){
            getAverageLevelInProgress()
        }
        
    },[adventurerList])


    //funcion cuando es inProgress el quest cambia la forma de sumar debido al cambio de lista
    const getAverageLevelInProgress = () =>{
        
        const levelSum = (adventurerList as enrolls []).reduce((acc: number, adventurer) => {
            
            const level = getLevelFromXp(adventurer.adventurer.experience)
            
            return acc + level
            
        }, 0);


        const average = levelSum / slots

        setAverageLevel(average)
        
    }

    


    //funcion cuando es available el quest cambia la forma de sumar debido al cambio de lista
    const getAverageLevelAvailable = () =>{
        
        const levelSum = (adventurerList as string []).reduce((acc: number, id: string) => {
            
            const filterAdventurer = allAdventurer.filter((adventurer: DataAdventurer) => adventurer.id == id)
            

            if(filterAdventurer.length == 1){
                const level = getLevelFromXp(filterAdventurer[0].experience)
                return acc + level
            }
            
            return acc
            
        }, 0);


        const average = levelSum / slots

        setAverageLevel(average)
        
    }

    return [averageLevel]
}

function getLevelFromXp(xp: number): number {
    if (xp === 0) return 1
    const roots = cubicSolver(10/3, 55, 155/3, -xp);
    const realRoots = roots.map(root => {
        return root.real;
    })
    
    const root = realRoots.find(root => root >= 0)
    
    return Math.floor(root! + 1);
}

function cubicSolver(a:number, b:number, c:number, d:number){

    b /= a;
    c /= a;
    d /= a;
  
    var discrim, q, r, dum1, s, t, term1, r13;
  
    q = (3.0*c - (b*b))/9.0;
    r = -(27.0*d) + b*(9.0*c - 2.0*(b*b));
    r /= 54.0;
  
    discrim = q*q*q + r*r;
    
    var roots = [ {real: 0, i: 0}, {real: 0, i: 0}, {real: 0, i: 0} ]
    
    term1 = (b/3.0);
  
    if (discrim > 0) { // one root real, two are complex
     s = r + Math.sqrt(discrim);
     s = ((s < 0) ? -Math.pow(-s, (1.0/3.0)) : Math.pow(s, (1.0/3.0)));
     t = r - Math.sqrt(discrim);
     t = ((t < 0) ? -Math.pow(-t, (1.0/3.0)) : Math.pow(t, (1.0/3.0)));
     
     roots[0].real = -term1 + s + t;
     term1 += (s + t)/2.0;
     roots[1].real = roots[2].real = -term1;
     term1 = Math.sqrt(3.0)*(-t + s)/2;
     
     roots[1].i = term1;
     roots[2].i = -term1;
     return roots;
    } // End if (discrim > 0)
  
    // The remaining options are all real
    
  
    if (discrim == 0){ // All roots real, at least two are equal.
     r13 = ((r < 0) ? -Math.pow(-r,(1.0/3.0)) : Math.pow(r,(1.0/3.0)));
     roots[0].real = -term1 + 2.0*r13;
     roots[2].real = roots[1].real = -(r13 + term1);
     return roots;
    } // End if (discrim == 0)
  
    // Only option left is that all roots are real and unequal (to get here, q < 0)
    q = -q;
    dum1 = q*q*q;
    dum1 = Math.acos(r/Math.sqrt(dum1));
    r13 = 2.0*Math.sqrt(q);
    
    roots[0].real = -term1 + r13*Math.cos(dum1/3.0);
    roots[1].real = -term1 + r13*Math.cos((dum1 + 2.0*Math.PI)/3.0);
    roots[2].real = -term1 + r13*Math.cos((dum1 + 4.0*Math.PI)/3.0);
    
    return roots;
  }