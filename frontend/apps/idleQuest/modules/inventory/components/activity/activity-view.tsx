import QuestSheet from "./quest-sheet"

const ActivityView = () =>
    <div onClick={(e) => e.stopPropagation()}>
        <QuestSheet />
    </div>

export default ActivityView