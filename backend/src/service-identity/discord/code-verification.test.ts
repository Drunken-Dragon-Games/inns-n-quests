import axios from 'axios';
import { succeeded } from "../../tools-utils";
import { DiscordConfig, verifyDiscordAuthCode } from "./code-verification";

const stubDiscordConfig: DiscordConfig = {
    clientId: "",
    clientSecret: "",
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
    const correctResult = succeeded({ discordBearerToken: "Bearer validToken", refreshtoken: "validRefresh" })
    expect(result).toStrictEqual(correctResult)
})