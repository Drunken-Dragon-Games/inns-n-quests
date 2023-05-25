//I whant this functionallity but i dont know were to add it
//this is justa guess, if its a bad place pls tell me
//          --santiago

import { Message } from "discord.js"

export const getCommand = (message: Message): string => message.content.slice(1).trim().split(/ +/g).shift()?.toLowerCase() ?? ""

export const getSubCommand = (message: Message): string => {
    const words = message.content.trim().split(/[\s\n]+/)
    return words.length >= 2 ? words[1].toLowerCase() : ""
  }

export const getArguments = (message: Message): string => {
    const words = message.content.trim().split(/[\s\n]+/)
    return words.slice(2).join(" ")
  }

