import { Sequelize } from "sequelize";
import { Adventurer } from "../../../adventurers/models";
import { gmasMetadata, pixelTileClass } from "../../metadata/metadata";

const addAdventurerRace = async (sequelize: Sequelize) => {
    let adventurers: Adventurer[] = await Adventurer.findAll()
    try {
        let race: string
        await sequelize.transaction(async t => {
            for (let i = 0; i < adventurers.length; i++) {
                if (adventurers[i].type == "gma") { 
                    race = gmasMetadata[adventurers[i].on_chain_ref].race.toLowerCase();
                    await adventurers[i].update({ race: race }, { transaction: t });                 
                }
                else if (adventurers[i].type == "pixeltile") {                    
                    race = pixelTileClass[adventurers[i].on_chain_ref].race.toLowerCase();
                    await adventurers[i].update({ race: race }, { transaction: t });
                }
            }
            return
        })
        console.log("Adventurer Instances successfully updated")
    } catch (error: any) {
        console.log(error.message)
        console.log("Adventurer not updated");
        throw new Error("Adventurer class not added");
    }
}

export default addAdventurerRace