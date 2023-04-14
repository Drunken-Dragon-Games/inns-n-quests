import { DiscordConfig, verifyDiscordAuthCode } from "./code-verification.js"
import axios from 'axios';
import { success } from "../../tools-utils.js";

const stubDiscordConfig: DiscordConfig = {
    clientId: "",
    clientSecret: "",
    redirectValidate: "",
    redirectAdd: "",
    redirect: "",
}

test("discord code verification", async () => {
    const discordAuthCode = "whatever"
    jest.spyOn(axios, 'post').mockImplementation(async (url, params: any, headers) => {
        if (params.includes(`code=${discordAuthCode}`)) {
            return {
                data: {
                    access_token: "validToken",
                    expires_in: 1,
                    refresh_token: "validRefresh",
                    scope: "",
                    token_type: "Bearer"
                }
            }
        }
        else {
            return {
                data: {
                    access_token: "",
                    expires_in: 1,
                    refresh_token: "",
                    scope: "",
                    token_type: ""
                }
            }
        }
    });
    const result = await verifyDiscordAuthCode(discordAuthCode, stubDiscordConfig, "validate")
    const correctResult = success({ discordBearerToken: "Bearer validToken", refreshtoken: "validRefresh" })
    expect(result).toStrictEqual(correctResult)
})