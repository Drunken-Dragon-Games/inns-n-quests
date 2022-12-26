export const discord_client_id = typeof process.env["NEXT_PUBLIC_DISCORD_CLIENT_ID"] == "string" ? process.env["NEXT_PUBLIC_DISCORD_CLIENT_ID"]! : "1006949761749897357"
export const discord_redirect_uri = typeof process.env["NEXT_PUBLIC_DISCORD_REDIRECT_URI"] == "string" ? process.env["NEXT_PUBLIC_DISCORD_REDIRECT_URI"]! : "http%3A%2F%2Flocalhost%3A3000%2FdiscordValidate"
export const discord_redirect_uri_add_to_account = typeof process.env["NEXT_PUBLIC_DISCORD_REDIRECT_URI_ADD_TO_ACCOUNT"] == "string" ? process.env["NEXT_PUBLIC_DISCORD_REDIRECT_URI_ADD_TO_ACCOUNT"]! : "http%3A%2F%2Flocalhost%3A3000%2FdiscordAdd"
export const discord_response_type = "code"
export const discord_scope = "identify%20email"

export const cardano_network = () : 0 | 1  =>{
    let number : 0 | 1 = 0

    if( typeof process.env["NEXT_PUBLIC_CARDANO_NETWORK"] == "string"){
        if(process.env["NEXT_PUBLIC_CARDANO_NETWORK"] == "mainnet"){
            
            number = 1
            return number
        }

        return number
    }

    return number
}

interface appsToShow {
    url: string
    name: string
    icon: string
    disable: boolean
}

export const appsToShow: appsToShow[] = [
    {
        url: "/",
        name: "Home",
        icon: "home",
        disable: false
    },
    {
        url: "/s2",
        name: "Browse",
        icon: "browse",
        disable: false
    },
    {
        url: "https://encyclopedia.drunkendragon.games/",
        name: "Encyclopedia",
        icon: "encyclopedia",
        disable: false
    },
    {
        url: "/trade",
        name: "Trading tools",
        icon: "trade",
        disable: true
    },
    {
        url: "/season_of_lore",
        name: "season of lore",
        icon: "event",
        disable: true
    },
    {
        url: "/games",
        name: "Games",
        icon: "game",
        disable: true
    },
    {
        url: "/registry",
        name: "Registry",
        icon: "registry",
        disable: true
    },
]


interface socialMedia {
    url: string
    name: string
    icon: string
}


export const socialMedia: socialMedia[] = [
    {
        url: "https://discord.gg/cY5ePtVJ57",
        name: "discord",
        icon: "discord"
    },
    {
        url: "https://twitter.com/DrunkenDragnEnt",
        name: "twitter",
        icon: "twitter"
    },
    {
        url: "https://www.reddit.com/r/DrunkenDragonGames/",
        name: "reddit",
        icon: "reddit"
    },
    {
        url: "https://www.instagram.com/drunkendragonentertainment/",
        name: "instagram",
        icon: "instagram"
    },
    {
        url: "https://www.facebook.com/DrunkenDragonEntertainment",
        name: "facebook",
        icon: "facebook"
    },
    {
        url: "https://www.drunkendragon.games/",
        name: "web",
        icon: "web"
    },
]


export const gamesButtonSection = {
    inns: "https://drunken-dragon-games.itch.io/drunken-dragon-inns-n-quests",
    quests: "/quests"
}

interface roadMap{
    title: string
    bullets: bullets []

}

interface bullets {
    title: string
    details: string
    completed: boolean
}

export const roadMap : roadMap[] =[
    {
        title: "2022 Q3",
        bullets: [
            {
                title: "Adventures of Thiolden Collection",
                details: "50 character with high-quality art",
                completed: true
            },
            {
                title: "Idle Quests Staking Game v1",
                details: "Send your adventures into quests and earn Dragon Silver tokens ($DS)!",
                completed: true
            },
            {
                title: "Drunken Dragon Universe App v1",
                details: "A one-stop-shop for all things Drunken Dragon",
                completed: true
            },
            {
                title: "Drunken Dragon Encyclopedia",
                details: "A wiki for all the Drunken Universe Lore",
                completed: true
            },
            {
                title: "Start of Genius X Multi-token ISPO",
                details: "Starts our share initial stake offering",
                completed: false
            },
        ]
    },
    {
        title: "2022 Q4",
        bullets: [
            {
                title: "Swapping Tools and Party Management Tools",
                details: "",
                completed: false
            },
            {
                title: "Idle Quests Combat",
                details: "Improved interaction of adventurers with idle quests, APS come to use",
                completed: false
            },
            {
                title: "Dragon Silver Shop",
                details: "Use earned $DS tokens on Drunken Dragon exclusive NFTs",
                completed: false
            },
            {
                title: "Dragon Silver Furniture",
                details: "Purchase at the Dragon Silver Shop furniture to keep building an epic tavern with the Inns app",
                completed: false
            },
            {
                title: "Dragon Silver Slimes PFP",
                details: "Purchase at the Dragon Silver Shop a profile picture collection of drink-themed slimes",
                completed: false
            },
            {
                title: "Season of Lore: Prelude",
                details: "A new type of RPG experience",
                completed: false
            },
        ]
    },
    {
        title: "2023 Q1",
        bullets: [
            {
                title: "Tokenized Resource Gathering and Furniture NFT Crafting",
                details: "For Idle Adventures, gather resources and use them to craft collectable Furniture",
                completed: false
            },
            {
                title: "End of Genius x Multi-token ISPO",
                details: "Ends our shared Initial Stake Pool Offering. Claim your Dragon Gold($DG)",
                completed: false
            },
            {
                title: "Drunken Dragon Inns Improvements",
                details: "Your tavern comes to life",
                completed: false
            },
            {
                title: "Voting V1",
                details: "Use your Drunken Dragon NFTs to vote on franchise decisions",
                completed: false
            },
        ]
    },
    {
        title: "2023 Q2",
        bullets: [
            {
                title: "Decentralized Treasury Fund 1",
                details: "Vote with your NFTs and Dragon Gold ($DG) on what projects to fund. These will be projects that will build products on top pf the Drunken Dragon Autonomous Franchise",
                completed: false
            },
        ]
    }
]