import { registerBallotType, BallotState, StoredBallot } from "../models"

export const isBallot = (obj: any): obj is registerBallotType => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.question === "string" &&
    Array.isArray(obj.options) &&
    obj.options.every(
      (option: any) =>
        typeof option === "object" &&
        typeof option.title === "string" &&
        typeof option.description === "string"
    )
  )
}

export const parseBallotInput = ( argumentsString: string): { status: "ok"; payload: registerBallotType } | { status: "error"; reason: string } => {
  const errString =  "Invalid YAML format. Please provide a YAML string with the new format:\n```\nquestion: <Your question here>\noptions:\n  Option 1:\n    description: Description for Option 1\n  Option 2:\n    description: Description for Option 2\n  Option 3:\n    description: Description for Option 3\n```"
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
    console.error("Error parsing YAML:", error)
    return { status: "error", reason: errString }
  }
}


export const genBallotPreview = (ballot: registerBallotType): string => 
`**Preview of Ballot:**\n\n**Question:** ${ballot.question}\n\n**Options:**\n${ballot.options
      .map((option, index) => `${index + 1}. ${option.title} - ${option.description}`)
      .join("\n")}\n\nPlease confirm by replying with **yes**. If you wish to cancel, reply with **no** or wait for 60 seconds for this request to time out.`

export const removeDiscordFormat = (input: string): string => {
        const backticksRemoved = input.replace(/`/g, "")
        return backticksRemoved.replace(/\bjson\b/i, "").trim()
}

export const isBallotState = (state?: string): state is BallotState => {
  return state === "open" || state === "closed" || state === "archived";
}

export const formatStoredBallot = (storedBallot: StoredBallot): string => {
  let formattedString = `**Inquiry:** ${storedBallot.inquiry}\n\n**Options:**\n`;

  storedBallot.options.forEach((option, index) => {
    formattedString += `\n${index + 1}. **Option:** ${option.option}\n`;
    formattedString += `**Description:** ${option.description}\n`;
    formattedString += `**Dragon Gold:** ${option.dragonGold}\n`;
  });

  formattedString += `\n**State:** ${storedBallot.state}`;

  return formattedString;
}