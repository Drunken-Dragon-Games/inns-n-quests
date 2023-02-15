
export type QuestRequirement 
    = APSRequirement | ClassRequirement | OrRequirement | AndRequirement 
    | BonusRequirement | SuccessBonusRequirement | NotRequirement | EmptyRequirement

export type OrRequirement = {
    ctype: "or-requirement",
    left: QuestRequirement,
    right: QuestRequirement,
}

export type AndRequirement = {
    ctype: "and-requirement",
    left: QuestRequirement,
    right: QuestRequirement,
}

export type BonusRequirement = {
    ctype: "bonus-requirement",
    bonus: number,
    left: QuestRequirement,
    right: QuestRequirement,
}

export type SuccessBonusRequirement = {
    ctype: "success-bonus-requirement",
    bonus: number,
    left: QuestRequirement,
    right: QuestRequirement,
}

export type APSRequirement = {
    ctype: "aps-requirement",
    athleticism: number,
    intellect: number,
    charisma: number,
}

export type ClassRequirement = {
    ctype: "class-requirement",
    class: string,
}

export type NotRequirement = {
    ctype: "not-requirement",
    continuation: QuestRequirement,
}

export type EmptyRequirement = {
    ctype: "empty-requirement",
}

export function mergeAPSRequirementMax(a: APSRequirement, b: APSRequirement): APSRequirement {
    return {
        ctype: "aps-requirement",
        athleticism: Math.max(a.athleticism, b.athleticism),
        intellect: Math.max(a.intellect, b.intellect),
        charisma: Math.max(a.charisma, b.charisma),
    }
}
