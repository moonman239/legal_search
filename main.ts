
// Function getSearchTerms
// given the user's input, queries the AI for search terms
// related to the user's legal case.
import fetch from "node-fetch";
type User = {"id":string,"display_name":string,"auth_method":string}
async function discordLogin()
{
    try
    {
        const resp = await fetch("https://projects.laion.ai/auth/callback/discord",{
            headers: {"Accept":"application/json"}
        });
        const json = await resp.json();
        console.log(JSON.stringify(json));
    }
    catch (e)
    {
        console.error("could not log in: " + e);
    }
}
async function getSearchTerms(userInput: string)
{
    let headers = {
        "Content-Type":"application/json",
        "Accept":"application/json"
    };
    let body = JSON.stringify({
  "type": "random",
  "user": {
    "id": "string",
    "display_name": "string",
    "auth_method": "discord"
  },
  "collective": false,
  "lang": "string"
});
    let resp = await fetch("https://projects.laion.ai/api/v1/tasks/",{
        headers: headers,
        body:body
    });
    let json = await resp.json();
    try
    {
        return (json as Array<{"generated_text":string}>)[0]["generated_text"];
    }
    catch (e)
    {
        console.error(e);
    }
}

discordLogin();