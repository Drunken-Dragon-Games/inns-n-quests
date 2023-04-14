import { Policy } from "../app/types.js";

// FUNCTION THAT CALCULATES THE EXPERIENCE REQUIRED TO LEVEL UP
/*
THE EQUATION TO CALCULATE THE EXPERIENCE CHANGES
DEPENDING ON THE ADVENTURER LEVEL
*/
function getExperienceRequired(level: number): number {
    // let experience = 10*level*(level + 10);
    let experience = 10*((level*(level+1)*(2*level+1)/6)+(10*(level*(level+1)/2)));
    return experience;
}

// FUNCTION THAT CALCULATES THE LEVEL OF AN ADVENTURER
function calculateLevel(totalExperience: number): number {
    let newLevel: number = getLevelFromXp(totalExperience);

    /*
    THIS LOOP MAKES SURE THAT MORE THAN ONE LEVEL IS ADDED
    IF APPLICABLE
    */
    while (totalExperience >= getExperienceRequired(newLevel)) {
        newLevel++;
    }
    return newLevel;
}

// FUNCTION THAT CALCULATES THE LEVEL BASED ON THE EXPERIENCE
function getLevelFromXp(xp: number): number {
    if (xp === 0) return 1
    const roots = cubicSolver(10/3, 55, 155/3, -xp);
    const realRoots = roots.map(root => {
        return root.real;
    })
    
    const root = realRoots.find(root => root >= 0)
    
    return Math.floor(root! + 1);
}

// CALCULATES IF ADVENTURER DIED DURING QUEST
function adventurerDeath(currentLevel: number, questLevel: number): boolean {
    let randomnumber = Math.random();
    let deathProbability = 0.3 + (questLevel - currentLevel)/10; // DEATH EQUATION
    return deathProbability > randomnumber;
}


// SETS COOLDOWN OF DEATH GMA
const calculateDeathCooldown = (experience: number): number => {
    // ON TESTNET THE COOLDOWN IS SET TO 5 MIN, ON MAINNET THE REAL COOLDOWN EQUATION IS USED
    let cooldown = process.env.CARDANO_NETWORK == "mainnet" ?  Date.now() + (((calculateLevel(experience))^(1/2)) * 2) * 60 * 60 * 1000 : Date.now() + 5 * (60000);
    return cooldown;
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

const getAdventurerPolicies = (): Policy => {
    const policies: Policy = {
        pixeltiles: stringOrError("POLICY_PIXEL_TILES"),
        gmas: stringOrError("POLICY_GRAND_MASTER_ADVENTURERS"),
        aots: stringOrError("POLICY_ADVENTURERS_OF_THIOLDEN")
    }
    return policies
}

const stringOrError = (varKey: string): string => {
    const varVal = process.env[varKey]
    if (varVal === undefined)
        throw new Error(`While configuring application, expected environment variable '${varKey}' (string) but was not set`)
    else 
        return varVal
}

export {
    getExperienceRequired,
    calculateLevel,
    getLevelFromXp,
    calculateDeathCooldown,
    adventurerDeath,
    getAdventurerPolicies
}