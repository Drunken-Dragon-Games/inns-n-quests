import { ActivitySelection } from "../../inventory-dsl"
import OverworldDropbox from "./overworld-dropbox"
import QuestSheet from "./quest-sheet"

const ActivityView = ({ activity }: { activity?: ActivitySelection }) =>
    activity?.ctype === "overworld-dropbox" ?
        <OverworldDropbox />
    : activity?.ctype === "taken-staking-quest" || activity?.ctype === "available-staking-quest" ?
        <QuestSheet quest={activity} />
    : <></> 

export default ActivityView