import { AdminBallot, BallotRegistration, BallotState, StoredBallot } from "../../service-governance";

export const isBallot = (obj: any): obj is BallotRegistration =>
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.question === "object" &&
    obj.question !== null &&
    typeof obj.question.inquiry === "string" &&
    typeof obj.question.description === "string" &&
    Array.isArray(obj.options) &&
    obj.options.every(
        (option: any) =>
            typeof option === "object" &&
            option !== null &&
            typeof option.title === "string" &&
            typeof option.description === "string"
    )

export const parseBallotInput = (argumentsString: string): { status: "ok"; payload: BallotRegistration } | { status: "error"; reason: string } => {
    const exampleJson = {
        question: {
            inquiry: "<Your question here>",
            description: "<Your question description here>"
        },
        options: [
            {
                title: "Option 1",
                description: "Description for Option 1"
            },
            {
                title: "Option 2",
                description: "Description for Option 2"
            },
            {
                title: "Option 3",
                description: "Description for Option 3"
            },
        ],
        url: "(optional) <https://url-to-ballot.com>"
    }
    const errString = `Invalid JSON format. 
Please provide a JSON string with the new format. Remember to format the message using a json code block using triple backticks:
\`\`\`json
${JSON.stringify(exampleJson, null, 4)}
\`\`\``
    try {
        const removedDiscordFormat = removeDiscordFormat(argumentsString)
        const parsedInput = JSON.parse(removedDiscordFormat)
        if (isBallot(parsedInput))
            return { status: "ok", payload: parsedInput }
        else
            return { status: "error", reason: errString }
    } catch (error) {
        return { status: "error", reason: errString }
    }
}

export const genBallotPreview = (ballot: BallotRegistration): string =>
    `**Preview of Ballot:**\n\n**Question:** ${ballot.question.inquiry}\n**Description:** ${ballot.question.description}\n\n**Options:**\n${ballot.options
        .map((option, index) => `${index + 1}. ${option.title} - ${option.description}`)
        .join("\n")}\n\nPlease confirm by replying with **yes**. If you wish to cancel, reply with **no** or wait for 60 seconds for this request to time out.`;

export const removeDiscordFormat = (input: string): string => {
    const backticksRemoved = input.replace(/`/g, "")
    return backticksRemoved.replace(/\bjson\b/i, "").trim()
}

export const isBallotState = (state?: string): state is BallotState => {
    return state === "open" || state === "closed" || state === "archived";
}

export const formatStoredBallot = (storedBallot: StoredBallot): string => {
    let formattedString = `**Inquiry:** ${storedBallot.inquiry}\n**Description of Inquiry:** ${storedBallot.descriptionOfInquiry}\n\n**Options:**\n`

    storedBallot.options.forEach((option, index) => {
        formattedString += `\n${index + 1}. **Option:** ${option.option}\n`
        formattedString += `**Description:** ${option.description}\n`
        // format Dragon Gold
        const dragonGold = parseInt(option.dragonGold, 10) / 1_000_000;
        formattedString += `**Dragon Gold:** ${dragonGold.toFixed(6)}\n`
    });

    formattedString += `\n**State:** ${storedBallot.state}`

    return formattedString
}

export const formatList = (storedBallots: { [ballotId: string]: AdminBallot; }): string => {
    return Object.values(storedBallots).map(value => `${value.id} - ${value.inquiry}`).join(`\n`)
}