export const adventurer : DataAdventurer [] = [
    {
        id: "124412412q4",
        name: "rouge",
        experience: 1245135,
        adventurer_img: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        in_quest: false,
        on_chain_ref: "asdasd",
        // onRecruitment: false,
        sprites: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        type: "gma",
        metadata: {},
        race: "human",
        class: "rouge"
    },
    {
        id: "1244124124",
        name: "rouge",
        experience: 1245135,
        adventurer_img: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        in_quest: false,
        on_chain_ref: "asdasd",
        // onRecruitment: false,
        sprites: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        type: "gma",
        metadata: {},
        race: "human",
        class: "rouge"
    }, 
    {
        id: "124412d4124",
        name: "rouge",
        experience: 1245135,
        adventurer_img: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        in_quest: false,
        on_chain_ref: "asdasd",
        // onRecruitment: false,
        sprites: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        type: "gma",
        metadata: {},
        race: "human",
        class: "rouge"
    },
    {
        id: "1244124q24",
        name: "rouge",
        experience: 1245135,
        adventurer_img: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        in_quest: false,
        on_chain_ref: "asdasd",
        // onRecruitment: false,
        sprites: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        type: "gma",
        metadata: {},
        race: "human",
        class: "rouge"
    },
    {
        id: "1q244124124",
        name: "rouge",
        experience: 1245135,
        adventurer_img: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        in_quest: false,
        on_chain_ref: "asdasd",
        // onRecruitment: false,
        sprites: "https://d1f9hywwzs4bxo.cloudfront.net/pixeltiles/x3/pixel_tile_11.png",
        type: "gma",
        metadata: {},
        race: "human",
        class: "rouge"
    }
]


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

  
interface inProgressQuest{
    enrolls: enrolls []
    id: string
    is_claimed: boolean
    player_stake_address: string
    quest: quest
    quest_id: string
    started_on: string
    state: "failed" | "succeeded" | "in_progress" | null
}

interface quest{
    description: string
    difficulty: number
    duration: number
    id: string
    name: string
    rarity: string
    reward_ds: number
    reward_xp: number
    slots: number
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


export const inProgress : inProgressQuest [] = [
    {
        enrolls: [{
            adventurer: {
                id: "1244124q24",
                experience: 1245135,
                in_quest: false,
                on_chain_ref: "asdasd",
                // onRecruitment: false,
                type: "gma",
                metadata: {},
                player_stake_address: "ASdasdasfafasgsdgsadgsdg"
            },
            adventurer_id: "1244124q24",
            taken_quest_id: "123123sadf124qwrq"

        }],
        id: "asdasdasfgqhwyhhqfadh",
        is_claimed: false,
        player_stake_address: "ASdasdasfafasgsdgsadgsdg",
        quest_id: "124twqrgv3416aregtq",
        started_on: "25/11/22",
        state: "in_progress",
        quest:{
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            difficulty: 3,
            duration: 2,
            id: "qe123qwr123123asd12",
            name: "Kill the wolf",
            rarity: "townsfolk",
            reward_ds: 4,
            reward_xp: 1245,
            slots: 2,
        }
    },

    // {
    //     enrolls: [ {
    //         adventurer: {
    //             id: "1q244124124",
    //             experience: 12455,
    //             in_quest: true,
    //             on_chain_ref: "asdasd",
    //             // onRecruitment: false,
    //             type: "gma",
    //             metadata: {},
    //             player_stake_address: "ASdasdasfafsdgsadgsdg"
    //         },
    //         adventurer_id: "Asd12qdasf",
    //         taken_quest_id: "12323sadf124qwrq"

    //     }],
    //     id: "asdasdasfgqwyhhqfadh",
    //     is_claimed: false,
    //     player_stake_address: "ASdasdasfafsgsdgsadgsdg",
    //     quest_id: "124twqrgv3416aretq",
    //     started_on: "25/11/22",
    //     state: "succeeded",
    //     quest:{
    //         description: "Lorem Ipsum is simply dummy text of the printing and typeset text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //         difficulty: 3,
    //         duration: 1235,
    //         id: "qe123qwr123123asd12",
    //         name: "Kill the wolf",
    //         rarity: "townsfolk",
    //         reward_ds: 4,
    //         reward_xp: 1245,
    //         slots: 2,
    //     }
    // },

]  



interface availableQuest {
    uiid?: string
    id: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    width?: number
    height?: number
}

export const available : availableQuest [] = [
    {
        id: "ojkasodkikniokoqwe-asd-wqeadsd",
        name: "king quest",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        reward_ds: 10,
        reward_xp: 15,
        difficulty: 2,
        slots: 4,
        rarity: "townsfolk",
        duration: 2,
    },
    {
        id: "ojkasodkikniokoqwe-asd-wqeadsd",
        name: "king quest",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        reward_ds: 10,
        reward_xp: 15,
        difficulty: 2,
        slots: 4,
        rarity: "townsfolk",
        duration: 2,
    },
    {
        id: "ojkasodkikniokoqwe-asd-wqeadsd",
        name: "king quest",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        reward_ds: 10,
        reward_xp: 15,
        difficulty: 2,
        slots: 4,
        rarity: "townsfolk",
        duration: 25,
    },
    {
        id: "ojkasodkikniokoqwe-asd-wqeadsd",
        name: "king quest",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        reward_ds: 10,
        reward_xp: 15,
        difficulty: 2,
        slots: 4,
        rarity: "townsfolk",
        duration: 235,
    },
    {
        id: "ojkasodkikniokoqwe-asd-wqeadsd",
        name: "king quest",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        reward_ds: 10,
        reward_xp: 15,
        difficulty: 2,
        slots: 4,
        rarity: "townsfolk",
        duration: 2,
    },
    {
        id: "ojkasodkikniokoqwe-asd-wqeadsd",
        name: "king quest",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        reward_ds: 10,
        reward_xp: 15,
        difficulty: 2,
        slots: 4,
        rarity: "townsfolk",
        duration: 5,
    }
]