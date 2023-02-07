import { EnrollsType } from "../../../../../../types/idleQuest"

export default (enrols: EnrollsType []) => {
      
    const adventurerEnrolls = enrols.map( enrol => {
        return enrol.adventurer_id
    })

    return adventurerEnrolls
}