//same story as with the discord message dsl
//i whant this fucnitonality and i think this makes it cleaner
// but i dont know were should i add this 
//              --santiago

import YAML from "yaml"
import { Ballot } from "./models"

export const isBallot = (obj: any): obj is Ballot => {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof obj.question === "string" &&
      Array.isArray(obj.options) &&
      obj.options.every((option: any) => typeof option === "string")
    )
  }
export const parseBallotYML = (argumentsString: string): {status: "ok" , payload: Ballot} | {status: "error" , reason: string} => {
      try {
        const parsedYAML = YAML.parse(argumentsString)
    
        if (isBallot(parsedYAML)) {
          return { status: "ok", payload: parsedYAML }
        } else {
          return { status: "error", reason: "Invalid YAML format. Please provide a YAML string with a 'question' property and an 'options' array containing string elements:\n```\nquestion: <Your question here>\noptions:\n  - Option 1\n  - Option 2\n  - Option 3\n```" }
        }
      } catch (error) {
        console.error("Error parsing YAML:", error)
        return { status: "error", reason: "Invalid YAML format. Please provide a YAML string with a 'question' property and an 'options' array containing string elements:\n```\nquestion: <Your question here>\noptions:\n  - Option 1\n  - Option 2\n  - Option 3\n```" }
      }
  }

  export const genBallotPreview = (ballot: Ballot): string =>  
  `**Preview of Ballot:**\n\n**Question:** ${ballot.question}\n\n**Options:**\n${ballot.options
        .map((option, index) => `${index + 1}. ${option}`)
        .join("\n")}\n\nPlease confirm by replying with **yes**. If you wish to cancel, reply with **no** or wait for 60 seconds for this request to time out.`
