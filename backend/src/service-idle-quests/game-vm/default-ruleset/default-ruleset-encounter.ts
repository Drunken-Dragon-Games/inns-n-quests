import { CharacterEntity } from "../character-entity";
import { EncounterOutcome, noEncounterReward, Strategy } from "../encounter";
import { EncounterRuleset } from "../iq-ruleset"

export default class DefaultEncounterRuleset implements EncounterRuleset {
    
    constructor(
    ){}

    outcome(encounter: Strategy, party: CharacterEntity[]): EncounterOutcome {
        return { ctype: "success-outcome", party, reward: noEncounterReward }
    }
}