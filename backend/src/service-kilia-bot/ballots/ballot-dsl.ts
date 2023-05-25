import { registerBallotType, BallotState, StoredBallot, AdminBallot } from "../models"

export const isBallot = (obj: any): obj is registerBallotType => {
  return (
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
  )
}

export const parseBallotInput = ( argumentsString: string): { status: "ok"; payload: registerBallotType } | { status: "error"; reason: string } => {
  const errString = "Invalid JSON format. Please provide a JSON string with the new format. Remember to format the message using backticks (```) and a `json` tag:\n````json\n{\n  \"question\": {\n    \"inquiry\": \"<Your question here>\",\n    \"description\": \"<Your question description here>\"\n  },\n  \"options\": [\n    {\n      \"title\": \"Option 1\",\n      \"description\": \"Description for Option 1\"\n    },\n    {\n      \"title\": \"Option 2\",\n      \"description\": \"Description for Option 2\"\n    },\n    {\n      \"title\": \"Option 3\",\n      \"description\": \"Description for Option 3\"\n    }\n  ]\n}\n````";
  try {
    const removedDiscordFormat = removeDiscordFormat(argumentsString)
    const parsedInput = JSON.parse(removedDiscordFormat)
    if (isBallot(parsedInput)) {
      return { status: "ok", payload: parsedInput }
    } else {
      console.error("String is not a Ballot")
      return { status: "error", reason: errString }
    }
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return { status: "error", reason: errString }
  }
}


export const genBallotPreview = (ballot: registerBallotType): string =>
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
  let formattedString = `**Inquiry:** ${storedBallot.inquiry}\n**Description of Inquiry:** ${storedBallot.descriptionOfInquiry}\n\n**Options:**\n`;


  storedBallot.options.forEach((option, index) => {
    formattedString += `\n${index + 1}. **Option:** ${option.option}\n`;
    formattedString += `**Description:** ${option.description}\n`;
    formattedString += `**Dragon Gold:** ${option.dragonGold}\n`;
  });

  formattedString += `\n**State:** ${storedBallot.state}`;

  return formattedString;
}

export const formatList = (storedBallots: { [ballotId: string]: AdminBallot; }): string => {
  return Object.values(storedBallots).map(value => `${value.id} - ${value.inquiry}`).join(`\n`)
}