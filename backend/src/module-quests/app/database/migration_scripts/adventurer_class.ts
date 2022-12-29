import { Sequelize } from "sequelize";
import { Adventurer } from "../../../adventurers/models";
import { gmasMetadata, pixelTileClass } from "../../metadata/metadata";

const addAdventurerClass = async (sequelize: Sequelize) => {
    let adventurers: Adventurer[] = await Adventurer.findAll()
    try {
        let dd_class: string;
        let result = await sequelize.transaction(async t => {
            for (let i = 0; i < adventurers.length; i++) {
                if (adventurers[i].type == "gma") { 
                    dd_class = gmasMetadata[adventurers[i].on_chain_ref].class.toLowerCase();
                    await adventurers[i].update({ class: dd_class }, { transaction: t });                 
                }
                else if (adventurers[i].type == "pixeltile") {                    
                    dd_class = pixelTileClass[adventurers[i].on_chain_ref].class.toLowerCase();
                    await adventurers[i].update({ class: dd_class }, { transaction: t });
                }
            }
            return
        })
        console.log("Adventurer Instances successfully updated");
    } catch (error: any) {
        console.log(error.message);
        console.log("Adventurer not updated");
        throw new Error("Adventurer class not added");
    }
}

export default addAdventurerClass